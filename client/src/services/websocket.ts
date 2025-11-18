import { WebSocketMessage, MessageType, Message } from '../types';

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimeout: number = 1000;
  private maxReconnectTimeout: number = 30000;
  private currentReconnectTimeout: number = 1000;
  private shouldReconnect: boolean = true;
  private messageHandlers: Map<MessageType, ((data: any) => void)[]> = new Map();
  private token: string | null = null;

  connect(token: string): void {
    this.token = token;
    this.shouldReconnect = true;
    this.createConnection();
  }

  private createConnection(): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    if (!this.token) {
      console.error('No token available for WebSocket connection');
      return;
    }

    const WS_URL = `ws://localhost:3000?token=${this.token}`;

    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.currentReconnectTimeout = this.reconnectTimeout;
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.ws = null;

        if (this.shouldReconnect) {
          setTimeout(() => {
            this.currentReconnectTimeout = Math.min(
              this.currentReconnectTimeout * 2,
              this.maxReconnectTimeout
            );
            this.createConnection();
          }, this.currentReconnectTimeout);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach((handler) => handler(message.payload));
    }
  }

  on(type: MessageType, handler: (data: any) => void): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type)!.push(handler);
  }

  off(type: MessageType, handler: (data: any) => void): void {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  sendMessage(text: string, roomId: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: MessageType.MESSAGE,
        payload: { text, roomId },
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  joinRoom(roomId: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: MessageType.JOIN,
        payload: { roomId },
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  sendTyping(roomId: string, isTyping: boolean): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: MessageType.TYPING,
        payload: { roomId, isTyping },
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export const wsService = new WebSocketService();
