import React, { useCallback, useContext, useEffect, useState } from 'react';
import styles from './LoginForm.module.scss';
import { login } from '../../api/api';
import { AuthContext } from '../../contexts/AuthContext';
import Cookies from 'js-cookie';

const LoginForm = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { setLoggedIn, setUsername: setContextUsername } =
    useContext(AuthContext);

  const getLoginStatus = useCallback(async () => {
    try {
      const response = await login(username, password);

      if (response.status == 200) {
        console.log('here');

        setSuccess(true);
        setLoggedIn(true);
        setContextUsername(username);
        Cookies.set('Token', 'true', { expires: 15 * 60 * 1000 });
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [username, password]);

  useEffect(() => {
    if (loading) {
      getLoginStatus();
    }
  }, [loading, getLoginStatus]);

  return (
    <form
      className={styles['login-form']}
      onSubmit={(e) => {
        e.preventDefault();
        if (!loading) {
          setLoading(true); // Set loading to true only if it's not already loading
        }
      }}
    >
      <label>Login form</label>
      <input
        required
        type="text"
        placeholder="username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        required
        placeholder="...password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Login!'}
      </button>
      {success && <p>Login successful!</p>}
      {!success && !loading && <p>Login failed. Please try again.</p>}
    </form>
  );
};

export default LoginForm;
