import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import videosData from "../pages/VideosData.json"
import Navbar from "../components/Navbar"
import { BiLike, BiDislike } from "react-icons/bi";
import { IoIosShareAlt } from "react-icons/io";
import { MdFileDownload } from "react-icons/md";
import moment from 'moment';
import { useNavigate } from "react-router-dom";

const SingleVideo = () => {
  const navigate = useNavigate();

  function openSingleVideoPage(videoID) {
    console.log(videoID)
    navigate(`/video/${videoID}`, { videoID: videoID });
    window.location.reload()
  }

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


  let { videoID } = useParams();

  const [singleVideoData, setSingleVideoData] = useState(null);
  const [allVideos, setAllVideos] = useState(null)


  const featchSingleVideoData = () => {
    console.log("Video ID : ", videoID)
    fetch('http://127.0.0.1:8000/getSingleVideoData/', {
      mode: 'cors',
      method: 'POST',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({
        vidId: videoID
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Single Video data', data);
        setSingleVideoData(data)
      })
      .catch((error) => console.error('Error fetching data:', error));
  }

  function openFullDescriptionBox() {
    let descriptionBox = document.querySelector(".descriptionBox");
    descriptionBox.classList.toggle("active")
  }


  const featchVideosData = () => {
    fetch('http://127.0.0.1:8000/getAllVideoData', {
      mode: 'cors',
      method: 'GET',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Data', data);
        setAllVideos(data)
      })
      .catch((error) => console.error('Error fetching data:', error));
  }

  useEffect(() => {
    featchSingleVideoData();
    featchVideosData();
  }, [])


  return (
    <>
      <Navbar />
      {
        singleVideoData ?
          singleVideoData.map((elem, index) => {
            return (
              <div className="flexContainer" key={index}>
                <div className="videoContainer">
                  <video src={`http://localhost:8000/uploads/videos/${elem.video}`} autoPlay controls></video>
                  <h3>{elem.title}</h3>
                  <div className="flex js-between">

                    <div className="flex">
                      <img className='channelImg' src="https://yt3.googleusercontent.com/Ub8wDdhEHV3bjCLNG8zosz2EXk5Fatw-n5D8wjcn0hKV8s6_OcyjozpxyrseQouEFClafMjQ7g=s900-c-k-c0x00ffffff-no-rj" alt="" />
                      <div className="block">
                        <h3>{elem.channelName ? elem.channelName : elem.username}</h3>
                        <p>{elem.subscribers ? formatNumber(elem.subscribers) + " subscribers" : "No Subscribers"}</p>
                      </div>
                      <button className="subscribeBtn">Subscribe</button>
                    </div>

                    <div className="flex">
                      <button className="button"><i><BiLike /></i> Like,{formatNumber(elem.likes)}</button>
                      <button className="button"><i><BiDislike /></i> Dislike,{formatNumber(elem.dislikes)}</button>
                      <button className="button"><i><IoIosShareAlt /></i> Share</button>
                      <button className="button"><i><MdFileDownload /></i> Download</button>
                    </div>

                  </div>

                  {/* Description Box */}
                  <div className="descriptionBox" onClick={openFullDescriptionBox}>
                    <div className="flex">
                      <p>{formatNumber(elem.views)} views</p>
                      &nbsp; &nbsp;
                      <p>Upload In {new Date(elem.date).toLocaleDateString()}</p>
                    </div>

                    {/* <p>{elem.description}</p> */}
                    <p>{elem.description}</p>
                  </div>

                </div>
                <div className="otherVideos">
                  {
                    allVideos ? 
                    allVideos.map((e,i)=>{
                      return (
                       <>
                         <div className="videoCard" key={i} onClick={() => openSingleVideoPage(e.id)}>
                          <img src={`http://localhost:8000/uploads/images/${e.thumbinal}`} alt={e.title} />
                          <div>
                          <h3>{e.title}</h3>
                          <p>{e.channelName ? e.channelName : e.username}</p>
                          <p>{e.views ? formatNumber(e.views) : "No"} views</p>
                          </div>
                         </div>
                       </>
                      )
                    }) : "No Videos Yet"
                  }
                </div>
              </div>
            )
          }) : "No Video"
      }

    </>
  )
}

export default SingleVideo