import next from 'next';
import ClientComponent from './clientComponent';

async function getData() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function Homepage() {
  const data = await getData();

  return (
    <div>
      <h1 style={{ paddingTop: '0', marginBlockStart: '0' }}>
        Welcome to the homepage
      </h1>
      {data[0].body}

      <ClientComponent />
    </div>
  );
}
