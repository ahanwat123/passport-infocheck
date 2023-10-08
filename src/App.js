import React, { useState } from 'react';

const API_BASE_URL = 'https://dataextractengine.onrender.com'; 
//const API_BASE_URL = 'http://localhost:4000'; // Replace with the base URL of your API server
const API_KEY = 'avinash'; // Replace with your API key

const DocumentUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState({
    document1: null,
    document2: null,
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleFileChange = (event) => {
    const file1 = event.target.files[0];
    const file2 = event.target.files[1];

    if (event.target.files.length > 2) {
      setError('Please select only two files.');
      return;
    }

    setSelectedFiles({
      document1: file1,
      document2: file2,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFiles.document1 || !selectedFiles.document2) {
      setError('Please select both files.');
      return;
    }

    const formData = new FormData();
    formData.append('document1', selectedFiles.document1);
    formData.append('document2', selectedFiles.document2);

    try {
      setLoading(true); // Set loading to true while waiting for the response

      const response = await fetch(`${API_BASE_URL}/extract`, {
        method: 'POST',
        headers: {
          Authorization: API_KEY,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
        setError(null);
      } else {
        setError(data.error || 'Something went wrong.');
        setResult(null);
      }
    } catch (error) {
      setError('Failed to send files to the server.');
      setResult(null);
    } finally {
      setLoading(false); // Set loading back to false after the response
    }
  };

  return (
    <div>
      <h1>Upload Documents</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fileInput">Select Two Documents:</label>
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
      {loading && <div className="spinner"></div>} {/* Display spinner when loading */}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {result && (
        <div>
          <h2>Response Data:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
