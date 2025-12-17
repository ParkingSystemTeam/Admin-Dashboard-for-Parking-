import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { UserPage } from './components/UserPage';
import React from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  if (!isAdminRoute) {
    return <UserPage />;
  }

  return (
    <div className="size-full">
      {isLoggedIn ? (
        <Dashboard onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}
