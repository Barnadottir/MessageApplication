import { useState } from 'react';
import styles from './ChatWindow.module.scss';

const ChatWindow = () => {
  const [currentMessage, setCurrentMessage] = useState<string>('');

  return (
    <div className={styles['chatwindow--wrapper']}>
      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        placeholder="write a message..."
      ></input>
    </div>
  );
};

export default ChatWindow;
