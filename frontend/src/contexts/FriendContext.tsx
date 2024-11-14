import { createContext, useState, ReactNode } from 'react';

interface FriendContextProps {
  friend: string;
  setFriend: (e: string) => void;
}

export const FriendContext = createContext({} as FriendContextProps);

export const FriendProvider = ({ children }: { children: ReactNode }) => {
  const [friend, setFriend] = useState<string>('');

  return (
    <FriendContext.Provider value={{ friend, setFriend }}>
      {children}
    </FriendContext.Provider>
  );
};
