import React, { useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import './App.css';

export default function App() {
  const editorRef = useRef(null);
  const [editorContent, setEditorContent] = useState("<p>This is the initial content of the editor.</p>");

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorContent(data);
  };

  const handleImageUpload = (editor) => {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return {
        upload: () => {
          return new Promise((resolve, reject) => {
            const data = new FormData();
            loader.file.then((file) => {
              data.append('upload', file);

              axios.post('http://localhost:8000/upload-image', data, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })
              .then((response) => {
                console.log('Image URL:', response.data.url); // Debugging line
                resolve({
                  default: response.data.url,
                });
              })
              .catch((error) => {
                console.error('Error uploading image:', error);
                reject(error);
              });
            });
          });
        },
      };
    };
  };

  const saveContent = async () => {
    try {
      const response = await axios.post('http://localhost:8000/save-content', { description: editorContent });
      if (response.data.success) {
        alert('Content saved successfully');
      } else {
        alert('Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  return (
    <>
      <CKEditor
        editor={ClassicEditor}
        data={editorContent}
        onReady={(editor) => {
          editorRef.current = editor;
          handleImageUpload(editor);
        }}
        onChange={handleEditorChange}
        config={{
          ckfinder: {
            uploadUrl: 'http://localhost:8000/upload-image',
          },
          toolbar: [
            'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'insertImage', 'blockQuote', 'undo', 'redo',
          ],
          height: 1000,
        }}
        style={{ height: '1000px' }}
      />
      <button onClick={saveContent}>Save Content</button>
    </>
  );
}
