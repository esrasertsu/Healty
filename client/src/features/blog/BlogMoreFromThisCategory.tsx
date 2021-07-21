import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Segment, Header, Image, Container, Icon, Card } from 'semantic-ui-react'
import { IBlog } from '../../app/models/blog';
import { RootStoreContext } from '../../app/stores/rootStore';
import { history } from '../../index'
import { useMediaQuery } from 'react-responsive'


const BlogMoreFromThisCategory:React.FC<{blog:IBlog}> = ({blog}) => {

  const rootStore = useContext(RootStoreContext);
  const { sameCategoryBlogs ,setClearedBeforeNewPredicateComing,clearPredicates,setPredicate} = rootStore.blogStore;
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })

  
    return (
           <Segment className="blog_morefromcat">
            <Header as='h1'  className="blog_morefromuser_header">
                Bu kategorideki diğer paylaşımlar
                </Header>
             <Card.Group itemsPerRow={isTabletOrMobile?"3":"5"} stackable>
                {
                    sameCategoryBlogs.map((blog,index) => (
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
                            <div><span>{format(new Date(blog.date), 'do LLL')} - {format(new Date(blog.date), 'h:mm a')}</span></div>
                          </Card.Meta>
                        </Card.Content>
                      </Card>
                    ))
                }
                </Card.Group>
                <Container className="blog_morefromuser_readmore">
                <div onClick={()=>
              {
                setClearedBeforeNewPredicateComing(true);
                clearPredicates(null);
                if(blog.subCategoryIds.length>0)
                     {
                     setPredicate('subCategoryIds', blog.subCategoryIds);
                     setClearedBeforeNewPredicateComing(false);
                     setPredicate('categoryId', blog.categoryId);
                    }
                else setPredicate('categoryId', blog.categoryId);

                history.push('/blog')}}>
                      <p className="blogListItem_Readmore">Devamını gör <Icon name='arrow right' /> </p>
                </div>
                </Container>
                
                </Segment>
    )
}

export default observer(BlogMoreFromThisCategory)