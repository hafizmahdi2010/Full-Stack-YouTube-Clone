import React from 'react'
import "./App.css"
import { BrowserRouter, Routes, Route,useNavigate,Link,Navigate } from "react-router-dom";
import Home from './pages/Home';
import Error from './pages/Error';
import SingleVideo from './pages/SingleVideo';
import SearchResults from './pages/SearchResults';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import UploadVideo from './pages/UploadVideo';
import FileUpload from './pages/FileUpload';
import ProfilePage from './pages/ProfilePage';
import CustomizeChannel from './pages/CustomizeChannel';
import ManageVideos from './pages/ManageVideos';

const App = () => {

  let isLoggedIn = localStorage.getItem("userLoggedIn");

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/video/:videoID" element={<SingleVideo />} />
            <Route path="/searchvideo" element={<SearchResults />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/uploadVideo" element={isLoggedIn ? <UploadVideo/> : <Navigate to="/login" />} />
            <Route path="/profile" element={isLoggedIn ? <ProfilePage/> : <Navigate to="/login" />} />
            <Route path="/customizeChannel" element={isLoggedIn ? <CustomizeChannel/> : <Navigate to="/login" />} />
            <Route path="/manageVideos" element={isLoggedIn ? <ManageVideos/> : <Navigate to="/login" />} />
            <Route path="/test" element={isLoggedIn ? <FileUpload/> : <Navigate to="/login" />} />
            <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App