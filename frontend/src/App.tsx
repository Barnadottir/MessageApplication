import React from 'react';
import LoginPage from './components/login/LoginPage';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './components/HomePage';

function App() {
  document.body.style.overflow = 'hidden';
  document.body.style.margin = '0';
  return (
    <>
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    </>
  );
}

export default App;
