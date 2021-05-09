import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Segment, Header, Button, Image, Container, Icon } from 'semantic-ui-react'
import { IBlog } from '../../app/models/blog';
import { RootStoreContext } from '../../app/stores/rootStore';
import { history } from '../../index'

const activityImageStyle = {
    width:"100%"
};

const activityImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
};
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
                <p className="description"> { blog.description} </p>
                <br/>
                <Container className="blog_userdetail">
                    <div className="blog_user">
                    <Image circular size="tiny" src={blog.userImage} onClick={()=>history.push(`/profile/${blog.username}`)}></Image>
                    <div style={{marginLeft:"10px"}}><Link to={`/profile/${blog.username}`} ><strong>{blog.displayName}</strong></Link> </div>
                    </div>
                    <div>
                      <p className="blogListItem_Readmore">Diğer yazılarını gör <Icon name='arrow right' /> </p>
                    </div>

                </Container>
                </Segment>
        </div>
    )
}

export default observer(BlogPageDesc)