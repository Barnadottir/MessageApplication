import { useEffect, useState } from 'react';
import styles from './FriendList.module.scss';
import { getFriendsList } from '../../api/api';

interface FriendListType {
  username: string;
  full_name: string;
}

const FriendList = () => {
  const [friendList, setFriendList] = useState<Array<FriendListType> | null>(
    null,
  );

  useEffect(() => {
    const getFriends = async () => {
      const response = await getFriendsList();
      setFriendList(response.data);
    };
    getFriends();
  }, []);

  return (
    <div className={styles['friendlist--wrapper']}>
      <h2 className={styles['friendlist--title']}>Friend List</h2>
      <div className={styles['friendlist--container']}>
        {friendList &&
          friendList.map((friend) => (
            <div key={friend.username} className={styles['friend-card']}>
              <div className={styles['friend-name']}>{friend.full_name}</div>
              <div className={styles['friend-username']}>
                @{friend.username}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FriendList;
