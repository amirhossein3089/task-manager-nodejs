const express = require("express");
const Task = require("../models/task");
const auth = require('../middleware/auth')

const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner:req.user._id
  })
  try {
    
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=0
//GET /tasks?sortBy=createdAt:desc 
router.get("/tasks", auth, async (req, res) => {
  const match ={} 
  const sort={}
  if(req.query.completed){
    //nice way to convert req.query.completed which is string into a boolean
    match.completed = req.query.completed === 'true'
  }

  if(req.query.sortBy){
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1]==='desc' ? -1 : 1
  }
  try {
    await req.user.populate({
      path:'tasks',
      match,
      options:{
        limit:parseInt(req.query.limit),
        skip:parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    res.status(200).send(req.user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/tasks/:id",auth, async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findOne({_id,owner:req.user._id})
    if (!task) {
      res.status(404).send();
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch("/tasks/:id",auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["description", "completed"];
  const isValidOperation = updates.every(update =>
    allowUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid updates" });
  }
  try {
    const task = await Task.findById({_id:req.params.id,owner:req.user._id})
    if (!task) {
      return res.status(404).send();
    }

    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/tasks/:id",auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id});
    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
