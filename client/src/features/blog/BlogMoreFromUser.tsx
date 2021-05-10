import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Segment, Header, Button, Image, Container, Icon, Card } from 'semantic-ui-react'
import { IBlog } from '../../app/models/blog';
import { RootStoreContext } from '../../app/stores/rootStore';
import { history } from '../../index'


const BlogMoreFromUser:React.FC<{userName:string}> = ({userName}) => {

  const rootStore = useContext(RootStoreContext);
  const { userBlogs } = rootStore.blogStore;
  
  
    return (
           <Segment className="blog_morefromuser">
            <Header as='h1'  className="blog_morefromuser_header">
                Bu danışmanın diğer paylaşımları
                </Header>
             <Card.Group itemsPerRow="5" stackable>
                {
                    userBlogs.map((blog) => (
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
                    ))
                }
                </Card.Group>
                <Container className="blog_morefromuser_readmore">
                <div>
                      <p className="blogListItem_Readmore">Devamını gör <Icon name='arrow right' /> </p>
                </div>
                </Container>
                
                </Segment>
    )
}

export default observer(BlogMoreFromUser)