import React, { useContext, useEffect, useState } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../app/common/form/TextInput";
import TextAreaInput from "../../app/common/form/TextAreaInput";
import SelectInput from "../../app/common/form/SelectInput";
import { category } from "../../app/common/options/categoryOptions";
import {combineValidators, composeValidators, hasLengthGreaterThan, isRequired} from 'revalidate';
import { RootStoreContext } from "../../app/stores/rootStore";
import { PostFormValues } from "../../app/models/post";

const validate = combineValidators({
  title: isRequired({message: 'The event title is required'}),
  category: isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(4)({message: 'Description needs to be at least 100 characters'})
  )()
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
    loadPost,
    createPost,
    editPost,
    submitting
  } = rootStore.postStore;

  const [post, setPost] = useState(new PostFormValues());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadPost(match.params.id)
        .then((post) => setPost(new PostFormValues()))
        .finally(() => setLoading(false));
    }
  }, [loadPost, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const { ...post } = values;

    if (!post.id) {
          let newPost = {
            ...post,
            id: uuid(),
          };
          createPost(newPost);
        } else {
          editPost(post);
        }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            validate = {validate}
            initialValues={post}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name="title"
                  placeholder="Title"
                  value={post.title}
                  component={TextInput}
                />
                <Field
                  name="description"
                  placeholder="Description"
                  value={post.description}
                  component={TextAreaInput}
                  rows={3}
                />
                <Field
                  name="category"
                  placeholder="Category"
                  value={post.category}
                  component={SelectInput}
                  options={category}
                />
                <Button
                  loading={submitting}
                  disabled={loading || invalid || pristine}
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
                      ? () => history.push(`/post/${post.id}`)
                      : () => history.push("/post")
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
