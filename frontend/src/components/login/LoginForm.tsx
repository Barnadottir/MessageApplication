import React, { useState } from 'react';
import styles from './LoginForm.module.scss';

const LoginForm = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <form
      className={styles['login-form']}
      onSubmit={(e) => console.log('here')}
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
      <button type="submit">Login!</button>
    </form>
  );
};

export default LoginForm;
