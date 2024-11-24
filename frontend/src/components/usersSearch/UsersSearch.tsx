import { useEffect, useState } from 'react';
import styles from './UsersSearch.module.scss';
import { searchUsers } from '../../api/api';

interface User {
  username: string;
  full_name: string;
}

interface UsersSearch extends React.HTMLAttributes<HTMLDivElement> {
  users?: string[] | null;
  setUsers: (e: string[] | null) => void;
}

const UsersSearch = ({ setUsers, ...res }: UsersSearch) => {
  const [searchString, setSearchString] = useState<string>('');
  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchString) {
        setUsers(null);
        return;
      }
      const response = await searchUsers(searchString);

      if (response.data) {
        if (response.data.length === 0) {
          setUsers(null);
          return;
        }
        setUsers(response.data.map((user: User) => user.username));
      }
    };
    fetchUsers();
  }, [searchString]);
  return (
    <div className={styles['search-input--wrapper']} {...res}>
      <input
        type="text"
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
        placeholder="Search Users..."
        className={styles['search--input']}
      />
    </div>
  );
};

export default UsersSearch;
