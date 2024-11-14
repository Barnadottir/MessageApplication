import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LoginPage from './login/LoginPage';
import styles from './HomePage.module.scss';
import ChatWindow from './chatWindow/ChatWindow';
import FriendList from './FriendList/FriendList';

const HomePage = () => {
  const { loggedIn } = useContext(AuthContext);
  console.log('loggedin -> ', loggedIn);

  return (
    <div className={styles['homepage--wrapper']}>
      {loggedIn ? (
        <div className={styles['main-chat--wrapper']}>
          <FriendList />
          <ChatWindow />
        </div>
      ) : (
        <LoginPage />
      )}
    </div>
  );
};

export default HomePage;
