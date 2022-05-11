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

  const handleCardClick = (e:any) => {
    e.stopPropagation() ;
    //     if(!isLoggedIn)
    // {    var str = `/profile/${profile.userName}`;
    //      handleLoginClick(e,str);
    // }
    // else
    // {
      history.push(`/profile/${profile.userName}`)
   // }
      
}

  return (
    <Card onClick={handleCardClick}>
      <Image src={profile.image || '/assets/user.png'} 
      onError={(e:any)=>{e.target.onerror = null; e.target.src='/assets/user.png'}}/>
      <Card.Content style={{paddingBottom:"0"}}>
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
