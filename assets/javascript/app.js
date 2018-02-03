$(document).ready(function(){

// to set up firebase
var config = {
    apiKey: "AIzaSyAlDKRCDljJVYBQHoGK2DsyV2HH0pucebQ",
    authDomain: "trainscheduler-d28e6.firebaseapp.com",
    databaseURL: "https://trainscheduler-d28e6.firebaseio.com",
    projectId: "trainscheduler-d28e6",
    storageBucket: "",
    messagingSenderId: "802242933563"
  };
  firebase.initializeApp(config);
  var database = firebase.database();


  	// submit button click function
	$("#submit").on("click", function(){

		// to prevent refreshing
		event.preventDefault();

		// variables for the user input
		var trainName = $("#trainName").val().trim();
		var lineName = $("#line").val().trim();
		var destination = $("#destination").val().trim();
		var trainTimeInput = moment($("#trainTime").val().trim(), "HH:mm").subtract(10, "years").format("X");;
		var frequencyInput = $("#frequency").val().trim();

		
		console.log(trainName);
		console.log(lineName);
		console.log(destination);
		console.log(trainTimeInput);
		console.log(frequencyInput);

		// object to hold variables that will be pushed to firebase
		var newTrain = {
			name:  trainName,
			line: lineName,
			destination: destination,
			trainTime: trainTimeInput,
			frequency: frequencyInput,
		}

		// pushing to Firebase
		database.ref().push(newTrain);

		// clearing out the boxes
		$("#trainName").val("");
		$("#line").val("");
		$("#destination").val("");
		$("#train").val("");
		$("#frequency").val("");
	});

	database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(childSnapshot, prevChildKey){

		console.log(childSnapshot.val());

		
		var firebaseName = childSnapshot.val().name;
		var firebaseLine = childSnapshot.val().line;
		var firebaseDestination = childSnapshot.val().destination;
		var firebaseTrainTimeInput = childSnapshot.val().trainTime;
		var firebaseFrequency = childSnapshot.val().frequency;
		
		var diffTime = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes");
		var timeRemainder = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes") % firebaseFrequency ;
		var minutes = firebaseFrequency - timeRemainder;

		var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A"); 
		
		
		console.log(minutes);
		console.log(nextTrainArrival);
		console.log(moment().format("hh:mm A"));
		console.log(nextTrainArrival);
		console.log(moment().format("X"));

		// Append train info into the table at the right spots
		$("#trainTable > tbody").append("<tr><td>" + firebaseName + "</td><td>" + firebaseLine + "</td><td>"+ firebaseDestination + "</td><td>" + firebaseFrequency + " mins" + "</td><td>" + nextTrainArrival + "</td><td>" + minutes + "</td></tr>");

	});
});
