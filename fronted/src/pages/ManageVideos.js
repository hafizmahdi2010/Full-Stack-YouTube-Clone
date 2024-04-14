import React from 'react'
import Navbar from '../components/Navbar'

const ManageVideos = () => {
  return (
    <>
      <Navbar/>

      <div className="tableContainer">
        <div className="tableHeader">
          <p>Thumbinal</p>
          <p>Title</p>
          <p>Like</p>
          <p>Dislike</p>
        </div>
      </div>

    </>
  )
}

export default ManageVideos