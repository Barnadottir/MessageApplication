import React, { useState, useEffect } from 'react';
import styles from './signupForm.module.scss';

const SignupForm = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [secondPass, setSecondPass] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  return (
    <form
      className={styles['signup-form']}
      onSubmit={(e) => console.log('here')}
    >
      <label>signup form</label>

      <input
        required
        placeholder="email..."
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      ></input>

      <input
        required
        type="text"
        value={username}
        placeholder="username..."
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        required
        type="password"
        placeholder="password..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        required
        type="password"
        placeholder="confirm password..."
        value={secondPass}
        onChange={(e) => setSecondPass(e.target.value)}
      ></input>

      <button type="submit">signup!</button>
    </form>
  );
};

export default SignupForm;
