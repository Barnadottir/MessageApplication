import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LoginPage from './login/LoginPage';
import styles from './HomePage.module.scss';

const HomePage = () => {
  const { loggedIn, username } = useContext(AuthContext);
  console.log('loggedin -> ', loggedIn);

  return (
    <div className={styles['homepage--wrapper']}>
      {loggedIn ? <div>{`Welcome back ${username}`}</div> : <LoginPage />}
    </div>
  );
};

export default HomePage;
