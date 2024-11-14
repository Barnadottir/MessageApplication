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
      friendlist
      <div>
        {friendList &&
          friendList.map((friend: FriendListType) => (
            <div>{friend.full_name}</div>
          ))}
      </div>
    </div>
  );
};

export default FriendList;
