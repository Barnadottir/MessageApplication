import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextProps {
  username: string | null;
  setUsername: (e: string) => void;
  loggedIn: boolean;
  setLoggedIn: (e: boolean) => void;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{ loggedIn, setLoggedIn, username, setUsername }}
    >
      {children}
    </AuthContext.Provider>
  );
};
