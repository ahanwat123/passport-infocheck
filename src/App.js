import React, { useState } from 'react';
import './App.css'
// Replace the API_BASE_URL and API_KEY with your own values
const API_BASE_URL = 'https://dataextractengine.onrender.com'; 

//const API_BASE_URL = 'http://localhost:4000';
const API_KEY = 'avinash';

const DocumentUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [result, setResult] = useState();
  const [result1, setResult1] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const maxFiles = 2;

    // Ensure the user selects up to two files
    if (files.length <= maxFiles) {
      setSelectedFiles(Array.from(files));
    } else {
      setError(`Please select a maximum of ${maxFiles} files.`);
    }
  };
  const handleFileChange2 = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };
  const handleConversion = async () => {
    setLoading1(true)
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/convert-pdf`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
        if (response.ok) {
          setLoading1(false)
          setResult1(data);
          setError(null);
        } else {
          setLoading1(false)
          setError(data.error || 'Something went wrong.');
          setResult(null);
        }
      
    } catch (error) {
      setLoading1(false)
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
setLoading(true)
    if (selectedFiles.length === 0) {
      setError('Please select at least one file.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append(`document${index + 1}`, file);
    });

    try {
     
     
      const response = await fetch(`${API_BASE_URL}/extract`, {
        method: 'POST',
        headers: {
          Authorization: API_KEY,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setLoading(false)
        setResult(data);
        setError(null);
      } else {
        setError(data.error || 'Something went wrong.');
        setResult(null);
      }
    } catch (error) {
      setLoading(false);
      setError('Failed to send files to the server.');
      setResult(null);
    } finally {
      
    }
  };

  return (
    <div>
      <div className='left-div'>
      <form onSubmit={handleSubmit}>
      <h1>Upload Documents (Up to 2)</h1>
        <div>
          <label htmlFor="fileInput">Select Files:</label>
          <input
            type="file"
            id="fileInput"
            accept=".jpeg, .jpg, .png, .pdf"
            multiple
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Upload and Extract</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {loading==true?<p>Loading</p>:
        <div>
          <h2>Response Data:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>}  
        </div>   
      <div className='right-div'>
       <h1>Extract driver licence</h1>
       <input type="file" accept=".pdf, image/*" onChange={handleFileChange2} />
       <button onClick={handleConversion}>Upload and Extract data</button>
       <div>
          <h2>Response Data:</h2>
          {loading1==true?<p>Loading</p>:
          <pre>{JSON.stringify(result1, null, 2)}</pre>}
        </div>
    </div>
    </div>
  );
};

export default DocumentUpload;
