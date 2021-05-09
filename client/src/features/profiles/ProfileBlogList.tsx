import React, { Fragment, useContext } from 'react'
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button, Card, Grid,Image } from 'semantic-ui-react';
import { IProfileBlog } from '../../app/models/profile';


interface IProps 
{
  handleGetNext: () => void;
  totalBlogPages: number;
  loadingNext: boolean;
  blogPage:number;
  getBlogsByDate: any[]
}

const ProfileBlogList: React.FC<IProps> = ({handleGetNext,totalBlogPages,loadingNext,blogPage,getBlogsByDate}) => {

  const rootStore = useContext(RootStoreContext);
  // const { getBlogsByDate } = rootStore.profileStore;

  return (
    <Fragment>
<Grid>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={4}>
              {getBlogsByDate.map((blog: IProfileBlog) => (
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
            onClick={handleGetNext}
            disabled={totalBlogPages === blogPage + 1 || totalBlogPages === 0}
            style={totalBlogPages === 0 ? {display:"none"}: {display:"inline", marginTop: "20px"}}
            loading={loadingNext}/>
        </Grid.Column>
      </Grid>
      </Fragment>
    
  );
};

export default observer(ProfileBlogList)