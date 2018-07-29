/* A service placed the shared resource userData array into the newArray variable without the players weight and only the current user percent weight loss. Several services is called to get shared resources userData array, current user name, today's date, and the minutes of a day. */


    var userInfo = require('./userDataServiceExport');
    var Time = require('./timeExport');

    //var userData = userInfo.players();
    var newArray = [];
    var UpdateDate = Time.todayDate();
    var oneDay = Time.minutesInADay();
    
    var weightLessArray = function(userName){
		/*get the players data from the database*/
		var userData = userInfo.players();
        /*get the current user name at the time the method is called*/
        var currentUser = userName;
		
		var group = userData.filter(function(x){
			if(x.name == currentUser)
				return x.groupID;
		});
		
		var playerGroupID = group[0].groupID;
		
		var groupArray = userData.filter(function (x){
			return x.groupID === playerGroupID;
		})
		
        /*loops throught the userData array*/
        for(var j=0; j<groupArray.length;j++){
		  
            //create a new date object
            var lastUpdate = new Date(groupArray[j].lastUpdate);
			
            /*gets the last day since update number for each user*/
            var daysSinceLastUpdate = Math.round(Math.abs((UpdateDate.getTime() - lastUpdate.getTime())/(oneDay))); 

            /*newArray variable is populated with each user array element plus percent loss and except the weight*/
            newArray[j]= {"name":groupArray[j].name, "weightLoss":groupArray[j].weightLoss, "lastUpdate": daysSinceLastUpdate, "winner":groupArray[j].winner};

            /*search the userData array for the element containg the currentUser*/
            if(currentUser==groupArray[j].name){  /*checks each element for a match */
				
                /*divides current userData array elment weightloss by the startWeight to get percentage lost*/
                var currentPercentLoss = groupArray[j].weightLoss / groupArray[j].startWeight;

                /*Gives only the currentUser the percentLoss variable*/
                newArray[j].percentLoss = currentPercentLoss;                
                }
		  	  
            }/*end of j-loop*/
            return newArray;    
    }/* end of getWeightLoss function*/  

    module.exports.weightLessArray = weightLessArray;

