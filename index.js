const express = require('express');
const app = express();
const fs = require('fs');

//loads .env variables to be use as process.env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
const mongodb = require('mongodb');

//send the entire Monster folder to the client
app.use(express.static(__dirname + '/Monster'));

//configure express to use bodyparser as a middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
                     
//
var cred = require('./credExport');
var newArray = require('./newArrayServiceExport');

app.post('/cred', function(req, res){
    
    //get the username and password sent from the client
    var userName = req.body.name;
    var pwd = req.body.password;
    
    //Create an object (info) to send back to the client. Check if the username and password is authentic. If so, a true or false is sent back as the success attribute of the info object
    var info = {};
    info.success = cred.logIn(userName, pwd);
    
    if(info.success===true)
        {
            info.newArray = newArray.weightLessArray(userName);
        }
    
    //send the info object to the client
    res.send(info);    
    res.end();
});

var updateUser = require('./updateUserDataExport');
app.post('/weighIn', function (req, res){
console.log("weighIn is being called");    
    //get the username and new weight
    var userName = req.body.name;
    var weight = req.body.weight;
    var info = {};
 
    info.weightLoss = updateUser.updateUser(weight, userName);
    info.newArray = newArray.weightLessArray(userName);
    res.send(info);
})
//app.listen(3000);
//got tip regarding error from: https://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of
app.listen(process.env.PORT || 5000);