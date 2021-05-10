import React, { Fragment, useContext, useEffect, useState } from "react";
import { Segment, Form, Button, Grid, Header, Image } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../app/common/form/TextInput";
import WYSIWYGEditor from "../../app/common/form/WYSIWYGEditor";
import SelectInput from "../../app/common/form/SelectInput";
import { category } from "../../app/common/options/categoryOptions";
import {combineValidators, composeValidators, hasLengthGreaterThan, isRequired} from 'revalidate';
import { RootStoreContext } from "../../app/stores/rootStore";
import { PostFormValues } from "../../app/models/blog";
import PhotoWidgetDropzone from "../../app/common/photoUpload/PhotoWidgetDropzone";
import PhotoWidgetCropper from "../../app/common/photoUpload/PhotoWidgetCropper";
import DropdownInput from "../../app/common/form/DropdownInput";
import DropdownMultiple from "../../app/common/form/DropdownMultiple";
import { ISubCategory } from "../../app/models/category";

// const validate = combineValidators({
//   title: isRequired({message: 'The event title is required'}),
//   category: isRequired('Category'),
//   description: composeValidators(
//     isRequired('description'),
//     hasLengthGreaterThan(150)({message: 'Blog needs to be at least 150 characters'})
//   )()
// })

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
    loadingCategories,
    loadingSubCategories,
    loadCategories,
    loadSubCategories
 } = rootStore.categoryStore;

  const [post, setPost] = useState(new PostFormValues());
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<Blob>();

  const [files, setFiles] = useState<any[]>([]);
    const [image, setImage] = useState<Blob | null>(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");

    const [category, setCategory] = useState<string>("");
    const [subCategory, setSubCategory] =useState<string[]>([]);
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
    debugger;
    setCategory(data);
    loadSubCategories(data);
 }

   const handleSubCategoryChanged = (e: any, data: string[]) => {  
     setSubCategory(data)  
       //setPost({...post,subCategories: data});
    }

  const handleFinalFormSubmit = (values: any) => {
    debugger;
    const { ...post } = values;

    if (!post.id) {
          let newPost = {
            ...post,
            id: uuid(),
            file:image,
            categoryId:category,
            subCategoryIds:subCategory
          };
          createPost(newPost);
        } else {
          editPost(post);
        }
  };

  const handleUploadImage = (photo: Blob) => {
debugger;
      setPhoto(photo);
  }

  return (
    <Grid>
      <Grid.Column width={16}>
        <Segment clearing>
          <FinalForm
            //validate = {validate}
            initialValues={post}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Header color='teal' sub content='Adım 1 - Metin başlığınızı girin ' />
                <Field
                  name="title"
                  placeholder="Title"
                  value={post.title}
                  component={TextInput}
                />
                <Header color='teal' sub content='Adım 2 - Metnin temel görselini yükleyin' />
              {
                files.length === 0 ? 
                <PhotoWidgetDropzone setFiles={setFiles} />
                :
               (
                <Grid>
                  <Grid.Column width="eight">
                  <Header sub content='*Boyutlandır' />
                  <PhotoWidgetCropper setImage={setImage} imagePreview={files[0].preview} setCroppedImageUrl={setCroppedImageUrl} />
                  <Button type="danger" icon='close' disabled={loading} onClick={()=> setFiles([])}>Değiştir/Sil</Button>
                  </Grid.Column>
                  <Grid.Column width="eight">
                    <Header sub content='*Önizleme' />
                    <Image src={croppedImageUrl} style={{minHeight:'200px', overflow:'hidden'}}/>
                    <Button positive icon='check' loading={loading} onClick={()=> handleUploadImage(image!)}></Button>

                  </Grid.Column>
               </Grid>
               )
              }  
                <Header color='teal' sub content='Adım 3 - Bloğunuzu oluşturun' />
               <Field
                  name="description"
                  component={WYSIWYGEditor}
                  value={post.description}
                />
                <Header color='teal' sub content='Adım 4 - Kategori seçin' />
                <Field 
                  name="categoryId"
                  placeholder="Kategori"
                  component={DropdownInput}
                  options={categoryList}
                  value={post.categoryId}
                  onChange={(e: any,data: any)=>handleCategoryChanged(e,data)}
                />
                  <Header color='teal' sub content='Adım 5 - Alt Kategorileri seçin' />
                 <Field
                  name="subCategoryIds"
                  placeholder="Alt Kategori"
                  value={post.subCategoryIds}
                  component={DropdownMultiple}
                  options={subcategoryList}
                  onChange={(e: any,data:[])=>
                    {
                      debugger;
                      handleSubCategoryChanged(e,data)}}
                > 
              </Field>
                <Button
                  loading={submitting}
                //  disabled={loading || invalid || pristine}
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                />
                <Button
                  floated="left"
                  disabled={loading}
                  type="cancel"
                  content="Cancel"
                  onClick={
                    post.id
                      ? () => history.push(`/blog/${post.id}`)
                      : () => history.push("/blog")
                  }
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(PostForm);
