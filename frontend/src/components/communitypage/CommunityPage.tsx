import styles from './CommunityPage.module.scss';
import UserSearchPage from './UserSearchPage';
import GroupListPage from './GroupListPage';

const CommunityPage = () => {
  return (
    <div className={styles['community-page--wrapper']}>
      <UserSearchPage />
      <GroupListPage />
    </div>
  );
};

export default CommunityPage;
