import React from 'react';
import { Card, Image, Icon} from 'semantic-ui-react';
import { history } from '../../index'
import { IBlog } from '../../app/models/blog';
import { format } from 'date-fns';
import dompurify from 'dompurify';
import tr  from 'date-fns/locale/tr'

interface IProps {
    blog: IBlog
}

const BlogListItem: React.FC<IProps> = ({blog}) => {

  const sanitizer = dompurify.sanitize;

  return (
    <Card onClick={() => {
      history.push(`/blog/${blog.id}`)
      }}
    key={blog.id} >
      <Image src={blog.photo || '/assets/placeholder.png'} />
      <Card.Content className="profileCard_Content">
        <Card.Description>
          <div className="homepage_subheader">{format(new Date(blog.date), 'dd MMMM yyyy, eeee',{locale: tr})}</div>
        </Card.Description>
        <br></br>
        <Card.Header className="blogListItem_Header">{blog.title}</Card.Header>
        <Card.Description>
          <div key={blog.id+"_desc"} className="homepage_subheader" dangerouslySetInnerHTML={{__html:sanitizer(blog.summary)}} />
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <p className="blogListItem_Readmore">Devamını oku  <Icon name='arrow right' /> </p>
      </Card.Content>
    {/*  <Card.Content extra>
         <Grid>
          <Grid.Row className="profileCard_footer">
          <Grid.Column className="starRatingColumn">
          <StarRating rating={profile.star} editing={false} size={'small'} count={profile.starCount} showCount/>
          </Grid.Column> 
          <Grid.Column className="followerCountColumn">
          <Icon name='user' />
          {profile.followerCount}
          </Grid.Column>  
          </Grid.Row>
        </Grid> 
      </Card.Content>*/}
    </Card>
  );
};

export default BlogListItem;
