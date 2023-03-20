import React, { useEffect, useState } from 'react'
import { convertToRaw } from 'draft-js';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

export default function NewsEditor (props) {
  const [editorState, seteditorState] = useState('')

  useEffect(() => {
    // console.log('editor', props.content)
    // html===>draft
    const html = props.content
    if (html === undefined) return
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      seteditorState(editorState)
    }
  }, [props.content])


  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={(editorState) => seteditorState(editorState)}
        onBlur={() => {
          console.log('blur', draftToHtml(convertToRaw(editorState.getCurrentContent())))
          props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }}
      />
    </div>
  )
}
