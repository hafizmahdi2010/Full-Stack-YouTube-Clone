import React, { useState } from 'react';

function FileUploadForm() {
  const [selectedImages, setSelectedImages] = useState(null);
  const [selectedVideos, setSelectedVideos] = useState(null);

  const handleImageChange = (e) => {
    setSelectedImages(e.target.files);
  };

  const handleVideoChange = (e) => {
    setSelectedVideos(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      if (selectedImages) {
        for (let i = 0; i < selectedImages.length; i++) {
          formData.append('images', selectedImages[i]);
        }
      }
      if (selectedVideos) {
        for (let i = 0; i < selectedVideos.length; i++) {
          formData.append('videos', selectedVideos[i]);
        }
      }

      const response = await fetch('http://localhost:8000/uploadVideo', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Files uploaded successfully');
      } else {
        alert('Error uploading files');
      }
    } catch (error) {
      console.error('Error uploading files: ', error);
      alert('Error uploading files');
    }
  };

  return (
    <div>
      <h2>Upload Files</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Images:</label>
          <input type="file" name="images" onChange={handleImageChange} multiple />
        </div>
        <div>
          <label>Videos:</label>
          <input type="file" name="videos" onChange={handleVideoChange} multiple />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default FileUploadForm;
