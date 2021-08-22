import React, { useEffect, useState } from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Form, FormFieldProps } from 'semantic-ui-react'
import { EditorState, convertToRaw,ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import cx from 'classnames';

interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {}

const WYSIWYGEditor:React.FC<IProps> = ({ input,  meta:{ touched, error} }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty())

    useEffect(() => {
        if (toHtml(editorState) === input.value) return //added
    
        setEditorState(
          EditorState.push(
            editorState,
            ContentState.createFromBlockArray(
              htmlToDraft(input.value || '').contentBlocks,
            ),
            "adjust-depth"
          ),
        )
      }, [input.value])


    //   function onEditorStateChange(es) {
    //     setEditorState(es)
    //     const html = toHtml(es) //added
    //     if (value !== html) {
    //       onChange({ target: { name: 'text', value: html } })
    //     }
    //   }
    
      function toHtml(es: EditorState) {
        return draftToHtml(convertToRaw(es.getCurrentContent())) // added
      }

    const [focused, setFocused] = useState(false);
    // const decorator = new CompositeDecorator([
    //     {
    //       strategy: findLinkEntities,
    //       component: Link,
    //     },
    //     {
    //       strategy: findImageEntities,
    //       component: Image,
    //     },
    //   ]);

    // const blocksFromHTML = htmlToDraft(input.value);
    // const state = ContentState.createFromBlockArray(
    //     blocksFromHTML.contentBlocks
    //   );
     
    //const [contentState, setContentState] = useState(convertToRaw(state));

  //  const [editorState, setEditorState] = useState(EditorState.createWithContent(state,decorator));
 
   // let editorState = EditorState.createWithContent(state,decorator);

    const onEditorStateChange = (meditorState:EditorState) => {
        debugger;
        setEditorState(meditorState);
        const html = toHtml(meditorState) //added
        if (input.value !== html) {
            input.onChange({ target: { name: 'text', value: html } })
        }
       //if(editorState.getCurrentContent() !== meditorState.getCurrentContent())
       //{
      //  editorState = meditorState;
       // return input.onChange(draftToHtml(convertToRaw(meditorState.getCurrentContent())))
      // }
    
    } 
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);

    // const onContentStateChange = (contentState:RawDraftContentState) => {
    //     debugger;
    //     setContentState(contentState);
    // } 
          return (
              <Form.Field error={touched && !!error}>
                <div className="editor">
                                <Editor 
                                editorState={editorState} 
                               // contentState={contentState}
                                wrapperClassName="html-editor-wrapper"
                                editorClassName={cx("html-editor",{focused})}
                                onEditorStateChange={onEditorStateChange}
                               // onContentStateChange={onContentStateChange}
                               onBlur={onBlur}
                               onFocus={onFocus}
                                toolbar={{
                                    options:  ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history']
                                }}
                                />
                                {/* {
                                    console.log('editorState => ', editorState)
                                }  */}
                            </div>
              </Form.Field>
           
        )
  
   
}



// function findLinkEntities(contentBlock:any, callback:any, contentState:any) {
//     contentBlock.findEntityRanges(
//       (character:any) => {
//         const entityKey = character.getEntity();
//         return (
//           entityKey !== null &&
//           contentState.getEntity(entityKey).getType() === 'LINK'
//         );
//       },
//       callback
//     );
//   }

  // const Link = (props:any) => {
  //   const {url} = props.contentState.getEntity(props.entityKey).getData();
  //   return (
  //     <a href={url}>
  //       {props.children}
  //     </a>
  //   );
  // };

  // function findImageEntities(contentBlock:any, callback:any, contentState:any) {
  //   contentBlock.findEntityRanges(
  //     (character:any) => {
  //       const entityKey = character.getEntity();
  //       return (
  //         entityKey !== null &&
  //         contentState.getEntity(entityKey).getType() === 'IMAGE'
  //       );
  //     },
  //     callback
  //   );
  // }

  // const Image = (props:any) => {
  //   const {
  //     height,
  //     src,
  //     width,
  //   } = props.contentState.getEntity(props.entityKey).getData();

  //   return (
  //     <img src={src} height={height} width={width} />
  //   );
  // };

 


export default WYSIWYGEditor