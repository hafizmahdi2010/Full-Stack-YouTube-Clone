import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { json } from 'react-router-dom';

const UploadVideo = () => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const [selectedImages, setSelectedImages] = useState(null);
  const [selectedVideos, setSelectedVideos] = useState(null);

  const handleImageChange = (e) => {
    setSelectedImages(e.target.files);
  };

  const handleVideoChange = (e) => {
    setSelectedVideos(e.target.files);
  };
 

  const uploadVideoFunction = async (e) => {
    e.preventDefault();
  
    // Reset error message
    setError('');
  
    if (!selectedVideos) {
      setError('Please Select The Video!');
      return;
    } else if (!title) {
      setError('Title Is Required!');
      return;
    } else if (!description) {
      setError('Description Is Required!');
      return;
    } else if (!selectedImages) {
      setError('Please Select The Video Thumbnail!');
      return;
    }
  
  
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

      formData.append('title',title);
      formData.append('description',description);
      formData.append('uploadBy',localStorage.getItem("userId"))

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
    }

  };



  return (
    <>
      <Navbar />
      <div className="uploadVideoContainer">
        <form className="form" onSubmit={uploadVideoFunction} enctype="multipart/form-data">
          <label htmlFor="video">Choose Video</label>
          <input
            type="file"
            name="video"
            id="video"
            onChange={handleVideoChange}
          />

          <label htmlFor="title">Enter A Video Title</label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Enter A Video Title"
            name="title"
            id="title"
            value={title}
          />

          <label htmlFor="desc">Enter A Video Description</label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            name="desc"
            id="desc"
            placeholder="Enter A Video Description"
            value={description}
          ></textarea>

          <label htmlFor="thum">Choose A Video Thumbnail</label>
          <input
            type="file"
            name="thum"
            id="thum"
            onChange={handleImageChange}
          />

          <span className="error">{error}</span>
          <button type="submit" className="uploadVideoBtn">
            Upload Video
          </button>
        </form>
      </div>
    </>
  )
}

export default UploadVideo