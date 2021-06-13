import React, { Fragment, useContext } from 'react'
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button, Card, Grid,Image } from 'semantic-ui-react';
import { IProfileBlog } from '../../app/models/profile';
import { history } from '../..';


interface IProps 
{
  profileBlogs: IProfileBlog[];
  profileUserName:string;
  displayName:string;
}

const ProfileBlogList: React.FC<IProps> = ({profileBlogs,profileUserName,displayName}) => {

  const rootStore = useContext(RootStoreContext);
   const { setPredicate,clearPredicates ,setPredicateDisplayName,setClearedBeforeNewPredicateComing} = rootStore.blogStore;

  return (
    <Fragment>
<Grid>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={4}>
              {profileBlogs.map((blog: IProfileBlog) => (
                      <Card
                      as={Link}
                      to={`/blog/${blog.id}`}
                      key={blog.id}
                    >
                      <Image
                        src={blog.photo}
                        style={{ height: 100, objectFit: 'cover' }}
                      />
                      <Card.Content>
                        <Card.Header className="profileBlogCard_header" textAlign="left">{blog.title}</Card.Header>
                        <Card.Meta textAlign="left">
                          <div><span>{format(new Date(blog.date), 'do LLL')} - {format(new Date(blog.date), 'h:mm a')}</span></div>
                        </Card.Meta>
                      </Card.Content>
                    </Card>
              ))}
          </Card.Group>
          <Button
            content="Tümünü Gör" 
            positive
            onClick={()=>
              {
                setPredicateDisplayName(displayName);

                setClearedBeforeNewPredicateComing(true);
                clearPredicates(null);
                setClearedBeforeNewPredicateComing(false);
                setPredicate('username', profileUserName);
                history.push('/blog')}}
            style={profileBlogs.length === 0 ? {display:"none"}: {display:"inline", marginTop: "20px"}}
          />
        </Grid.Column>
      </Grid>
      </Fragment>
    
  );
};

       

export default observer(ProfileBlogList)