import { useState } from 'react';
import styles from './Button.module.scss';

type ButtonProps = {
  style?: 'outlined' | 'text' | 'full';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ style = 'outlined', children, ...rest }: ButtonProps) => {
  return (
    <button className={`${styles.Button} ${styles[style]}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
