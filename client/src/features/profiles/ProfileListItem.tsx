import React, { useContext, useEffect } from 'react';
import { Card, Image, Icon, Grid, Label} from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';
import { history } from '../../index'
import { RootStoreContext } from '../../app/stores/rootStore';
import { StarRating } from '../../app/common/form/StarRating';
import { Link } from 'react-router-dom';
import { colors } from '../../app/models/category';
import { observer } from 'mobx-react-lite';

interface IProps {
    profile: IProfile
}

 const ProfileListItem: React.FC<IProps> = ({profile}) => {

  const rootStore = useContext(RootStoreContext);
  const {setLoadingProfile, profileFilterForm} = rootStore.profileStore;
  const {allDetailedList} = rootStore.categoryStore;

  const getColor = (catName:string) =>{
    let index = colors.findIndex(x => x.key === catName);
    return colors[index].value;
  }
 
  return (
    <Card onClick={() => {
      setLoadingProfile(true);
      history.push(`/profile/${profile.userName}`)
      }}
      style={{height:"100%"}}
    key={profile.userName+Math.random()} >
      <Image circular src={profile.image || '/assets/user.png'} />
      <div className="profileListItem_badges">   
      {(profile.categories && profile.categories.map((cat) => (
          <Label key={profile.userName+Math.random()+cat.text} className="profileCard_Label" style={{background:getColor(cat.text)}} horizontal>{cat.text}</Label>
        )))}
      </div>
     
      <Card.Content className="profileCard_Content">
        <Card.Header>{profile.displayName}</Card.Header>
        <Card.Description key={profile.userName+Math.random()+"desc"}>
          <div key={profile.userName+Math.random()+"sub"} className="profileListItem_subCats">
          <Icon name="bookmark"></Icon>   
            {profile.subCategories && profile.subCategories.length> 0 ?
            profile.subCategories.map<React.ReactNode>(s => <span>{s.text}</span>).reduce((prev, cur) => [prev, ',', cur])
            : "Bilgi yok"
          }
            </div>
            <div className="profileListItem_subCats"> <Icon name="bolt" /> {profile.accessibilities && profile.accessibilities.length > 0 ? 
          profile.accessibilities.map<React.ReactNode>(s => <span id={profile.userName +"_accessibility"}>{s.text}</span>).reduce((prev, cur) => [prev, ',', cur])
            : "Bilgi yok"}  </div>
            <div className="profileListItem_subCats"> <Icon name="spinner" /> {profile.experienceYear > 0 ? profile.experienceYear +"yıl tecrübe" : "" } </div> 

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

 export default observer(ProfileListItem);
