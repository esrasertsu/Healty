import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Segment, Image } from 'semantic-ui-react'
import { IBlog } from '../../app/models/blog';
import { RootStoreContext } from '../../app/stores/rootStore';

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
const BlogPageHeader:React.FC<{blog:IBlog}> = ({blog}) => {

  const rootStore = useContext(RootStoreContext);
  const { isCurrentUserAuthor } = rootStore.blogStore;

    return (

      //placeholder yerleştir olur da blog undefined null vs gelirse diye
                  <Segment basic attached='top' style={{ padding: '0' }}>
                    <Image src={blog.photo} fluid style={activityImageStyle}/>
                  </Segment>
                
    )
}

export default observer(BlogPageHeader)