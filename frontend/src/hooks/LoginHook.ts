import { useCallback, useEffect, useState } from 'react';
import axios from 'Axios';
import { login } from '../api/api';

export const useLogin = (username: string, password: string) => {
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const getLoginStatus = useCallback(async () => {
    const response = await login(username, password);
    console.log(response);
  }, [username, password]);

  useEffect(() => {
    const data = getLoginStatus();
    if (data) setLoading(false);
  }, [username, password]);
};
