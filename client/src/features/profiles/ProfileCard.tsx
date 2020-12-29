import React, { useContext } from 'react';
import { Card, Image, Icon} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IProfile } from '../../app/models/profile';
import { history } from '../../index'
import { RootStoreContext } from '../../app/stores/rootStore';
interface IProps {
    profile: IProfile
}

const ProfileCard: React.FC<IProps> = ({profile}) => {

  const rootStore = useContext(RootStoreContext);
  const {setLoadingProfile} = rootStore.profileStore;

  return (
    <Card onClick={() => {
      history.push(`/profile/${profile.userName}`)
      setLoadingProfile(true);
      }} >
      <Image src={profile.image || '/assets/user.png'} />
      <Card.Content>
        <Card.Header>{profile.displayName}</Card.Header>
      </Card.Content>
      <Card.Content extra>
        <div>
          <Icon name='user' />
          {profile.followerCount}
        </div>
      </Card.Content>
    </Card>
  );
};

export default ProfileCard;
