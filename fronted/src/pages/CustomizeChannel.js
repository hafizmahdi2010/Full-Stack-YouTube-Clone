import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

const CustomizeChannel = () => {

  const [bannerPic, setBannerPic] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [chName, setChName] = useState("")

  // errors

  const [bannerError, setBannerError] = useState("")
  const [profileError, setProfileError] = useState("")

  async function submitBannerPic() {
    if (!bannerPic) {
      setBannerError('Please select a banner picture.');
      return;
    }

    const bannerFormData = new FormData();
    bannerFormData.append('bannerPic', bannerPic);
    bannerFormData.append('userId', localStorage.getItem("userId"));
    bannerFormData.append('email', localStorage.getItem("userEmail"));
    bannerFormData.append('username', localStorage.getItem("username"));

    try {
      const response = await fetch('http://127.0.0.1:8000/addBannerPic', {
        method: 'POST',
        body: bannerFormData,
      });

      if (response.ok) {
        console.log('File uploaded successfully');
        setBannerError('');
        alert("File uploaded successfully")
        // Reset banner pic state after successful upload if needed
        setBannerPic(null);
      } else {
        console.error('Failed to upload file');
        // Handle error response from the server if needed
      }
    } catch (error) {
      console.error('Error uploading file: ', error);
      // Handle other errors, like network errors
    }
  }

  async function addChName() {
    let chNameInput = document.querySelector(".chName");
    if (chName == "") {
      console.log("You Can Right Somthing !")
    }
    else {
      fetch('http://127.0.0.1:8000/custamizeChannel', {
        mode: 'cors',
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
          mode: "chName",
          channelName: chName,
          userId: localStorage.getItem("userId"),
          userName: localStorage.getItem("username"),
          userEmail: localStorage.getItem("userEmail"),
        })
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Data', data);
          alert("SuccessFully Updated")
        })
        .catch((error) => console.error('Error fetching data:', error));
    }

  }

  async function addProfilePic(){
    if (!profilePic) {
      setProfileError('Please select a banner picture.');
      return;
    }

    const profileformData = new FormData();
    profileformData.append('image', profilePic);
    profileformData.append('userId', localStorage.getItem("userId"));
    profileformData.append('email', localStorage.getItem("userEmail"));
    profileformData.append('username', localStorage.getItem("username"));


    try {
      const response = await fetch('http://127.0.0.1:8000/uploadProfilePic', {
        method: 'POST',
        body: profileformData,
      });

      if (response.ok) {
        console.log('File uploaded successfully');
        setProfileError('');
        alert("File uploaded successfully")
        setProfilePic(null);
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file: ', error);
    }

  }

  return (
    <>
      <Navbar />
      <div className="custamizeChan">
        <div className="flex">
          <div className="custamizeSideBar">
            <Link><i class="ri-edit-fill"></i> <span>Edit Channel Name</span></Link>
            <Link><i class="ri-file-add-fill"></i> <span>Add Banner</span></Link>
            <Link><i class="ri-user-3-fill"></i> <span>Add Prifile Pic</span></Link>
            <Link><i class="ri-upload-cloud-line"></i> <span>Upload New Video</span></Link>
            <Link><i class="ri-video-fill"></i> <span>Customization Videos</span></Link>
          </div>
          <div className="block custamizeContentDash">
            <h3>Channel customization</h3>

            <div id="editChName" className='editChName'>
              <label htmlFor="chName">Enter Your Channel Name</label>
              <input type="text" placeholder='Enter Your Channel Name' name='chName' id='chName' onChange={(e) => setChName(e.target.value)} />
              <button className='btn' onClick={addChName}>Add Channel Name</button>
            </div>

            <div className="addBanner" id="addBanner">
              <h3>Add Banner</h3>

              <input type="file" hidden name='addBannerInput' id='AddBannerInput' onChange={(e) => {
                setBannerPic(e.target.files[0]);
                setBannerError('');
                let bannerImg = document.querySelector(".bannerImgDiv>img");
                document.querySelector(".addBannerIcon").style.display = "none";
              }} />

              <label htmlFor='AddBannerInput' className="bannerImgDiv">
                {bannerPic && (
                  {/* <img src={URL.createObjectURL(bannerPic)} alt='Banner' /> */}
                )}
                <i class="ri-image-add-line addBannerIcon"></i>
              </label>

              <span className="error">{profileError}</span>





              <span className='error mt-3'>{bannerError}</span>
              <button className='btn my-5' style={{ width: 170 }} onClick={submitBannerPic}>Add Banner</button>

            </div>

            <div className="addProfilePic" id="addProfilePic">
              <h3>Add Profile Pic</h3>
              <input type="file" hidden name='addProfilePicInput' id='addProfilePicInput' onChange={(e) => 
              {
              setProfilePic(e.target.files[0])
              document.querySelector('.addProfileIcon').style.display = "none";
              // console.log(URL.createObjectURL(profilePic));
              }
              }
               />
              <lable htmlFor='addProfilePicInput' onClick={()=>document.querySelector("#addProfilePicInput").click()} 
              className="profileImgDiv">
                {profilePic && (
                  <img src={URL.createObjectURL(profilePic)} alt='profile' />
                )}

                <i className="ri-user-add-line addProfileIcon"></i>
              </lable>
              <button className='btn my-5' style={{ width: 170 }} onClick={addProfilePic}>Add Profile Pic</button>
            </div>


          </div>
        </div>

      </div>
    </>
  )
}

export default CustomizeChannel