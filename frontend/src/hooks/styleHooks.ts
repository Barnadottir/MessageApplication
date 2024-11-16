import { useEffect, useState } from 'react';

export const useScroll = () => {
  const [scrollable, setScrollable] = useState<boolean>(false);

  useEffect(() => {
    if (scrollable) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
  }, [scrollable]);

  return { setScrollable };
};
