import { observer } from 'mobx-react-lite';
import React from 'react';
import { Segment, Item, Header, Button, Grid, Statistic, Divider, Reveal, ButtonGroup, Label } from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';
import { history } from '../../';
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
    <Segment className="profieHeader_segment">
      <Grid stackable>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image
                avatar
                size='small'
                src={profile.image || '/assets/user.png'}
              />
              <Item.Content verticalAlign='middle' className="profileHeader_content">
                <Grid.Row>
                  <Header as='h1'>{profile.displayName}</Header>
                  <StarRating rating={profileRating} editing={false} key={"header"} count={profile.starCount} showCount={true}/>
                  <br/>
                  {(profile.categories.map((cat) => (
                    <Label key={cat.key} className="profileCard_Label" style={{background:getColor(cat.text)}} horizontal>{cat.text}</Label>
                  )))}
              
                </Grid.Row>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={4}>
        <Statistic.Group widths={2} size='small'>
          <Statistic>
            <Statistic.Value>{profile.followerCount}</Statistic.Value>
            <Statistic.Label>Takip Edenler</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{profile.followingCount}</Statistic.Value>
            <Statistic.Label>Takip Ettikleri</Statistic.Label>
          </Statistic>
          </Statistic.Group>
          <Divider/>
          {isCurrentUser && 
          <ButtonGroup widths={2}>
            <Button
              basic
              color={'green'}
              content={'Blog Yaz'}
              onClick={()=> history.push('/createPost')}
            />
            <Button
            basic
            color={'blue'}
            content={'Aktivite Oluştur'}
            onClick={()=> history.push('/createActivity')}
          />
          </ButtonGroup>
          }
          {!isCurrentUser &&
          <Reveal animated='move'>
            <Reveal.Content visible style={{ width: '100%' }}>
              <Button
                fluid
                className="followingButtonOut"
                content={profile.isFollowing ? 'Takip Ediliyor' : 'Takip Edilmiyor'}
              />
            </Reveal.Content>
            <Reveal.Content hidden>
              <Button
                loading={loading}
                fluid
                className={profile.isFollowing ? 'followingButtonOut_redClassName' : 'followingButtonOut_greenClassName'}
                content={profile.isFollowing ? 'Takipten Çık' : 'Takip Et'}
                onClick={profile.isFollowing ? () => unfollow(profile.userName): () => follow(profile.userName)}
              />
            </Reveal.Content>
          </Reveal> }
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default observer(ProfileHeader);
