import { useState } from 'react';
import styles from './ToggleButton.module.scss';

type ToggleButtonProps = {
  style?: 'outlined' | 'text' | 'full';
  onClick?: () => void;
  toggle?: 'login' | 'signup';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const ToggleButton = ({
  style = 'outlined',
  onClick,
  toggle,
  children,
  ...rest
}: ToggleButtonProps) => {
  return (
    <button
      className={`${styles.toggleButton} ${styles[style]}`}
      onClick={onClick}
      {...rest}
    >
      <span
        className={`${styles.label} ${toggle === 'login' ? styles.active : ''}`}
      >
        Login
      </span>
      <span
        className={`${styles.label} ${toggle === 'signup' ? styles.active : ''}`}
      >
        Signup
      </span>
    </button>
  );
};

export default ToggleButton;
