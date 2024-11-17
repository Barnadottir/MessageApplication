import React, { createContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthContextProps {
  username: string | null;
  setUsername: (e: string) => void;
  loggedIn: boolean;
  setLoggedIn: (e: boolean) => void;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(
    Cookies.get('Token') ? true : false,
  );
  const [username, setUsername] = useState<string>(
    Cookies.get('username') ?? '',
  );

  useEffect(() => {
    if (!loggedIn) Cookies.remove('Token');
  }, [loggedIn]);

  useEffect(() => {
    if (!username) Cookies.remove('username');
  }, [username]);

  return (
    <AuthContext.Provider
      value={{ loggedIn, setLoggedIn, username, setUsername }}
    >
      {children}
    </AuthContext.Provider>
  );
};
