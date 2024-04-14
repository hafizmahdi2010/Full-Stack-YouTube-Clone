var express = require('express');
var videoModel = require("../models/videosSchema")
var router = express.Router();
var userModel = require("../models/usersSchema")
const multer = require('multer')
const fs = require('fs');
const path = require("path")
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { set } = require('mongoose');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


// APIS

// Get all videos data

router.get("/getVideosData", async (req, res) => {
  let videos = await videoModel.find({});
  if (videos.length != 0) {
    return res.json(videos)
  }
  else {
    return res.json({
      fale: 1,
      msg: "No Videos Found"
    })
  }
})



// Get single video data

router.post("/getSingleVideoData", async (req, res) => {
  let vidId = req.body.vidId;
  let video = await videoModel.find({ id: vidId });
  let users = await userModel.find({})
  let fullVideoData = [];
  if (video.length != 0) {

    for (let i = 0; i < video.length; i++) {
      const element = video[i];
      let user = await userModel.findOne({ id: element.uploadBy })

      fullVideoData.push({
        id: element.id,
        title: element.title,
        description: element.description,
        thumbinal: element.thumbinal,
        video: element.video,
        views: element.views,
        likes: element.likes,
        dislikes: element.dislikes,
        comments: element.comments,
        username: user.username,
        subscribers: user.subscribers,
        channelName: user.channelName,
        channelPic: user.profilePic
      });

    }

    return res.json(fullVideoData);
  }
  else {
    return res.json({
      fale: 1,
      msg: "No Video Founded"
    })
  }
})

// search api

router.get("/searchVideo", async (req, res) => {
  if (req.query.searchVal != "") {
    let searched = new RegExp("^" + req.query.searchVal, "i")
    let results = await videoModel.find({ title: searched });
    if (results.length == 0) {
      results = await videoModel.find({ description: searched })
    }
    return res.json(results)
  }
  else {
    return res.json({
      fale: 1,
      msg: "No Search Results Found"
    })
  }
})



// users api

// sign Up
router.post("/signUpUser", async (req, res) => {
  let emailCon = await userModel.find({ email: req.body.email });
  let numberCon = await userModel.find({ number: req.body.number });
  console.log(emailCon.length, numberCon.length)
  if (emailCon.length != 0) {
    return res.json({
      fale: 1,
      msg: "Email Is Already Registered !"
    })
  }
  if (numberCon.length != 0) {
    return res.json({
      fale: 1,
      msg: "Number Is Already Registered !"
    })
  }
  else {
    let users = await userModel.find({});
    let id;
    if (users.length > 0) {
      let last_user_array = users.slice(-1);
      let last_user = last_user_array[0];
      id = last_user.id + 1;
    }
    else {
      id = 1
    }

    let regesteredUser = await userModel.create({
      id: id,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      number: req.body.number,
    })
    console.log(regesteredUser);
    res.json(regesteredUser)
  }
})

// login

router.post("/loginUser", async (req, res) => {
  let user = await userModel.find({ email: req.body.email, password: req.body.password });
  if (user.length != 0) {
    console.log(user[0].id)
    return res.json({
      success: 1,
      email: user[0].email,
      username: user[0].username,
      userId: user[0].id
    })
  }
  else {
    return res.json({
      fale: 1,
      msg: "Email And Password Is Wrong !"
    })
  }
})

// logout user

router.post("/logoutUser", async (req, res) => {
  let user = await userModel.find({ id: req.body.id, email: req.body.email })
  if (user.length != 0) {
    return res.json({
      success: 1,
      mode: "Logout",
      username: user[0].username,
      email: user[0].email,
      userId: user[0].id
    })
  }
  else {
    return res.json({
      fale: 1,
      msg: "No Information Found"
    })
  }
})


// upload image engine

// Multer storage configurations for image and video uploads



// Create the directory if it doesn't exist
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads", { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating directory:', err);
    } else {
      console.log('Directory created successfully');
    }
  });
}

// Set up storage using Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Uploads will be stored in the 'uploads/' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Get the file extension
    const ext = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
  }
});

// Initialize Multer upload object
const upload = multer({ storage: storage });

// upload video api

router.post("/uploadVideo", upload.fields([
  { name: 'images', maxCount: 5 }, // Allow up to 5 images
  { name: 'videos', maxCount: 2 }   // Allow up to 2 videos
]), async (req, res) => {

  const images = req.files['images'];
  const videos = req.files['videos'];
  console.log(req.files['images'])

  sortFiles();

  let AllVideos = await videoModel.find({});
  let id;
  if (AllVideos.length > 0) {
    let last_video_array = AllVideos.slice(-1);
    let last_video = last_video_array[0];
    id = last_video.id + 1;
  }
  else {
    id = 1
  }

  let video = await videoModel.create({
    id: id,
    title: req.body.title,
    description: req.body.description,
    thumbinal: req.files['images'][0].filename,
    video: req.files['videos'][0].filename,
    uploadBy: req.body.uploadBy,
  })


  if (!images || !videos) {
    return res.status(400).send('Please upload both images and videos.');
  }

  return res.json({
    success: 1,
    title: req.body.title,
    videoID: id,
    thumbinalURL: `http://localhost:8000/uploads/images/${req.files['images'][0].filename}`,
    videoURL: `http://localhost:8000/uploads/images/${req.files['videos'][0].filename}`,
  })

})


const uploadFolder = './uploads';

// Function to sort files into respective folders
function sortFiles() {
  fs.readdir(uploadFolder, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(uploadFolder, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error stating file:', err);
          return;
        }

        if (stats.isFile()) {
          const fileExt = path.extname(file).toLowerCase();
          let folderName = '';

          if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileExt)) {
            folderName = 'images';
          } else if (['.mp4', '.avi', '.mov', '.mkv'].includes(fileExt)) {
            folderName = 'videos';
          } else {
            folderName = 'others';
          }

          const destFolder = path.join(uploadFolder, folderName);
          if (!fs.existsSync(destFolder)) {
            fs.mkdirSync(destFolder);
          }

          const destFilePath = path.join(destFolder, file);
          fs.rename(filePath, destFilePath, err => {
            if (err) {
              console.error('Error moving file:', err);
              return;
            }
            console.log(`File ${file} moved to ${folderName} folder.`);
          });
        }
      });
    });
  });
}


// getting all video data 

router.get("/getVideosData", async (req, res) => {
  let videos = await videoModel.find({});

  if (videos.length >= 0) {
    return res.json(videos)
  }
  else {
    return res.json({
      success: 1,
      msg: "There Is No Videos"
    })
  }
})

// api for getting all video data according to user id

router.get("/getAllVideoData", async (req, res) => {
  let videos = await videoModel.find({});
  let users = await userModel.find({})
  let fullVideoData = [];
  if (videos.length != 0) {

    for (let i = 0; i < videos.length; i++) {
      const element = videos[i];
      // console.log("Element : ",element)
      let user = await userModel.findOne({ id: element.uploadBy })
      // console.log("User : ",userModel.find({id:element.uploadBy}))
      // console.log("Upload By : ", element.uploadBy, user.id)

      fullVideoData.push({
        id: element.id,
        title: element.title,
        description: element.description,
        thumbinal: element.thumbinal,
        video: element.video,
        views: element.views,
        likes: element.likes,
        dislikes: element.dislikes,
        comments: element.comments,
        username: user.username,
        subscribers: user.subscribers,
        channelName: user.channelName,
        channelPic: user.profilePic
      });

    }

    // console.log(fullVideoData)

    if (fullVideoData.length >= 0) {
      return res.json(fullVideoData)
    }
    else {
      return res.json({
        fale: 1,
        msg: "No Videos Found"
      })
    }
  }
  else {
    return res.json({
      fale: 1,
      msg: "No Videos Found"
    })
  }
})


// getting profile page data

router.post("/getProfileData", async (req, res) => {
  let videos = await videoModel.find({ uploadBy: req.body.userId });
  let users = await userModel.find({})

  let user = await userModel.findOne({ id: req.body.userId })

  console.log(user.username)
  let fullProfileData = [];

  if (videos.length != 0) {
    for (let i = 0; i < videos.length; i++) {
      const element = videos[i];
      fullProfileData.push({
        id: element.id,
        title: element.title,
        description: element.description,
        thumbinal: element.thumbinal,
        video: element.video,
        views: element.views,
        username: user.username,
        subscribers: user.subscribers,
        channelName: user.channelName,
        profilePic: user.profilePic,
        bannerPic: user.bannerPic,
        uploadOn: element.date,
        isVideos:true
      });
    }

    return res.json(fullProfileData)
  }
  else {
    return res.json([{
      fale: 1,
      msg: "You Have No videos Upload Videos To show.",
      username:user.username,
      subscribers: user.subscribers,
      channelName: user.channelName,
      profilePic: user.profilePic,
      bannerPic: user.bannerPic,
      isVideos:false
    }])
  }

})

// custamize Channel


router.post("/custamizeChannel", async (req, res) => {
  if (req.body.mode == "chName") {
    let channel = await userModel.updateOne({ id: req.body.userId, username: req.body.userName, email: req.body.userEmail }, { channelName: req.body.channelName });
    if (channel != 0) {
      return res.json({
        success: 1
      })
    }
    else {
      return res.json({
        fale: 1,
        msg: "No User Information Found !"
      })
    }
  }
})


// banner Multer storage configuration
const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/userChannelUpload/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const userUpload = multer({ 
  storage: userStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
}); 

router.post("/addBannerPic", userUpload.single('bannerPic'), async (req, res) => {
  try {
    // Multer adds a file object to the request (req.file)
    const bannerPic = req.file;
    if (!bannerPic) {
      return res.status(400).send('No file uploaded.');
    }

    let prevProfilePicUser = await userModel.findOne({id:req.body.userId,email:req.body.email,username:req.body.username});

    console.log("PRev USER : ", prevProfilePicUser)
    if (prevProfilePicUser.bannerPic !== "" && prevProfilePicUser.bannerPic) {
      console.log("Entring A If Con")

      const filePath = path.join(__dirname, '../uploads/userChannelUpload/', prevProfilePicUser.bannerPic);
      console.log("PAth : ", filePath)
  
      fs.unlink(filePath, async (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return;
        }
        let user = await userModel.updateOne({ id:req.body.userId,email:req.body.email,username:req.body.username }, { bannerPic: req.file.filename });
        console.log('File deleted successfully');
      });
  
    }
    else {
      console.log("Entring A else Con")
  
      let user = await userModel.updateOne({ id:req.body.userId,email:req.body.email,username:req.body.username }, { bannerPic: req.file.filename });
  
      if (user) {
        console.log(user)
        return res.send('File uploaded successfully.');
      }
      else {
        return res.json({
          fale: 1,
          msg: "No User Found !"
        });
      }
    }

    return res.send('File uploaded successfully!');

  } catch (error) {
    console.error('Error uploading file: ', error);
    return res.status(500).send(error);
  }
});


// Multer configuration
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/userChannelUpload/profilePics/'); // Directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Unique filename
  }
});
const profileUpload = multer({ storage: profileStorage });


router.post("/uploadProfilePic", profileUpload.single('image'), async (req, res) => {
  console.log("hitting...")
  
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }


  let prevProfilePicUser = await userModel.findOne({ id: req.body.userId, username: req.body.username, email: req.body.email });

  console.log("PRev USER : ", prevProfilePicUser)

  if (prevProfilePicUser.profilePic !== "" && prevProfilePicUser.profilePic) {
    console.log("Entring A If Con")
    const filePath = path.join(__dirname, '../uploads/userChannelUpload/profilePics/', prevProfilePicUser.profilePic);
    console.log("PAth : ", filePath)

    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return;
      }
      let user = await userModel.updateOne({ id: req.body.userId, username: req.body.username, email: req.body.email }, { profilePic: req.file.filename });
      console.log('File deleted successfully');
      
      return res.json({
        success:1,
        msg:'Pic Updated Successfully.'
      });

    });

  }
  else {
    console.log("Entring A else Con")
    let user = await userModel.updateOne({ id: req.body.userId, username: req.body.username, email: req.body.email }, { profilePic: req.file.filename });

    if (user) {
      console.log(user)
      return res.json({
        success:1,
        msg:'Pic Uploaded Successfully.'
      });
    }
    else {
      return res.json({
        fale: 1,
        msg: "No User Found !"
      });
    }
  }
})


// const JWT_SECRET = 'mahdiJWT@male_PWD_secret';
// router.post("/signUpUser", async (req, res) => {
//   let emailCon = await userModel.find({ email: req.body.email });
//   let numberCon = await userModel.find({ number: req.body.number });
//   console.log(emailCon.length, numberCon.length)
//   if (emailCon.length != 0) {
//     return res.json({
//       fale: 1,
//       msg: "Email Is Already Registered !"
//     })
//   }
//   if (numberCon.length != 0) {
//     return res.json({
//       fale: 1,
//       msg: "Number Is Already Registered !"
//     })
//   }
//   else {
//     let users = await userModel.find({});
//     let id;
//     if (users.length > 0) {
//       let last_user_array = users.slice(-1);
//       let last_user = last_user_array[0];
//       id = last_user.id + 1;
//     }
//     else {
//       id = 1
//     }

//     const salt = await bcrypt.genSalt(10);
//     const secPassword = await bcrypt.hash(req.body.password, salt);

//     let regesteredUser = await userModel.create({
//       id: id,
//       username: req.body.username,
//       email: req.body.email,
//       password: secPassword,
//       number: req.body.number,
//     })

//     const jwt_data = {
//       user:{
//         id:regesteredUser.id
//       }
//     };
//     const authToken = jwt.sign(jwt_data,JWT_SECRET);


//     // console.log(regesteredUser);
//     // res.json(regesteredUser)
//     res.json({
//       YourToken:authToken
//     })
//   }
// })


module.exports = router;
