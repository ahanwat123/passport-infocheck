import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:4000'; // Replace with the base URL of your API server
const API_KEY = 'avinash'; // Replace with your API key

const DocumentUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('document', selectedFile);

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
        setResult(data);
        setError(null);
      } else {
        setError(data.error || 'Something went wrong.');
        setResult(null);
      }
    } catch (error) {
      setError('Failed to fetch data from the server.');
      setResult(null);
    }
  };

  return (
    <div>
      <h1>Upload a Document</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".jpeg, .jpg, .png, .pdf" onChange={handleFileChange} />
        <button type="submit">Upload and Extract</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {result && (
        <div>
          <h2>Extracted Data:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
