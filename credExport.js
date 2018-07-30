const fs = require('fs');

// Create a path to the cred.json file into the cred variable. Use the file system provide by node.js to read the cred.json json file into a security variable. The security variable is parse from a string into a json format object and placed in the security variable. 


//const fs = require('fs');
const mongoose = require('mongoose');

//enviromental string used to save the connnection to the database during testing
var uristring =process.env.MONGODB_URI;
	
//creates a schema that is use to form a database
const playerPwds = new mongoose.Schema({
	  name: 		String,
	  password:		Number
});

//need to avoid a error
const dbOption = {useNewUrlParser:true};

//Model based off of the schema. The last parameter links the model to the collection in the online database. If not using this, the connection would assum a plurl tense of the first parameter. Example is players.
var Password = mongoose.model('Password', playerPwds, 'cred');

//creates a connetion to the online database based on the string. You need the option to avoid a error.
mongoose.connect(uristring, dbOption, function(error){
  if(error)
	  console.error(error);
  else{
	  console.log("mongo connected in credExport");
		  
	  //This function runs if the connection is good. It gets/find all documents in the database, organize them in a way useable in the app, then return into a variable's array call playersInfo.
	  getPasswords();
  }
});	

//variable array use to hold documents from cred collection in a format the app can use.  
let playersCreds = [];

//Using the Player schema to find all documents in the online database. If this connects, it organizes the data (result) into a useable format with the createUserData() and return it into the array playersInfo.
var getPasswords = function(){
  Password.find({}, function(err, result){
	  if(err)
		  console.log(err);
	  else
		  playersCreds = createPasswordData(result);

  });
}//end of getPasswords function

//Organize data from the getData() into a useable format. Each document is arrange into a object then return into the newArray array. This is returned into the playersInfo array in the getData();
var createPasswordData = function(data){
	var newArray = [];
	data.forEach(function (user, index){
		var newUser = {};
			
		newUser.name = user.name;
		newUser.password = user.password;
			
		newArray[index]= newUser;
	});
	return newArray;
}

var logIn = function(userName, pwd){
	//return false to login if password or username is fail
    var success = false;
    
    /*This loop searchs the security array. A if statement compare user’s pwd and userName to cred json records. If found to be true, the newArray is return to the controller.*/
    for(var i=0; i<playersCreds.length;i++){
        if(userName==playersCreds[i].name && pwd==playersCreds[i].password){ 
            success = true;           
        }
    } 
    return success;
    
}

module.exports.logIn = logIn;