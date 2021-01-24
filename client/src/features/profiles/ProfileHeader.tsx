import { observer } from 'mobx-react-lite';
import React from 'react';
import { Segment, Item, Header, Button, Grid, Statistic, Divider, Reveal } from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';
import { history } from '../../';

interface IProps{
    profile: IProfile,
    isCurrentUser:boolean,
    follow:(username: string) => void, 
    unfollow:(username: string) => void,
    loading:boolean
}

const ProfileHeader:React.FC<IProps> = ({profile, loading, follow, unfollow,isCurrentUser}) => {
  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image
                avatar
                size='small'
                src={profile.image || '/assets/user.png'}
              />
              <Item.Content verticalAlign='middle'>
                <Header as='h1'>{profile.displayName}</Header>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={4}>
          <Statistic.Group widths={2}>
            <Statistic label='Followers' value={profile.followerCount}/>
            <Statistic label='Following' value={profile.followingCount}/>
          </Statistic.Group>
          <Divider/>
          {isCurrentUser && 
            <Button
            fluid
            basic
            color={'green'}
            content={'Blog Post'}
            onClick={()=> history.push('/postForm')}
          />
          }
          <Divider/>
          {!isCurrentUser &&
          <Reveal animated='move'>
            <Reveal.Content visible style={{ width: '100%' }}>
              <Button
                fluid
                color='teal'
                content={profile.isFollowing ? 'Following' : 'Not Following'}
              />
            </Reveal.Content>
            <Reveal.Content hidden>
              <Button
                loading={loading}
                fluid
                basic
                color={profile.isFollowing ? 'red' : 'green'}
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
