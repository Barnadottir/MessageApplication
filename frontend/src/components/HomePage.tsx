import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LoginPage from './login/LoginPage';
import styles from './HomePage.module.scss';
import ChatWindow from './chatWindow/ChatWindow';
import FriendList from './FriendList/FriendList';
import { FriendProvider } from '../contexts/FriendContext';
import CommunityPage from './communitypage/CommunityPage';

const HomePage = () => {
  const { loggedIn } = useContext(AuthContext);

  return (
    <div className={styles['homepage--wrapper']}>
      {loggedIn ? (
        <div className={styles['main-chat--wrapper']}>
          <FriendProvider>
            <CommunityPage />
            <FriendList />
            <ChatWindow />
          </FriendProvider>
        </div>
      ) : (
        <LoginPage />
      )}
    </div>
  );
};

export default HomePage;
