const express = require('express');
const router = express.Router();
const userDb = require('./userDb');
const postDb = require('../posts/postDb')


router.post('/', validateUser, (req, res) => {
  // do your magic!
  userDb.insert(req.body)
  .then(newUser=> {
      res.status(201).json(newUser)
  })
  .catch( err => {
    console.log(err)
    res.status(500).json({message: "Error adding new user, please make sure your name is uniqe and not taken already."})
  })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
    const postInfo = {...req.body, user_id: req.params.id}
    
    postDb.insert(postInfo)
    .then(post => {
      console.log(post)
      res.status(200).json({message: ".then was hit in /:id/post"})
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({message: "Error"})
    })

});

//easiest - GET users
router.get('/', (req, res) => {
  // do your magic!
  userDb.get(req.query)
  .then(users => {
    res.json(users)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({message: 'the catch was caught in the get req for users'})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id
  // console.log(req.user)
  const userInfo = req.user
  res.json(userInfo)
//   userDb.getById(id)
//   .then(uID => {
//     if (uID) {
//       res.status(200).json(uID)
//     } else {
//       res.status(404).json({message: "User not found"})
//     }
//   })
//   .catch( err =>{
//     console.log(err)
//     res.status(500).json({ 
//       message: 'server error in retrieving the user'
//     })
//   })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id
  userDb.getUserPosts(id)
  .then(post => {
    console.log(post)
    res.status(200).json(post)
  })
  .catch( err => {
    console.log(err)
    res.status(500).json({
      message: "Error getting post from server"
    })
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  userDb.remove(req.params.id)
  .then( numberOfObjectsDeleted =>{
    console.log(numberOfObjectsDeleted)
    if (numberOfObjectsDeleted > 0) {
      res.status(200).json({message: "The post has been DEEEELETED"})
    } else {
      res.status(404).json({message: "The post could not be located"})
    }

  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      message: 'Error removing from server',
    });
  })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  // do your magic!
  const userInfo = req.user
  userDb.update(userInfo.id, req.body)
  .then(updatedNumberOfObjects => {
    // console.log("success in the .then",post) //post is just the number of returned objects updated
    res.status(200).json(updatedNumberOfObjects)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({message: "Name value cannot be the same as an existing name"})
  })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  userDb.getById(req.params.id)
  .then(userID => { //userID is just the info object of the user (too lazy to rename)
      if (!userID) {
        res.status(404).json({message: "The user with the specified ID does not exist"})
      } else {
        console.log(userID)
         req.user = userID
          next()
      }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      message: "The user information could not be retrieved"
    })
  })
}

function validateUser(req, res, next) {
  // do your magic!if 
  console.log(Object.keys(req.body)) // req.body is an empty object when the user doesnt input anything
  // so we use an array method (.length) after we convert the object into an array of keys with no value pair
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({errMessage: "missing user data"})
  }
 else if (!req.body.name) {
  res.status(400).json({errMessage: "missing required name field, please add a name key and value for it"})
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  // do your magic!
 if (Object.keys(req.body).length === 0) {
  res.status(400).json({errMessage: "missing post data"})
 } else if (!req.body.text) {
  res.status(400).json({errMessage: "missing required text field, please add a text key and value for it"})
 } else {
   next()
 }

}

module.exports = router;
