import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Segment, Header, Button, Image, Container, Icon, Label } from 'semantic-ui-react'
import { IBlog } from '../../app/models/blog';
import { RootStoreContext } from '../../app/stores/rootStore';
import { history } from '../../index'


const BlogPageDesc:React.FC<{blog:IBlog}> = ({blog}) => {

  const rootStore = useContext(RootStoreContext);
  const { isCurrentUserAuthor } = rootStore.blogStore;

    return (
        <div>
                <Segment className="blog_desctiption_segment">
                    {isCurrentUserAuthor  ? (
                      <Button as={Link} to={`/manage/${blog.id}`} color='orange' floated='right'>
                         Düzenle
                      </Button>
                    ): ""
                    // activity.isGoing ? (
                    //   <Button loading={loading} onClick={cancelAttendance}>Cancel attendance</Button>
                    // ): (
                    //   <Button loading={loading} onClick={attendActivity} color='teal'>Join Activity</Button>
                    // )
                    }
                <p className="blog_description_date">{format(new Date(blog.date), 'eeee do MMMM')}</p>
                <Header as='h1'  className="blog_description_header">
                {blog.title}
                </Header>
                <div key={blog.id+"_pagedesc"} className="description" dangerouslySetInnerHTML={{__html:blog.description}} />
                <br/>
                <Label className="blog_desc_category_label">{blog.categoryName}</Label>
                {
                  blog.subCategoryNames.map((subCatName)=>(
                    <Label key={subCatName} className="blog_desc_category_label">{subCatName}</Label>
                  ))
                }
                <Container className="blog_userdetail">
                    <div className="blog_user">
                    <Image circular size="tiny" src={blog.userImage} onClick={()=>history.push(`/profile/${blog.username}`)}></Image>
                     <div style={{marginLeft:"10px"}}>
                       <Link to={`/profile/${blog.username}`} >
                      <strong>{blog.displayName}</strong></Link> 
                    </div>
                    </div>
                    <div>
                      <div onClick={()=>history.push(`/profile/${blog.username}`)} className="blogListItem_Readmore"> Uzman profilini gör <Icon name='arrow right' /> </div>
                    </div>

                </Container>
                </Segment>
        </div>
    )
}

export default observer(BlogPageDesc)