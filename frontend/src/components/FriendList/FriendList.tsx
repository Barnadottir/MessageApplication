import { useContext, useEffect, useState } from 'react';
import styles from './FriendList.module.scss';
import { getFriendsList } from '../../api/api';
import { FriendContext } from '../../contexts/FriendContext';
import { AuthContext } from '../../contexts/AuthContext';
import UsersSearch from '../usersSearch/UsersSearch';
import Logout from '../logout/Logout';

interface FriendListType {
  username: string;
  full_name: string;
}

const FriendList = () => {
  const [friendList, setFriendList] = useState<Array<FriendListType> | null>(
    null,
  );
  const { setFriend } = useContext(FriendContext);
  const { username } = useContext(AuthContext);
  const [users, setUsers] = useState<Array<string> | null>(null);

  useEffect(() => {
    const getFriends = async () => {
      const response = await getFriendsList();
      setFriendList(response.data);
    };
    getFriends();
  }, []);

  return (
    <div className={styles['friendlist--wrapper']}>
      <h2>Welcome {username}</h2>
      <Logout />
      <UsersSearch users={users} setUsers={setUsers} />
      {!users ? (
        <div className={styles['friendlist--container']}>
          {friendList &&
            friendList.map((friend) => (
              <div
                key={friend.username}
                className={styles['friend-card']}
                onClick={() => setFriend(friend.username)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === 'Enter' && setFriend(friend.username)
                }
              >
                <div className={styles['friend-name']}>{friend.full_name}</div>
                <div className={styles['friend-username']}>
                  {friend.username}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className={styles['friendlist--container']}>
          {users.map((user) => (
            <div
              key={user}
              className={styles['friend-card']}
              onClick={() => {}}
              role="button"
              tabIndex={0}
            >
              <div className={styles['friend-name']}>{user}</div>
              <div className={styles['friend-username']}>{user}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendList;
