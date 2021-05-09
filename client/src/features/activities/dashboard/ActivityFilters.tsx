import React, { Fragment, useContext, useState } from 'react';
import { Menu, Header, Segment, Accordion, Form } from 'semantic-ui-react';
import { Calendar, DateTimePicker} from 'react-widgets';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';


const ColorForm = (
  <Form>
    <Form.Group grouped>
      <Form.Checkbox label='Red' name='color' value='red' />
      <Form.Checkbox label='Orange' name='color' value='orange' />
      <Form.Checkbox label='Green' name='color' value='green' />
      <Form.Checkbox label='Blue' name='color' value='blue' />
    </Form.Group>
  </Form>
)

const SizeForm = (
  <Form>
    <Form.Group grouped>
      <Form.Radio label='Small' name='size' type='radio' value='small' />
      <Form.Radio label='Medium' name='size' type='radio' value='medium' />
      <Form.Radio label='Large' name='size' type='radio' value='large' />
      <Form.Radio label='X-Large' name='size' type='radio' value='x-large' />
    </Form.Group>
  </Form>
)


const ActivityFilters = () => {

  const rootStore = useContext(RootStoreContext);
  const { predicate, setPredicate } = rootStore.activityStore; 

  const [activeIndex, setActiveIndex] = useState(-1)

  const handleClick = (e:any, titleProps:any) => {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index

    setActiveIndex(newIndex);
  }

  return (
    <Fragment>
      {/* <Header icon={'calendar'} attached color={'teal'} content={'Select Date'} /> */}
      {/* <Calendar
      onChange={(date)=> {setPredicate('startDate', date!)}}
      value={predicate.get('startDate') || new Date()} /> */}
     <Segment className="dtPicker_Container_Style">
      <p>Aktivite aradığınız tarih/saat aralığını giriniz.</p>
     <DateTimePicker
        value={predicate.get('startDate') || new Date()}
        onChange={(date)=> {setPredicate('startDate', date!)}}
        onKeyDown={(e) => e.preventDefault()}
        date = {true}
        time = {true}
        containerClassName="dtPicker_Style"
      />
      <br/>
      <DateTimePicker
        value={predicate.get('startDate') || null}
        onChange={(date)=> {setPredicate('startDate', date!)}}
        onKeyDown={(e) => e.preventDefault()}
        date = {true}
        time = {true}
        containerClassName="dtPicker_Style"
      />
     </Segment>
     <Menu vertical style={{ width: '100%'}}>
        {/* <Header icon={'filter'} attached color={'teal'} content={'Filters'} />  size={'small'}*/}
        <Menu.Item
         active={predicate.size === 0}
         onClick= {() => {setPredicate('all', 'true')}}
          name={'all'} content={'Hepsi'} />
        <Menu.Item
        active = { predicate.has('isGoing')}
        onClick= {() => { setPredicate('isGoing', 'true')}}
         name={'username'} content={"Gidiyorum"} />
        <Menu.Item
        active = { predicate.has('isHost')}
        onClick= {() => { setPredicate('isHost', 'true')}}
         name={'host'} content={"Düzenlediklerim"} />
         <Menu.Item
        active = { predicate.has('isFollowed')}
        onClick= {() => { setPredicate('isFollowed', 'true')}}
         name={'follow'} content={"Takip Ettiğim Eğitmenlerin"} />
      </Menu>

      <Accordion as={Menu} vertical style={{ width: '100%', boxShadow:'none', border:'none'}}>
        <Menu.Item className="filterMenuItem_Style">
          <Accordion.Title
            active={activeIndex === 0}
            content='Kategori'
            index={0}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 0} content={SizeForm} />
        </Menu.Item>

        <Menu.Item className="filterMenuItem_Style">
          <Accordion.Title
            active={activeIndex === 1}
            content='Seviye'
            index={1}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 1} content={ColorForm} />
        </Menu.Item>

        <Menu.Item className="filterMenuItem_Style">
          <Accordion.Title
            active={activeIndex === 2}
            content='Online'
            index={1}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 2} content={ColorForm} />
        </Menu.Item>
      </Accordion>
       
    </Fragment>
  );
}

export default observer(ActivityFilters);


// JSX ORNEK
// const ActivityFilters = () => (
//   <Fragment>
//     <Menu vertical size={'large'} style={{ width: '100%', marginTop: 30 }}>
//       <Header icon={'filter'} attached color={'teal'} content={'Filters'} />
//       <Menu.Item color={'blue'} name={'all'} content={'All Activities'} />
//       <Menu.Item color={'blue'} name={'username'} content={"I'm Going"} />
//       <Menu.Item color={'blue'} name={'host'} content={"I'm hosting"} />
//     </Menu>
//     <Header icon={'calendar'} attached color={'teal'} content={'Select Date'} />
//     <Calendar />
//   </Fragment>
// );

// export default ActivityFilters;