import React, { useContext, useEffect } from 'react';
import { Card, Image, Icon, Grid, Label} from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';
import { history } from '../../index'
import { RootStoreContext } from '../../app/stores/rootStore';
import { StarRating } from '../../app/common/form/StarRating';
import { Link } from 'react-router-dom';
import { colors } from '../../app/models/category';
interface IProps {
    profile: IProfile
}

const ProfileListItem: React.FC<IProps> = ({profile}) => {

  const rootStore = useContext(RootStoreContext);
  const {setLoadingProfile} = rootStore.profileStore;
        let index = colors.findIndex(x => x.key === (profile.categories.length>0 ? profile.categories[0].text : "Spor"));
        let color = colors[index].value
 
  return (
    <Card onClick={() => {
      setLoadingProfile(true);
      history.push(`/profile/${profile.userName}`)
      }}
    key={profile.userName} >
      <Image circular src={profile.image || '/assets/user.png'} />
      <Label className="profileCard_Label" style={{background:color}} horizontal>
        {profile.categories.length>0 && profile.categories[0].text}
      </Label>
      <Card.Content className="profileCard_Content">
        <Card.Header>{profile.displayName}</Card.Header>
        <Card.Description>
          <div>{profile.subCategories.length> 0 && profile.subCategories.map<React.ReactNode>(s => <span>{s.text}</span>).reduce((prev, cur) => [prev, ',', cur])}</div>
          <div> <Icon name="spinner" />{profile.experienceYear} yıl tecrübe</div>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Grid>
          <Grid.Row className="profileCard_footer">
          <Grid.Column className="starRatingColumn">
          <StarRating rating={profile.star} editing={false} size={'small'} count={profile.starCount} showCount/>
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
