import React, { useContext } from 'react';
import { Card, Image, Grid} from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';
import { history } from '../../index'
import { RootStoreContext } from '../../app/stores/rootStore';
import { StarRating } from '../../app/common/form/StarRating';
interface IProps {
    profile: IProfile
}

const ProfileCard: React.FC<IProps> = ({profile}) => {

  const rootStore = useContext(RootStoreContext);
  const {setLoadingProfile} = rootStore.profileStore;

  return (
    <Card onClick={(e:any) => {
      e.stopPropagation();
      setLoadingProfile(true);
      history.push(`/profile/${profile.userName}`)
      
      }} >
      <Image src={profile.image || '/assets/user.png'} />
      <Card.Content>
        <Card.Header>{profile.displayName}</Card.Header>
      </Card.Content>
      <Card.Content extra>
        <Grid>
          <Grid.Row className="profileCard_footer">
          {/* <Grid.Column className="followerCountColumn">
          <Icon size="mini" name='user' />
          {profile.followerCount}
          </Grid.Column>  */}
          <Grid.Column className="starRatingColumn">
          <StarRating rating={profile.star} editing={false} size={'tiny'} count={profile.starCount} showCount={true}/>
          </Grid.Column>  
          </Grid.Row>
        </Grid>
      </Card.Content>
    </Card>
  );
};

export default ProfileCard;
