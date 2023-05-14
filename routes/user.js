const express = require('express');
var user = require('../model/user');
const router = express();

router.post('/createtodo',(req,res)=>{
    let users = {
        todo: "test todo"
    }
    user.create(users).then(function(userdata){
        res.send(userdata)
    })
})

router.get('/test', (req,res)=>{
    res.send("test")
})

module.exports = router;