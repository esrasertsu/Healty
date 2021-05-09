import { observer } from 'mobx-react-lite';
import React from 'react';
import { Segment, Item, Header, Button, Grid, Statistic, Divider, Reveal, ButtonGroup, Icon } from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';
import { history } from '../../';
import { StarRating } from '../../app/common/form/StarRating';

interface IProps{
    profile: IProfile,
    isCurrentUser:boolean,
    follow:(username: string) => void, 
    unfollow:(username: string) => void,
    loading:boolean
}

const ProfileHeader:React.FC<IProps> = ({profile, loading, follow, unfollow,isCurrentUser}) => {
  
  const profileRating = profile ? profile.star : 0;

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
                </Grid.Row>
                <br/>
                <Grid.Row>
                <StarRating rating={profileRating} editing={false} key={"header"} count={profile.starCount} showCount={true}/>
                </Grid.Row>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={4}>
        <Statistic.Group widths={2} size='small'>
          <Statistic>
            <Statistic.Value>{profile.followerCount}</Statistic.Value>
            <Statistic.Label>Followers</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{profile.followingCount}</Statistic.Value>
            <Statistic.Label>Following</Statistic.Label>
          </Statistic>
          </Statistic.Group>
          <Divider/>
          {isCurrentUser && 
          <ButtonGroup widths={2}>
            <Button
              basic
              color={'green'}
              content={'Write Blog'}
              onClick={()=> history.push('/createPost')}
            />
            <Button
            basic
            color={'blue'}
            content={'Create Activity'}
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
                content={profile.isFollowing ? 'Following' : 'Not Following'}
              />
            </Reveal.Content>
            <Reveal.Content hidden>
              <Button
                loading={loading}
                fluid
                basic
                className={profile.isFollowing ? 'followingButtonOut_redClassName' : 'followingButtonOut_greenClassName'}
                content={profile.isFollowing ? 'Unfollow' : 'Follow'}
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
