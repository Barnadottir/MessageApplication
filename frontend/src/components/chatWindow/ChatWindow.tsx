import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styles from './ChatWindow.module.scss';
import { getChatMessages, sendMessage } from '../../api/api';
import { FriendContext } from '../../contexts/FriendContext';
import { AuthContext } from '../../contexts/AuthContext';
import notifcationSound from '../../assets/notifcationSound.wav';
import { useScroll } from '../../hooks/styleHooks';
import { IoIosSend } from 'react-icons/io';

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
  const { setScrollable } = useScroll();
  const scrollRef = useRef<HTMLDivElement | null>(null);

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

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatData]);

  const strippedURI = __VITE_BACKEND_URI__.replace(/^https?:\/\//, '');
  useEffect(() => {
    const socket = new WebSocket(`wss://${strippedURI}/ws/chat/${username}`);
    console.log('socket -> ', socket);

    const playAlertSound = () => {
      const audio = new Audio(notifcationSound);
      audio.play().catch((error) => {
        console.error('Error playing alert sound:', error);
      });
    };

    socket.onmessage = (event) => {
      console.log('new message -> ', event);
      fetchData();
      playAlertSound();
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => socket.close();
  }, [friend, username]);

  const sendCurrentMessage = useCallback(async () => {
    await sendMessage(currentMessage, friend);

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
      <div
        ref={scrollRef}
        className={styles['chatwindow--messages']}
        onMouseEnter={() => setScrollable(false)}
      >
        {chatData.map((chat, index) => (
          <div
            key={index}
            className={`${styles.message} ${chat.sender === friend ? styles.received : styles.sent}`}
          >
            <p>{chat.message}</p>
            <span className={styles.timestamp}>{chat.timestamp}</span>
          </div>
        ))}
      </div>
      <div className={styles['chatwindow-input--wrapper']}>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Write a message..."
          className={styles['chatwindow--input']}
          onKeyDown={(e) => e.key === 'Enter' && sendCurrentMessage()}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
