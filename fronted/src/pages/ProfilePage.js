import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

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

  const [fullData, setFullData] = useState(null)



  function getProfileData(){
       fetch(`http://127.0.0.1:8000/getProfileData`, {
        mode: 'cors',
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
          userId:localStorage.getItem("userId")
          // userId:3
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Result of profile', data);
          if(data.fale == 1){
            console.log(data.msg)
          }
          else{
            let channelName = document.getElementById("channelName");
            let subscribers = document.getElementById("subscribers");
            let videosLength = document.getElementById("videosLength");
            let bannerImg = document.querySelector('.bannerDiv>img');
            let profilePic = document.querySelector('.channelImage>img');

            setFullData(data)
            console.log("full Data",fullData)
            channelName.innerText = data[0].channelName ? data[0].channelName : data[0].username;
            // channelName = data[0].channelName ? data[0].channelName : data[0].username;
            subscribers.innerHTML = data[0].subscribers ? formatNumber(data[0].subscribers) + " subscribers" : "No subscribers";
            videosLength.innerHTML = data.length ? formatNumber(data.length) : "No Videos";
            bannerImg.setAttribute("src", data[0].bannerPic ? "http://localhost:8000/uploads/userChannelUpload/"+data[0].bannerPic
             : "https://media.istockphoto.com/id/1197124778/photo/circle-blue-abstract-background.webp?b=1&s=170667a&w=0&k=20&c=WVvccyuMQrJo5Mm_tLuObnrmzwMjopiz6LyaLCKJOFc=")
             
            profilePic.setAttribute("src",data[0].profilePic ? "http://localhost:8000/uploads/userChannelUpload/profilePics/"+data[0].profilePic : "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg") 

             console.log("name : ",channelName,videosLength,subscribers)
            console.log("No Errors.")
          }
        })
        .catch((error) => console.error('Error fetching data:', error));
  }

  useEffect(() => {
    getProfileData()
  }, [])
  

  return (
    <>
      <Navbar/>
      <div className="flex">
      <SideBar/>
      <div className="rightContent profileContainer">
        <div className="bannerDiv">
          <img alt="Banner" />
        </div>

        <div className="flex">
          <div className="channelImage">
            <img src="https://yt3.googleusercontent.com/Ub8wDdhEHV3bjCLNG8zosz2EXk5Fatw-n5D8wjcn0hKV8s6_OcyjozpxyrseQouEFClafMjQ7g=s176-c-k-c0x00ffffff-no-rj" alt="" />
          </div>
          


          <div className="block">
            <h1 id='channelName'>ChannelName</h1>
            <p style={{marginBottom:10}}>@mahdifarooqui  &#8226; <span id='subscribers'> subscribers</span>  &#8226; <span id='videosLength'></span> videos</p>
            <p>Welcome to Code With Mahdi YouTube Channel, your one-stop destination for all things code...</p>

            <p><Link>13.126.206.12</Link> and 3 more links</p>

            <div className="flex">
              <Link to="/customizeChannel"><button>Customize channel</button></Link>
              <button>Manage videos</button>
            </div>

          </div>

        </div>

        <h3>Your Videos</h3>
        <div className="videos">

        {

          fullData && fullData.length > 0 && fullData[0].isVideos !== false ?
          fullData.map((elem,index)=>{
          return (
          <div className="video" onClick={() => navigate(`/video/${elem.id}`, { videoID: elem.id })}>
            <img src={`http://localhost:8000/uploads/images/${elem.thumbinal}`} alt="" />
            <h3>{elem.title}</h3>
            <p>{elem.views ? formatNumber(elem.views) : "No"} views  &#8226; {elem.uploadOn ? new Date(elem.uploadOn).toDateString() : "ok" }</p>
          </div>
          )
          }) : "No Videos"

        }
        

        </div>

      </div>
      </div>
    </>
  )
}

export default ProfilePage