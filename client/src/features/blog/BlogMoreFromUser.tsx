import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Segment, Header, Image, Container, Icon, Card } from 'semantic-ui-react'
import { IBlog } from '../../app/models/blog';
import { RootStoreContext } from '../../app/stores/rootStore';
import { history } from '../../index'
import { useMediaQuery } from 'react-responsive'
import tr  from 'date-fns/locale/tr'


const BlogMoreFromUser:React.FC<{blog:IBlog}> = ({blog}) => {

  const rootStore = useContext(RootStoreContext);
  const { userBlogs,setPredicateDisplayName ,setClearedBeforeNewPredicateComing,clearPredicates,setPredicate} = rootStore.blogStore;
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 820px)' })

  
    return (
           <Segment className="blog_morefromuser">
            <Header as='h1'  className="blog_morefromuser_header">
                Bu danışmanın diğer paylaşımları
                </Header>
             <Card.Group itemsPerRow={isTabletOrMobile?"3":"5"} stackable>
                {
                    userBlogs.map((blog,index) => (
                       index< (isTabletOrMobile? 3 : 5) &&
                        <Card
                        as={Link}
                        to={`/blog/${blog.id}`}
                        key={blog.id}
                      >
                        <Image
                          src={blog.photo}
                          style={{ height: 100, objectFit: 'cover',width:"100%" }}
                        />
                        <Card.Content>
                          <Card.Header className="profileBlogCard_header" textAlign="left">{blog.title}</Card.Header>
                          <Card.Meta textAlign="left">
                            <div><span>{format(new Date(blog.date), 'dd LLL yyyy',{locale: tr})}</span></div>
                          </Card.Meta>
                        </Card.Content>
                      </Card>
                    ))
                }
                </Card.Group>
                <Container className="blog_morefromuser_readmore">
                <div onClick={()=>
              {
                setPredicateDisplayName(blog.displayName);

                setClearedBeforeNewPredicateComing(true);
                clearPredicates(null);
                setClearedBeforeNewPredicateComing(false);
                setPredicate('username', blog.username);
                history.push('/blog')}}>
                      <p className="blogListItem_Readmore">Devamını gör <Icon name='arrow right' /> </p>
                </div>
                </Container>
                
                </Segment>
    )
}

export default observer(BlogMoreFromUser)