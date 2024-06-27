// import React, { useRef, useState } from 'react';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import axios from 'axios';
// import './App.css';

// export default function App() {
//   const editorRef = useRef(null);
//   const [editorContent, setEditorContent] = useState("<p>This is the initial content of the editor.</p>");

//   const handleEditorChange = (event, editor) => {
//     const data = editor.getData();
//     setEditorContent(data);
//   };

//   const handleImageUpload = (editor) => {
//     editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
//       return {
//         upload: () => {
//           return new Promise((resolve, reject) => {
//             const data = new FormData();
//             loader.file.then((file) => {
//               data.append('upload', file);

//               axios.post('http://localhost:8000/upload-image', data, {
//                 headers: {
//                   'Content-Type': 'multipart/form-data',
//                 },
//               })
//               .then((response) => {
//                 console.log('Image URL:', response.data.url); // Debugging line
//                 resolve({
//                   default: response.data.url,
//                 });
//               })
//               .catch((error) => {
//                 console.error('Error uploading image:', error);
//                 reject(error);
//               });
//             });
//           });
//         },
//       };
//     };
//   };

//   const saveContent = async () => {
//     try {
//       const response = await axios.post('http://localhost:8000/save-content', { description: editorContent });
//       if (response.data.success) {
//         alert('Content saved successfully');
//       } else {
//         alert('Failed to save content');
//       }
//     } catch (error) {
//       console.error('Error saving content:', error);
//     }
//   };

//   return (
//     <>
//       <CKEditor
//         name="description"
//         editor={ClassicEditor}
//         data={editorContent}
//         onReady={(editor) => {
//           editorRef.current = editor;
//           handleImageUpload(editor);
//         }}
//         onChange={handleEditorChange}
//         config={{
//           ckfinder: {
//             uploadUrl: 'http://localhost:8000/upload-image',
//           },
//           toolbar: [
//             'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'insertImage', 'blockQuote', 'undo', 'redo',
//           ],
//           height: 1000,
//         }}
//         style={{ height: '1000px' }}
//       />
//       <button onClick={saveContent}>Save Content</button>
//     </>
//   );
// }


import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UploadFile() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Ambil CSRF Token dari DOM saat komponen dimuat pertama kali
    const token = document.head.querySelector('meta[name="csrf-token"]');
    if (token) {
      setCsrfToken(token.content);
    }
  }, []);

  const handleFileChange = (e) => {
    setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    try {
      // Pastikan CSRF Token tersedia sebelum mengirim permintaan POST
      if (!csrfToken) {
        console.error('CSRF Token not found');
        return;
      }

      // Mengirim permintaan POST menggunakan Axios
      const response = await axios.post('http://localhost:8000/issue/1/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'X-CSRF-TOKEN': csrfToken,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      console.log('Response:', response.data);
      alert('Files uploaded successfully');
      setSelectedFiles([]);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files');
    }
  };

  return (
    <div>
      <h1>Multiple File Upload</h1>
      <input type="file" multiple onChange={handleFileChange} />
      <br />
      <button onClick={handleUpload} disabled={selectedFiles.length === 0}>
        Upload Files
      </button>
      <br />
      {uploadProgress > 0 && <progress value={uploadProgress} max="100">{uploadProgress}%</progress>}
      <div>
        {selectedFiles.length > 0 && (
          <div>
            <h2>Selected Files:</h2>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
