﻿import React, { useContext, useEffect, useState } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import {
  ActivityFormValues
} from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SelectInput from "../../../app/common/form/SelectInput";
import { category } from "../../../app/common/options/categoryOptions";
import DateInput from "../../../app/common/form/DateInput";
import { combineDateAndTime } from "../../../app/common/util/util";
import {combineValidators, composeValidators, hasLengthGreaterThan, isRequired} from 'revalidate';
import { RootStoreContext } from "../../../app/stores/rootStore";
import ActivityFormMap from "./ActivityFormMap";

const validate = combineValidators({
  title: isRequired({message: 'The event title is required'}),
  category: isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(4)({message: 'Description needs to be at least 5 characters'})
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time')
})
interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    createActivity,
    editActivity,
    submitting,
    loadActivity
  } = rootStore.activityStore;

  const {
    cities
  } = rootStore.commonStore;

  const [activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id)
        .then((activity) => setActivity(new ActivityFormValues(activity)))
        .finally(() => setLoading(false));
    }
  }, [loadActivity, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;

    if (!activity.id) {
          let newActivity = {
            ...activity,
            id: uuid(),
          };
          createActivity(newActivity);
        } else {
          editActivity(activity);
        }
  };

  return (
    <Grid>
      <Grid.Column width={7}>
        <Segment clearing>
          <FinalForm
            validate = {validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name="title"
                  placeholder="Title"
                  value={activity.title}
                  component={TextInput}
                />
                <Field
                  name="description"
                  placeholder="Description"
                  value={activity.description}
                  component={TextAreaInput}
                  rows={6}
                />
                <Field
                  name="categoryId"
                  placeholder="Category"
                  value={activity.categoryIds[0]}
                  component={SelectInput}
                  options={category}
                />
                 {/* <Field
                  name="abc"
                  placeholder="Level"
                  value={activity.le}
                  component={SelectInput}
                  options={category}
                /> */}
                  {/* <Field
                  name="online"
                  placeholder="Online"
                  value={activity.online}
                  component={SelectInput}
                  options={category}
                /> */}
                <Form.Group widths="equal">
                  <Field
                    name="date"
                    date={true}
                    placeholder="Date"
                    value={activity.date}
                    component={DateInput}
                    messages={{
                      dateButton: "",
                      timeButton: "",
                    }}
                  />
                  <Field
                    name="time"
                    time={true}
                    placeholder="Time"
                    value={activity.time}
                    component={DateInput}
                    messages={{
                      dateButton: "",
                      timeButton: "",
                    }}
                  />
                </Form.Group>

                 <Field
                  name="city"
                  placeholder="City"
                  value={activity.cityId}
                  component={SelectInput}
                  options={cities}
                /> 
                <Field
                  name="venue"
                  placeholder="Avenue"
                  value={activity.venue}
                  component={TextInput}
                />
                 <Field
                  name="Adres"
                  placeholder="Adres"
                  value={activity.address}
                  component={TextAreaInput}
                  rows={2}
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
                    activity.id
                      ? () => history.push(`/activities/${activity.id}`)
                      : () => history.push("/activities")
                  }
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
      <Grid.Column width={9}>
        <Segment>
          <ActivityFormMap />
          {/* <ActivitySearchPage /> */}
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
