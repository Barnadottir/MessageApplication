import { useContext, useEffect, useState } from 'react';
import styles from './FriendList.module.scss';
import { addFriend, getFriendsList } from '../../api/api';
import { FriendContext } from '../../contexts/FriendContext';
import { AuthContext } from '../../contexts/AuthContext';
import UsersSearch from '../usersSearch/UsersSearch';
import Logout from '../logout/Logout';
import { FaUserFriends } from 'react-icons/fa';
import { ImNotification } from 'react-icons/im';

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
  const friendsUsernames = friendList?.map((friend) => friend.username);
  const handleAddFriend = async (friend: string) => {
    let response = await addFriend(friend);
    if (response.status === 200) {
      response = await getFriendsList();
      setFriendList(response.data);
    }
  };

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
      <div style={{ position: 'relative' }}>
        <div className={styles['style-cards--wrapper']}>
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
                    <div className={styles['friend-name']}>
                      {friend.full_name}
                    </div>
                    <div className={styles['friend-username']}>
                      {friend.username}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className={styles['friendlist--container']}>
              {users.map((user) => (
                <button
                  key={user}
                  className={styles['friend-card']}
                  onClick={() => {
                    handleAddFriend(user);
                  }}
                  disabled={friendsUsernames?.includes(user)}
                  role="button"
                  tabIndex={0}
                >
                  {friendsUsernames?.includes(user) && <FaUserFriends />}
                  <div className={styles['friend-name']}>{user}</div>
                  <div className={styles['friend-username']}>{user}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendList;
