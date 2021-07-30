import { observer } from 'mobx-react-lite';
import React from 'react';
import { Segment, Item, Header, Button, Grid, Statistic, Divider, Reveal, ButtonGroup, Label, Icon } from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';
import { StarRating } from '../../app/common/form/StarRating';
import { colors } from '../../app/models/category';

interface IProps{
    profile: IProfile,
    isCurrentUser:boolean,
    follow:(username: string) => void, 
    unfollow:(username: string) => void,
    loading:boolean
}

const ProfileHeader:React.FC<IProps> = ({profile, loading, follow, unfollow,isCurrentUser}) => {
  
  const profileRating = profile ? profile.star : 0;

  const getColor = (catName:string) =>{
    let index = colors.findIndex(x => x.key === catName);
    return colors[index].value;
  }


  return (
    <>
    <div className="coverImage"></div>
    <Segment className="profieHeader_segment" style={{marginTop:0}}>
      <Grid stackable>
        <Grid.Column width={12}>
          <Item.Group>
            <Item style={{marginTop:"-108px"}}>
              <Item.Image
                avatar
                size='small'
                src={profile.image || '/assets/user.png'}
              />
              <Item.Content verticalAlign='middle' className="profileHeader_content">
                <Grid.Row>
                  <Header as='h1' style={{color:"#fff", marginBottom:"5px"}}>{profile.displayName}</Header>
                  {profile!.role === "Trainer" && 
                  <div style={{marginBottom:"10px"}}>
                    <StarRating rating={profileRating} editing={false} key={"header"} count={profile.starCount} showCount={true}/>
                  </div>
                    }
                  <br/>
                  {profile!.role === "Trainer" && profile.categories.map((cat) => (
                    <Label key={cat.key} className="profileCard_Label" style={{background:getColor(cat.text)}} horizontal>{cat.text}</Label>
                  ))}
              
                </Grid.Row>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={4}>
        <Statistic.Group widths={3} size='tiny'>
          <Statistic>
            <Statistic.Value>{profile.followerCount}</Statistic.Value>
            <Statistic.Label className="statisticLabels">Aktivite <Icon size="large" name="calendar check outline"></Icon></Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{profile.followingCount}</Statistic.Value>
            <Statistic.Label className="statisticLabels">Blog <Icon size="large" name="newspaper outline"></Icon></Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{profile.followingCount}</Statistic.Value>
            <Statistic.Label className="statisticLabels">Beğeni <Icon size="large" name="thumbs up outline"></Icon></Statistic.Label>
          </Statistic>
          </Statistic.Group>
          <Divider/>
         
        </Grid.Column>
      </Grid>
    </Segment>
    </>
  );
};

export default observer(ProfileHeader);
