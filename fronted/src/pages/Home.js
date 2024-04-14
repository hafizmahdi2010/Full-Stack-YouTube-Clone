import React from 'react'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import VideosContainer from '../components/VideosContainer'

const Home = () => {
  return (
    <>
     <Navbar/>
     <div className="flexContainer">
      <SideBar/>
      <VideosContainer/>
     </div>
    </>
  )
}

export default Home