import React, {  useContext, useEffect, useState } from "react";
import { Segment, Form, Button, Grid, Header, Image, Container } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../app/common/form/TextInput";
import WYSIWYGEditor from "../../app/common/form/WYSIWYGEditor";
import { RootStoreContext } from "../../app/stores/rootStore";
import { PostFormValues } from "../../app/models/blog";
import PhotoWidgetDropzone from "../../app/common/photoUpload/PhotoWidgetDropzone";
import PhotoWidgetCropper from "../../app/common/photoUpload/PhotoWidgetCropper";
import DropdownInput from "../../app/common/form/DropdownInput";
import DropdownMultiple from "../../app/common/form/DropdownMultiple";
import { OnChange } from "react-final-form-listeners";
import { combineValidators, composeValidators, hasLengthGreaterThan, isRequired } from "revalidate";

const validate = combineValidators({
  title: isRequired({message: 'Blog başlığı zorunlu alandır.'}),
  categoryId: isRequired({message: 'Kategori zorunlu alandır.'}),
  subCategoryIds:isRequired({message: 'Alt kategori zorunlu alandır.'}),
  description: composeValidators(
    hasLengthGreaterThan(150)({message: 'Blog en az 150 karakter uzunluğunda olmalıdır.'})
  )(),
})

interface DetailParams {
  id: string;
}

const PostForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadBlog,
    createPost,
    editPost,
    submitting
  } = rootStore.blogStore;

  const {
    categoryList,
    subcategoryList,
    loadCategories,
    loadSubCategories
 } = rootStore.categoryStore;

  const [post, setPost] = useState(new PostFormValues());
  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState<any[]>([]);
    const [image, setImage] = useState<Blob | null>(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");

    const [imageDeleted, setImageDeleted] = useState<boolean>(false);
    const [imageChanged, setImageChanged] = useState<boolean>(false);
    const [originalImage, setOriginalImage] = useState<Blob | null>(null);

    useEffect(() => {
      loadCategories();
  }, [loadCategories])

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadBlog(match.params.id)
        .then((post) => setPost(new PostFormValues()))
        .finally(() => setLoading(false));
    }
  }, [loadBlog, match.params.id]);

  const handleCategoryChanged = (e: any, data: string) => {
    setPost({...post,categoryId: data});
   // setCategory(data);
    loadSubCategories(data);
 }

   const handleSubCategoryChanged = (e: any, data: string[]) => {  
    // setSubCategory(data)  
       setPost({...post,subCategoryIds: [...data]});
    }

  const handleFinalFormSubmit = (values: any) => {
    const { ...post } = values;
    let done = true;

    if(image == null || imageDeleted)
     {
        setImageDeleted(true);
        done= false;
    }
     if(post.decription && post.decription.length < 50){
        document.getElementById("descLabel") && document.getElementById("descLabel")!.classList.add("errorLabel")
        done= false;
    }
    if(done){
    if (!post.id) {
          let newPost = {
            ...post,
            id: uuid(),
            file:image,
          };
          createPost(newPost);
        } else {
          editPost(post);
        }
      }
  };

  return (
    <Container className="pageContainer">

    <Grid>
      <Grid.Column width={16}>
        <Segment clearing>
          <FinalForm
            validate = {validate}
            initialValues={post}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Header id="titleHeader" className="postFormHeader" sub content='Adım 1 - Metin başlığınızı girin ' />
                <Field
                 labelName="titleHeader"
                  name="title"
                  placeholder="Başlık"
                  value={post.title}
                  component={TextInput}
                />
                 <OnChange name="title">
                {(value, previous) => {
                      setPost({...post,title: value});                    
                }}
            </OnChange>
                <Header className={image === null || imageDeleted ? "errorLabel postFormHeader" : " postFormHeader"}  sub content='Adım 2 - Metnin temel görselini yükleyin' />
              {
                files.length === 0 ? 
                <PhotoWidgetDropzone setFiles={setFiles}/>
                :
               (
                <Grid>
                  <Grid.Column width="eight">
                  <Header sub content='*Boyutlandır' />
                  <PhotoWidgetCropper  setOriginalImage={setOriginalImage} setImageDeleted={setImageDeleted} setImageChanged={setImageChanged} setImage={setImage} imagePreview={files[0].preview} setCroppedImageUrl={setCroppedImageUrl}  maxHeight={650} aspect={1500/650}/>
                  </Grid.Column>
                  <Grid.Column width="eight">
                    <Header sub content='*Önizleme' />
                    <Image src={croppedImageUrl} style={{minHeight:'200px', overflow:'hidden'}}/>
                  </Grid.Column>

                  <Grid.Column width="eight">
                  <Button circular type="danger" icon='close' disabled={loading} onClick={()=> {setFiles([]);setImageDeleted(true); setImage(null)}}>Değiştir/Sil</Button>
                  </Grid.Column>
               </Grid>
               )
              }  
                <Header id="descLabel" className="postFormHeader" sub content='Adım 3 - Bloğunuzu oluşturun' />
               <Field
                  labelName="descLabel"
                  name="description"
                  component={WYSIWYGEditor}
                  value={post.description}
                />
                 <OnChange name="description">
                {(value, previous) => {
                      setPost({...post,description: value});                    
                }}
            </OnChange>
                <Header id="categoryLabel" className="postFormHeader" sub content='Adım 4 - Kategori seçin' />
                <Field 
                  labelName="categoryLabel"
                  name="categoryId"
                  placeholder="Kategori"
                  component={DropdownInput}
                  options={categoryList}
                  value={post.categoryId}
                  emptyError={post.categoryId}
                  onChange={(e: any,data: any)=>handleCategoryChanged(e,data)}
                />
                  <Header id="subcategoryLabel" className="postFormHeader" sub content='Adım 5 - Alt Kategorileri seçin' />
                 <Field
                 labelName="subcategoryLabel"
                  name="subCategoryIds"
                  placeholder="Alt Kategori"
                  value={post.subCategoryIds}
                  component={DropdownMultiple}
                  options={subcategoryList}
                  emptyError={post.subCategoryIds}
                  onChange={(e: any,data:[])=>
                    {
                      handleSubCategoryChanged(e,data)}}
                > 
              </Field>
                <Button
                  loading={submitting}
                //  disabled={loading || invalid || pristine}
                  floated="right"
                  positive
                  circular
                  type="submit"
                  content="Submit"
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  </Container>
  );
};

export default observer(PostForm);
