/*service to retreive and update the userData array information.*/

const fs = require('fs');
const userDataPath =  __dirname +'/userData.json';
var userDataInfo = fs.readFileSync(userDataPath);
var userData = JSON.parse(userDataInfo);

const mongoose = require('mongoose');
//test with mongodb://example:example@ds053312.mongolab.com:53312/todolist
//var uristring = process.env.MONGODB_URI;

	var uristring =process.env.DEV_DATABASE_CONNECTION;

	const playerSchema = new mongoose.Schema({
		  name: 		String,
		  startWeight:	Number,
		  weightLoss: 	Number,
		  lastUpdate:	Date,
		  winner:		Boolean	
	});

	const dbOption = {useNewUrlParser:true};

	var Player = mongoose.model('Player', playerSchema, 'userData');

	  mongoose.connect(uristring, dbOption, function(error){
		  /*
		  if(error) console.error(error);
		  else console.log("mongo connected");
		  */
		  if(error)
			  console.error(error);
		  else{
			  console.log("mongo connected");
			  getData();
		  }
	  });	

	let playersInfo = [];

	var getData = function(){
	  Player.find({}, function(err, result){
		  if(err)
			  console.log(err);
		  else
			  playersInfo = createUserData(result);

	  });
	}

    var players = function(){	
	  return playersInfo;
		
    }//end of players function
	
	var createUserData = function(data){
		var newArray = [];
		data.forEach(function (user, index){
			var newUser = {};
			
			newUser.name = user.name;
			newUser.startWeight = user.startWeight;
			newUser.weightLoss = user.weightLoss;
			newUser.lastUpdate = user.lastUpdate;
			newUser.winner = user.winner;
			
			newArray[index]= newUser;
		});
		return newArray;
	}
    
    /*method to update the userData array*/
    var updateUserData = function(x){
        //transform the userData json into a string
        newUserData = JSON.stringify(x);
console.log(newUserData);
		
		Player.findOne({"name":newUserData.name}, function(err, result){
			if (err)
				console.log(err);
			else {
				Player.save(function (err, Player){
					if (err)
						console.log(err);
					else
						console.log("saved");
				});
			}
		});
            
        //writes the new string object to the userData.json
        fs.writeFileSync(userDataPath, newUserData, 'utf8'); 
    }
    /*method to push a new user into userData array*/
    var addUser = function(x){
        /*pushes the new player object into the userData database*/
        userData.push(x);        
    }
    
    module.exports.players = players;
    module.exports.updateUserData = updateUserData;
    module.exports.addUser = addUser;
