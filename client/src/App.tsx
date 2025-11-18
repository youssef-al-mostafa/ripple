import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Chat } from './components/Chat';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');

    if (savedToken && savedUsername) {
      setToken(savedToken);
      setUsername(savedUsername);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (newToken: string, newUsername: string) => {
    setToken(newToken);
    setUsername(newUsername);
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = (newToken: string, newUsername: string) => {
    setToken(newToken);
    setUsername(newUsername);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    setIsAuthenticated(false);
    setShowLogin(true);
  };

  if (isAuthenticated && token && username) {
    return <Chat token={token} username={username} onLogout={handleLogout} />;
  }

  if (showLogin) {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setShowLogin(false)}
      />
    );
  }

  return (
    <Register
      onRegisterSuccess={handleRegisterSuccess}
      onSwitchToLogin={() => setShowLogin(true)}
    />
  );
}

export default App;
