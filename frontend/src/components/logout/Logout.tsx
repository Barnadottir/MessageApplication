import { IoLogOut } from 'react-icons/io5';
import styles from './Logout.module.scss';
import Button from '../buttons/Button';
import { useContext, useState } from 'react';
import { logout } from '../../api/api';
import { AuthContext } from '../../contexts/AuthContext';

const Logout = () => {
  const [signout, setSignout] = useState<boolean>(false);
  const { username, setUsername, setLoggedIn } = useContext(AuthContext);

  const handleSignout = async () => {
    if (signout) return;

    setSignout(true);
    const response = await logout();
    if (response) {
      console.log('here -> ', response);
      setUsername('');
      setLoggedIn(false);
      setSignout(false);
    }
  };

  return (
    <div className={styles['logout--wrapper']}>
      <Button onClick={handleSignout} disabled={signout}>
        <span>{signout ? 'Loggin out...' : 'Logout'}</span>
        <IoLogOut />
      </Button>
    </div>
  );
};

export default Logout;
