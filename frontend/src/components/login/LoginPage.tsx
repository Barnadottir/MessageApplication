import React, { useState, useEffect } from 'react';
import styles from './LoginPage.module.scss';
import ToggleButton from '../buttons/ToggleButton';
import SignupForm from '../signup/SignupForm';
import LoginForm from './LoginForm';

const LoginPage = () => {
  const [formState, setFormState] = useState<'login' | 'signup'>('login');

  return (
    <div className={styles['login-form-page--wrapper']}>
      <div className={styles['login-form--wrapper']}>
        <ToggleButton
          toggle={formState}
          onClick={() => {
            setFormState((prev) => (prev === 'login' ? 'signup' : 'login'));
            console.log('click');
          }}
          styles={{ position: 'fixed', top: '20%;' }}
        >
          {formState}
        </ToggleButton>
        {formState === 'login' ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
};

export default LoginPage;
