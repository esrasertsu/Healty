import React, { useContext, useEffect, useState } from 'react';
import { IProfile } from '../../app/models/profile';
import { Category, ICategory } from '../../app/models/category';
import { Form as FinalForm, Field } from 'react-final-form';
import { observer } from 'mobx-react-lite';
import { combineValidators, isRequired } from 'revalidate';
import { Form, Button, Container, Segment } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import NumberInput from '../../app/common/form/NumberInput';
import DropdownMultiple from '../../app/common/form/DropdownMultiple';
import { RootStoreContext } from '../../app/stores/rootStore'
import DropdownInput from '../../app/common/form/DropdownInput';
import { OnChange } from 'react-final-form-listeners';
import { IBlog, IBlogUpdateFormValues } from '../../app/models/blog';
import WYSIWYGEditor from '../../app/common/form/WYSIWYGEditor';

const validate = combineValidators({
  displayName: isRequired('displayName')
});

interface IProps {
    updatePost: (post: Partial<IBlogUpdateFormValues>) => void;
    blog: IBlog;
}


const PostUpdateForm: React.FC<IProps> = ({ updatePost, blog }) => {
   
    const rootStore = useContext(RootStoreContext);
    const { blogForm, setBlogForm} = rootStore.blogStore;
    const {allCategoriesOptionList} = rootStore.categoryStore;
    const categoryOptions: ICategory[] = [];
    const subCategoryOptionFilteredList: ICategory[] = [];

    const [updateEnabled, setUpdateEnabled] = useState<boolean>(false);


     const [category, setCategory] = useState<string>("");
     const [subCategoryOptions, setSubCategoryOptions] = useState<ICategory[]>([]);

     

       const handleCategoryChanged = (e: any, data: string) => {
        setBlogForm({...blogForm,categoryId:data});
        setCategory(data);  
      
           setUpdateEnabled(true);
     }

     const handleSubCategoryChanged = (e: any, data: string[]) => {  
      setBlogForm({...blogForm,subCategoryIds: [...data]});
            setUpdateEnabled(true);
       }
   

    allCategoriesOptionList.filter(x=>x.parentId===null).map(option => (
          categoryOptions.push(new Category({key: option.key, value: option.value, text: option.text}))
     ));

     const loadSubCatOptions = () =>{
      allCategoriesOptionList.filter(x=> blogForm!.categoryId == x.parentId).map(option => (
          subCategoryOptionFilteredList.push(new Category({key: option.key, value: option.value, text: option.text}))
      ))
      setSubCategoryOptions(subCategoryOptionFilteredList);
      debugger;
      const renewedSubIds = blogForm!.subCategoryIds!.filter(x=> subCategoryOptionFilteredList.findIndex(y => y.key === x) > -1);
      setBlogForm({...blogForm,subCategoryIds: [...renewedSubIds]});

   }
        useEffect(() => {
            loadSubCatOptions();
        }, [category])

   

  return (
    <Segment style={{marginTop:"50px", paddingBottom:"50px"}}>
    <FinalForm
      onSubmit={updatePost}
      validate={validate}
      initialValues={blogForm!}
      render={({ handleSubmit, submitting }) => (
        <Form onSubmit={handleSubmit} error>
          <label>Blog Başlığı</label>
          <Field
            name='title'
            component={TextInput}
            placeholder='Başlık'
            value={blogForm!.title}
          />
           <OnChange name="title">
                {(value, previous) => {
                    if(value !== blog.title)
                    {
                        setUpdateEnabled(true);
                        setBlogForm({...blogForm,title: value});
                    }
                }}
            </OnChange>
            <label>Açıklama*</label>
                  <Field
                  name="description"
                  component={WYSIWYGEditor}
                  value={blogForm!.description}
                />
                  <OnChange name="description">
                {(value, previous) => {
                      setUpdateEnabled(true);
                      setBlogForm({...blogForm,description: value});
                }}
                 </OnChange>
                 <label>Kategori*</label>
                 <Field
                  name="categoryId"
                  placeholder="Kategori"
                  value={blogForm!.categoryId}
                  component={DropdownInput}
                  options = {categoryOptions}
                  onChange={(e: any,data:any)=>
                    {
                      debugger;
                      handleCategoryChanged(e,data)}}
                /> 
                 <label>Branşlar*</label>        
                 <Field
                  name="subCategoryIds"
                  placeholder="Alt Kategori"
                  value={blogForm!.subCategoryIds}
                  component={DropdownMultiple}
                  options={subCategoryOptions}
                  onChange={(e: any,data:[])=>
                    {
                      debugger;
                      handleSubCategoryChanged(e,data)}}
                />  
          <Button 
            loading={submitting}
            floated='right'
            disabled={!updateEnabled}
            positive
            content='Update profile'
          />
        </Form>
      )}
    />
    </Segment>
    
  );
};

export default observer(PostUpdateForm);