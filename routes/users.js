var express = require('express');
var router = express.Router();
var axios = require('axios')
var User = require('../model/User')

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login',(req,res)=>{
  var username = req.body.username;
  var password = req.body.password;
  User.find({username:username,password:password},(err,user)=>{
    if(user.length==0){
      res.sendStatus(404).send("Not Found")
    }
    console.log(user)
    res.cookie('token',makeid(16))
    res.cookie('username',user[0].username)
    res.cookie('githubLogin',false)
    console.log(user[0].type)
    if(user[0].type=="User"){
      res.redirect(`http://localhost:3000/user?username=${username}`)
    }
    else{
      res.redirect('http://localhost:3000/org')
    }
  })  
})

router.post('/signup',(req,res)=>{
  var fullname = req.body.fullname
  var username = req.body.username;
  var password = req.body.password;
  console.log(fullname,username,password)
  user = {
    fullname:fullname,
    username:username,
    password:password,
    type:""
  }
  User.find({username:username},(err,users)=>{
    if(users.length!==0){
      res.send("user already exist");
    }
    else{
      console.log(user)
      axios
      .get(`https://api.github.com/users/${username}`)
      .then(resp => {
        user.type=resp.data.type
        console.log(user)
        var newUser = new User(user)
        newUser.save()
        console.log("saved")
        return user
      })
      .then(user=>{
        console.log(user)
        res.cookie('token',makeid(16))
        res.cookie('username',username)
        res.cookie('githubLogin',false)
        if(user.type=="User"){
          res.redirect(`http://localhost:3000/user?username=${username}`)
        }
        else{
          res.redirect('http://localhost:3000/org')
        }
      })
      .catch(err=>res.json({"error":err}))
    }
  })
})

module.exports = router;
