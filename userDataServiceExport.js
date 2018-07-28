/*service to retreive and update the userData array information from an online database.*/

const fs = require('fs');

const mongoose = require('mongoose');

	//enviromental string used to save the connnection to the database during testing
	var uristring =process.env.MONGODB_URI;
	
	//creates a schema that is use to form a database
	const playerSchema = new mongoose.Schema({
		  name: 		String,
		  startWeight:	Number,
		  weightLoss: 	Number,
		  lastUpdate:	Date,
		  winner:		Boolean	
	});

	//need to avoid a error
	const dbOption = {useNewUrlParser:true};

	//Model based off of the schema. The last parameter links the model to the collection in the online database. If not using this, the connection would assum a plurl tense of the first parameter. Example is players.
	var Player = mongoose.model('Player', playerSchema, 'userData');

	//creates a connetion to the online database based on the string. You need the option to avoid a error.
	mongoose.connect(uristring, dbOption, function(error){
	  if(error)
		  console.error(error);
	  else{
		  console.log("mongo connected in userDataExport");
		  
		  //This function runs if the connection is good. It gets/find all documents in the database, organize them in a way useable in the app, then return into a variable's array call playersInfo.
		  getData();
	  }
	});	

	//variable array use to hold documents from database in a format the app can use. It get the data from the createUserData() inside the getData() 
	let playersInfo = [];

	//Using the Player schema to find all documents in the online database. If this connects, it organizes the data (result) into a useable format with the createUserData() and return it into the array playersInfo.
	var getData = function(){
	  Player.find({}, function(err, result){
		  if(err)
			  console.log(err);
		  else
			  playersInfo = createUserData(result);

	  });
	}//end of getData function
	
	//returns the array of pre-formated data	
    var players = function(){	
	  return playersInfo;
		
    }//end of players function
	
	//Organize data from the getData() into a useable format. Each document is arrange into a object then return into the newArray array. This is returned into the playersInfo array in the getData();
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
		
		//object use to find the document matching the player name
		var updatedPlayer = {name:x.name};
		
		//object use to show what changes to be updated to the matched document
		var changesMadeToPlayer = {weightLoss:x.weightLoss, lastUpdate:x.lastUpdate, winnder: x.winner};
		
		//mongoose method to update a document based on updatedPlayer with the changesMadeToPlayer. 
		Player.updateOne(updatedPlayer, changesMadeToPlayer, function(err, res){
			
		});
    }
    
    module.exports.players = players;
    module.exports.updateUserData = updateUserData;
