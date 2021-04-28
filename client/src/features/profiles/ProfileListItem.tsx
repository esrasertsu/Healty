import React, { useContext } from 'react';
import { Card, Image, Icon, Grid, Label} from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';
import { history } from '../../index'
import { RootStoreContext } from '../../app/stores/rootStore';
import { StarRating } from '../../app/common/form/StarRating';
interface IProps {
    profile: IProfile
}

const ProfileListItem: React.FC<IProps> = ({profile}) => {

  const rootStore = useContext(RootStoreContext);
  const {setLoadingProfile} = rootStore.profileStore;

  return (
    <Card onClick={() => {
      history.push(`/profile/${profile.userName}`)
      setLoadingProfile(true);
      }} >
      <Image src={profile.image || '/assets/user.png'} />
      <Label className="profileCard_Label" color="blue" horizontal>
        Fitness
      </Label>
      <Card.Content className="profileCard_Content">
        <Card.Header>{profile.displayName}</Card.Header>
        <Card.Description>
          <div>Personal Trainer</div>
          <div> <Icon name="spinner" />3-5 yıl tecrübe</div>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Grid>
          <Grid.Row className="profileCard_footer">
          <Grid.Column className="starRatingColumn">
          <StarRating rating={profile.star} editing={false} size={'small'} count={profile.starCount}/>
          </Grid.Column> 
          <Grid.Column className="followerCountColumn">
          <Icon name='user' />
          {profile.followerCount}
          </Grid.Column>  
          </Grid.Row>
        </Grid>
      </Card.Content>
    </Card>
  );
};

export default ProfileListItem;
