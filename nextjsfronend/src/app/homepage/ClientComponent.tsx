'use client';

import { useEffect, useState } from 'react';

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Wrap async logic inside a function
    function fetchData() {
      fetch('https://jsonplaceholder.typicode.com/posts')
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch data');
          }
          return res.json();
        })
        .then((result) => {
          setData(result);
        })
        .catch((error) => {
          console.error(error.message);
        });
    }

    fetchData();
  }, []);

  return (
    <div>
      <button onClick={() => setCount((prev) => prev + 1)}>{count}</button>
      {
        data && <p>{data[0]?.body}</p> // Safely access the first item's body
      }
    </div>
  );
}
