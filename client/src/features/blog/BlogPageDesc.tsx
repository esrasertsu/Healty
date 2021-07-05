import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Segment, Header, Button, Image, Container, Icon, Label, Modal } from 'semantic-ui-react'
import { IBlog } from '../../app/models/blog';
import { RootStoreContext } from '../../app/stores/rootStore';
import { history } from '../../index'
import dompurify from 'dompurify';
import PostUpdateForm from '../posts/PostUpdateForm';
import { LoginForm } from '../user/LoginForm';
import { RegisterForm } from '../user/RegisterForm';


interface IProps{
  editMode:boolean;
  setEditMode: (mode:boolean) => void;
  setUpdatedBlog: (mode:boolean) => void;
  updatedBlog:boolean;
  blog:IBlog

}

const BlogPageDesc:React.FC<IProps> = ({editMode,blog,setEditMode,setUpdatedBlog,updatedBlog}) => {

  const rootStore = useContext(RootStoreContext);
  const { isCurrentUserAuthor, deletePost ,editPost} = rootStore.blogStore;
  const {isLoggedIn} = rootStore.userStore;
  const sanitizer = dompurify.sanitize;
  const [open, setOpen] = React.useState(false);

  const {openModal,closeModal,modal} = rootStore.modalStore;

  const handleLoginClick = (e:any,str:string) => {
    e.stopPropagation();
    if(modal.open) closeModal();

        openModal("Giriş Yap", <>
        <Image size='large' src='/assets/Login1.png' wrapped />
        <Modal.Description>
        <LoginForm location={str} />
        </Modal.Description>
        </>,true,
        <p>Üye olmak için <span className="registerLoginAnchor" onClick={() => openRegisterModal(e,str)}>tıklayınız</span></p>) 
    }

    const openRegisterModal = (e:any,str:string) => {
        e.stopPropagation();
        if(modal.open) closeModal();

        openModal("Üye Kaydı", <>
        <Image size='large' src='/assets/Login1.png' wrapped />
        <Modal.Description>
        <RegisterForm location={str} />
        </Modal.Description>
        </>,true,
        <p>Zaten üye misin? <span className="registerLoginAnchor" onClick={() => handleLoginClick(e,str)}>Giriş</span></p>) 
    }

 const handleShowProfileClick = (e:any) => {
  if(isLoggedIn){
      history.push(`/profile/${blog.username}`);
  }else{ 
    var str = `/profile/${blog.username}`;
     handleLoginClick(e,str)
  }
 
  }

  const handleDeleteBlog = (e:any) => {
    debugger;
    deletePost(e,blog.id);
  }

    return (
                <Segment className="blog_desctiption_segment">
                    {isCurrentUserAuthor  ? (
                      <div>
                      {
                        !editMode ? 
                        <Button color='orange' floated='right'
                        content={'Düzenle' }
                        labelPosition='right'
                       icon='edit'
                      onClick={() => 
                        { setEditMode(true);
                          setUpdatedBlog(false);
                        }}
                        >
                      </Button> :
                        <Button color='grey' floated='right'
                        content={'İptal' }
                        labelPosition='right'
                      icon='cancel'
                      onClick={() => 
                        { 
                          debugger;
                          setEditMode(false);
                          setUpdatedBlog(false);
                        }}
                        >
                      </Button>
                      }
                    
                      <Modal
                        basic
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        open={open}
                        size='small'
                        trigger={<Button color='red' floated='right' content='Sil'
                        labelPosition='right'
                        icon='trash'></Button>}
                      >
                        <Header icon>
                          <Icon name='archive' />
                          Blog Silme Onayı
                        </Header>
                        <Modal.Content>
                          <p>
                            Oluşturmuş olduğun bu bloğu silmek istediğine emin misin?
                          </p>
                        </Modal.Content>
                        <Modal.Actions>
                          <Button basic color='grey' onClick={() => setOpen(false)}>
                            <Icon name='backward' /> İptal
                          </Button>
                          <Button basic color='red' onClick={(e:any) => {handleDeleteBlog(e);setOpen(false)}}>
                            <Icon name='trash' /> Sil
                          </Button>
                        </Modal.Actions>
                      </Modal>
                    </div>)
                    : ""
                    }
               {
               editMode && !updatedBlog ? (
                <PostUpdateForm updatePost={editPost} blog={blog} />
                ) : 
               <Container>
                <p className="blog_description_date">{format(new Date(blog.date), 'eeee do MMMM')}</p>
                <Header as='h1'  className="blog_description_header">
                {blog.title}
                </Header>
                <div key={blog.id+"_pagedesc"} className="description" dangerouslySetInnerHTML={{__html:sanitizer(blog.description)}} />
                <br/>
                <Label className="blog_desc_category_label">{blog.categoryName}</Label>
                {
                  blog.subCategoryNames.map((subCatName)=>(
                    <Label key={subCatName} className="blog_desc_category_label">{subCatName}</Label>
                  ))
                }
              </Container>
              }
                <Container className="blog_userdetail">
                    <div className="blog_user">
                    <Image style={{cursor:"pointer"}} circular size="tiny" src={blog.userImage || '/assets/user.png'} onClick={handleLoginClick}></Image>
                     <div style={{marginLeft:"10px", cursor:"pointer"}}>
                       <div onClick={handleShowProfileClick} >
                      <strong>{blog.displayName}</strong></div> 
                    </div>
                    </div>
                    <div>
                      <div onClick={handleShowProfileClick} className="blogListItem_Readmore"> Uzman profilini gör <Icon name='arrow right' /> </div>
                    </div>

                </Container>
                </Segment>
    )
}

export default observer(BlogPageDesc)