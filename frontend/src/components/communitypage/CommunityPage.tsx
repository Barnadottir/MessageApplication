import React, { useContext, useEffect, useState } from 'react';
import UsersSearch from '../usersSearch/UsersSearch';
import styles from './CommunityPage.module.scss';
import { addFriend, getFriendsList } from '../../api/api';
import { FriendContext } from '../../contexts/FriendContext';
import { AuthContext } from '../../contexts/AuthContext';
import { FaUserFriends } from 'react-icons/fa';

interface FriendListType {
  username: string;
  full_name: string;
}

const CommunityPage = () => {
  const [users, setUsers] = useState<Array<string> | null>(null);
  const [friendList, setFriendList] = useState<Array<FriendListType> | null>(
    null,
  );

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
    <div className={styles['community-page--wrapper']}>
      <UsersSearch users={users} setUsers={setUsers} />
      <div className={styles['community-page--container']}>
        {users &&
          users.map((user) => (
            <button
              key={user}
              className={styles['community-page-card']}
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
    </div>
  );
};

export default CommunityPage;
