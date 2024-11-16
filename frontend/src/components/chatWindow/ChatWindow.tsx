import { useCallback, useContext, useEffect, useState } from 'react';
import styles from './ChatWindow.module.scss';
import { getChatMessages, sendMessage } from '../../api/api';
import { FriendContext } from '../../contexts/FriendContext';
import { AuthContext } from '../../contexts/AuthContext';

interface ChatData {
  message: string;
  timestamp: string;
  sender: 'self' | 'other';
}

const ChatWindow = () => {
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [chatData, setChatData] = useState<ChatData[]>([]);
  const { friend } = useContext(FriendContext);
  const { username } = useContext(AuthContext);

  console.log('username -> ', username);

  const fetchData = async () => {
    try {
      const response = await getChatMessages(friend);
      setChatData(response.data);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [friend]);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/chat/${username}`);

    socket.onmessage = (event) => {
      console.log('new message -> ', event);

      fetchData();
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => socket.close();
  }, [friend]);

  const sendCurrentMessage = useCallback(async () => {
    // Send message through REST API
    await sendMessage(currentMessage, friend);

    // Optionally, manually update chatData if you want an instant update in the UI
    setChatData((prevChatData) => [
      ...prevChatData,
      {
        message: currentMessage,
        timestamp: new Date().toISOString(),
        sender: 'self',
      },
    ]);

    setCurrentMessage('');
  }, [friend, currentMessage]);

  return (
    <div className={styles['chatwindow--wrapper']}>
      <div className={styles['chatwindow--messages']}>
        {chatData.map((chat, index) => (
          <div key={index} className={`${styles.message} ${chat.sender === friend ? styles.received : styles.sent}`}>
            <p>{chat.message}</p>
            <span className={styles.timestamp}>{chat.timestamp}</span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        placeholder="Write a message..."
        className={styles['chatwindow--input']}
        onKeyDown={(e) => e.key === 'Enter' && sendCurrentMessage()}
      />
    </div>
  );
};

export default ChatWindow;
