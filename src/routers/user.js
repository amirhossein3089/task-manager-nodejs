const express = require("express");
const User = require("../models/user");
const auth = require('../middleware/auth')
const router = new express.Router();
const multer = require('multer')
const sharp = require('sharp')


router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken()
    res.status(201).send({user,token});
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login",async (req,res) =>{
  try {
    const user = await User.findByCredentials(req.body.email,req.body.password)
    const token = await user.generateAuthToken()
    res.send({user,token})
  } catch (error) {
     res.status(400).send()
  }
})

router.post("/users/logout",auth,async (req,res)=>{
  try {
    req.user.tokens = req.user.tokens.filter(token=>{
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch (e) {
    res.send(500)
  }
})

router.post("/users/logoutAll",auth,async (req,res)=>{
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    
  }
})

router.get("/users/me",auth, async (req, res) => {
  res.send(req.user)
});

router.patch("/users/me",auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdate = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(update =>
    allowedUpdate.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid updates" });
  }
  try {
    const user = req.user;
    updates.forEach(update => (user[update] = req.body[update]));
    await user.save();

    res.send(user);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete("/users/me",auth, async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

const upload = multer({
  limits:{
    fileSize:1000000,
  },
  fileFilter(req,file,cb){
    // \.(doc|docx)$
    // if(!file.originalname.endsWith('.pdf')){
      if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      return cb(new Error('please upload an image'))
    }
    cb(undefined,true)
  }
})
router.post("/users/me/avatar", auth, upload.single('avatar'),async (req,res)=>{
  try {
    debugger
   const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send('')
  }
},(error,req,res,next)=>{
  res.status(400).send({error:error.message})
})

router.delete("/users/me/avatar",auth,async (req,res)=>{
  try {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(400).send()
  }
})

router.get('/users/:id/avatar',async (req,res)=>{
  try {
    const user = await User.findById(req.params.id)
    if(!user || !user.avatar){
      throw new Error()
    }

    res.set('Content-Type','image/png')
    res.send(user.avatar)
  } catch (error) {
    res.status(404).send()
  }
})

module.exports = router;
