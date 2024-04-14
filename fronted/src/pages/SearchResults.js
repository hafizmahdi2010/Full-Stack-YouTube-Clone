import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import { useNavigate } from "react-router-dom";

const SearchResults = () => {
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

  const queryParams = new URLSearchParams(window.location.search);
  const paramValue = queryParams.get('searchVal');

  const [searchResultData, setSearchResultData] = useState(null)

  function SearchVideos(){
    fetch(`http://127.0.0.1:8000/searchVideo?searchVal=${paramValue}`, {
      mode: 'cors',
      method: 'GET',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Result', data);
        setSearchResultData(data)
      })
      .catch((error) => console.error('Error fetching data:', error));
  }

  function openSingleVideoPage(videoID) {
    console.log(videoID)
    navigate(`/video/${videoID}`, { videoID: videoID });
  }


  useEffect(() => {
    SearchVideos()
  }, [])
  
  if(searchResultData === null){
   return (
    <>
    <div className="searchResultsContainer">
      <h1>No Search Results Found</h1>
    </div>
    </>
   )
  }
  
  return (
    <>
    <Navbar/>
     <SideBar/>
    <div className="flex searchResultsContainer">
      {
        searchResultData ? 
        searchResultData.map((elem,index)=>{
          return (
            <>
              <div className="searchedVideoCard" key={index} onClick={() => openSingleVideoPage(elem.id)}>
                 <img src={`http://localhost:8000/uploads/images/${elem.thumbinal}`} alt="" />
                 <div style={{height:"90%",marginLeft:15}}>
                  <h3>{elem.title}</h3>
                  <p>{formatNumber(elem.views)} views  &#x2022; Upload In {new Date(elem.date).toLocaleDateString()}</p>
                  
                  <div className="flex">
                    <img className='channelImg' src="https://yt3.googleusercontent.com/Ub8wDdhEHV3bjCLNG8zosz2EXk5Fatw-n5D8wjcn0hKV8s6_OcyjozpxyrseQouEFClafMjQ7g=s900-c-k-c0x00ffffff-no-rj" alt="" />
                    &nbsp;&nbsp;
                    <p>CodeWithMahdi ✅ </p>
                  </div>
                  <p style={{marginTop:10}}>{elem.description}</p>

                 </div>
              </div>
            </>
          )
        }) : "No Results Found"
      }
    </div>
    </>
  )
}

export default SearchResults