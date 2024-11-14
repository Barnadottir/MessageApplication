import { useEffect, useState } from 'react';
import styles from './ChatWindow.module.scss';
import { getChatMessages } from '../../api/api';

interface ChatData {
  message: string;
  timestamp: string;
  sender: 'self' | 'other'; // Added a `sender` property to distinguish messages
}

const ChatWindow = () => {
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [chatData, setChatData] = useState<ChatData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getChatMessages('oskar');
        setChatData(response.data);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles['chatwindow--wrapper']}>
      <div className={styles['chatwindow--messages']}>
        {chatData.map((chat, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              chat.sender === 'self' ? styles.sent : styles.received
            }`}
          >
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
      />
    </div>
  );
};

export default ChatWindow;
