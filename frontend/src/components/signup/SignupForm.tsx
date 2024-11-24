import React, { useState, useEffect } from 'react';
import styles from './signupForm.module.scss';
import { signup } from '../../api/api';

interface SignupType {
  username: string;
  email: string;
  full_name: string;
  password: string;
}

const SignupForm = () => {
  const [signupData, setSignupData] = useState<SignupType>({
    username: '',
    email: '',
    full_name: '',
    password: '',
  });
  const [secondPass, setSecondPass] = useState<string>('');

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log('here');

    const response = await signup(
      signupData.username,
      signupData.email,
      signupData.full_name,
      signupData.password,
    );
    if (response.status === 200) console.log('signup successfull!');
    console.log(response);
  };

  return (
    <form className={styles['signup-form']} onSubmit={(e) => handleSignup(e)}>
      <label>signup form</label>

      <input
        required
        type="text"
        value={signupData.username}
        placeholder="username..."
        onChange={(e) =>
          setSignupData((prev) => ({
            ...prev,
            username: e.target.value,
          }))
        }
      />

      <input
        required
        placeholder="email..."
        type="email"
        value={signupData.email}
        onChange={(e) =>
          setSignupData((prev) => ({
            ...prev,
            email: e.target.value,
          }))
        }
      ></input>

      <input
        required
        placeholder="full name..."
        type="text"
        value={signupData.full_name}
        onChange={(e) =>
          setSignupData((prev) => ({
            ...prev,
            full_name: e.target.value,
          }))
        }
      ></input>

      <input
        required
        type="password"
        placeholder="password..."
        value={signupData.password}
        onChange={(e) =>
          setSignupData((prev) => ({
            ...prev,
            password: e.target.value,
          }))
        }
      />
      {secondPass && secondPass != signupData.password && (
        <span>password non-matching!</span>
      )}
      <input
        required
        type="password"
        placeholder="confirm password..."
        value={secondPass}
        onChange={(e) => setSecondPass(e.target.value)}
      ></input>

      <button type="submit" disabled={secondPass != signupData.password}>
        signup!
      </button>
    </form>
  );
};

export default SignupForm;
