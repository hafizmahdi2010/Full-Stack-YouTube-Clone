import React from 'react'
import { useState, useEffect } from 'react';
import VideosData from "../pages/VideosData.json"
import { useNavigate } from "react-router-dom";
const VideosContainer = () => {
  const navigate = useNavigate();
  const [videosData, setVideosData] = useState([])

  // Function to format Numbers
  function formatNumber(number) {
    if (number >= 1000000000) {
      return (number / 1000000000).toFixed(1) + 'B';
    } else if (number >= 10000000) {
      return (number / 10000000).toFixed(1) + 'Cr';
    } else if (number >= 100000) {
      return (number / 100000).toFixed(1) + 'L';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K';
    } else {
      return number;
    }
  }


  function openSingleVideoPage(videoID) {
    console.log(videoID)
    navigate(`/video/${videoID}`, { videoID: videoID });
  }


  const featchVideosData = () => {
    fetch('http://127.0.0.1:8000/getAllVideoData', {
      mode: 'cors',
      method: 'GET',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Result', data);
        setVideosData(data)
      })
      .catch((error) => console.error('Error fetching data:', error));
  }

  useEffect(() => {
    featchVideosData();
  }, []);



  return (
    <>

      <div className="videosContainer rightContent">
        {
          videosData ?
            videosData.map((elem, index) => {

              return (
                <div className="video" key={index} onClick={() => openSingleVideoPage(elem.id)}>
                  <img src={`http://localhost:8000/uploads/images/${elem.thumbinal}`} alt="" />
                  <div className="flexContainer">
                    <img src={elem.channelPic ? elem.channelPic : "https://icons.iconarchive.com/icons/papirus-team/papirus-status/256/avatar-default-icon.png"} className='channelImg' alt="" />
                    <div className='block' style={{ textAlign: "left" }}>
                      <h3>{elem.title}</h3>
                      <p id='channelName'>{elem.channelName ? elem.channelName : elem.username}</p>
                    </div>
                  </div>
                  <div className="flexConatiner">
                    <p>{elem.views}</p>
                    <p style={{ marginTop: 5, width: "100%" }}>{formatNumber(elem.views)} Views &#x2022; {formatNumber(elem.likes)} Likes</p>
                  </div>
                </div>
              )
            }) : "No Videos Found"
        }
        {/* <div className="video">
          <img src="https://i.ytimg.com/vi/BtAjXazj0Uw/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDea0LoG4SeC1IQifHG_cJoorYj2g" alt="" />
          <div className="flexContainer">
          <img src="https://yt3.ggpht.com/M8HHa-4HpA1tPBYyCclC5JmODA7vx77XryhQe_0_4L9bCfpYwiDr7uJc3bOb9UZKJpogSC9OvA=s68-c-k-c0x00ffffff-no-rj" className='channelImg' alt="" />
          <h3>Video title</h3>
          </div>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rem animi consectetur accusantium!</p>
        </div> */}
      </div>
    </>
  )
}

export default VideosContainer