
// Store the objects for each of the two players
var player1 = null;
var player2 = null;
var player1 = false;
var player2 = false;
var player1Choice="";
var player2Choice="";
var player1win=0;
var player2win=0;
var player1lose=0;
var player2lose=0;
var player1tie=0;
var player2tie=0;

// Store the player names
var player1Name = "";
var player2Name = "";
var PlayerName = "";
// Initialize Firebase
var config = {
  apiKey: "AIzaSyA1wiSvbpBDJ9hLLB_MNFmq47_YOw1e8nQ",
  authDomain: "rps-multiplyer.firebaseapp.com",
  databaseURL: "https://rps-multiplyer.firebaseio.com",
  projectId: "rps-multiplyer",
  storageBucket: "rps-multiplyer.appspot.com",
  messagingSenderId: "384134906240"
};
firebase.initializeApp(config);


var database = firebase.database();

//database listener for player 1 
database.ref("/players/").on("value", function (snap) {

  if (snap.child("player1").exists())
  {
    player1 = snap.val().player1;
    player1Name = player1.name;
    $("#player1-name").text(player1Name);
    $("#player1-status").text("wins= "+player1.win + " loses= "+ player1.loss +" ties= "+player1.tie);
    console.log("player1 exist")
    console.log( player1.name)
    
  }
  else 
  {
    player1 = null;
    player1Name = "";
    $("#player1-name").text("waiting for player1")
    $("#player1-status").text("");
    console.log("player1 not exist")
    database.ref("/result/").remove();
    // database.ref().child("/players/player2/win").set(0);
    // database.ref().child("/players/player2/loss").set(0);
    // database.ref().child("/players/player2/tie").set(0);

  }





  //database listener for player 2

  if (snap.child("player2").exists()) {
    player2 = snap.val().player2;
    player2Name = snap.val().player2.name;
    $("#player2-name").text(player2Name); 
    $("#player2-status").text("wins= "+player2.win + " loses= "+ player2.loss +" ties= "+player2.tie);
    $("#status").text("")
    console.log("player2 exist")
  }
  else {
    player2 = null;
    player2Name = "";
    console.log("player2 not exist")
    $("#player2-name").text("waiting for player2"); 
    $("#player2-status").text("");
    database.ref("/result/").remove();
    // database.ref().child("/players/player1/win").set(0);
    // database.ref().child("/players/player1/loss").set(0);
    // database.ref().child("/players/player1/tie").set(0);
  }

 // If both players are now present, it's player1's turn
  if (player1!=null && player2!=null) {
 

 
 console.log("player1 turn")

  // Update the center display
  $("#status").html("Waiting on " + player1Name + " to choose...");

  }

})


// Attach a listener to the database /turn/ node to listen for any changes
database.ref("/turn/").on("value", function(snapshot) {
	// Check if it's player1's turn
	if (snapshot.val() === 1) {
		console.log("TURN 1");
		turn = 1;

		// Update the display if both players are in the game
		if (player1 && player2) {
     
		
			$("#status").html("Waiting on " + player1Name + " to choose...");
		}
	} else if (snapshot.val() === 2) {
		console.log("TURN 2");
		turn = 2;

		// Update the display if both players are in the game
		if (player1 && player2) {
		 
		
			$("#status").html("Waiting on " + player2Name + " to choose...");
		}
	}
});

database.ref("/result").on("value",function(snap)
{
  $("#status").html("result:  " + snap.val() );
  // bootbox.alert(snap.val())

})

database.ref("/chat/").on("child_added", function(snapshot) {
	var chatMsg = snapshot.val();
	var chatEntry = $("<div>").html(chatMsg);

	// // Change the color of the chat message depending on user or connect/disconnect event
	// if (chatMsg.includes("disconnected")) {
	// 	chatEntry.addClass("chatColorDisconnected");
	// } else if (chatMsg.includes("joined")) {
	// 	chatEntry.addClass("chatColorJoined");
	// } else if (chatMsg.startsWith(yourPlayerName)) {
	// 	chatEntry.addClass("chatColor1");
	// } else {
	// 	chatEntry.addClass("chatColor2");
	// }

	$("#chat").append(chatEntry);

});



function chooseScissor1()
{
    choice="Scissors";
    player1Choice=choice;
 
    
    addToDatabase1(choice)
		
	

}
function chooseRock1()
{
 player1Choice="Rock";
 choice="Rock";


 addToDatabase1(choice)

}
function choosePaper1()
{
 player1Choice="Paper";
 choice="Paper";
 
 addToDatabase1(choice)

}

function addToDatabase1(choice)
{  
   bootbox.alert("you choose "+choice)
    database.ref().child("/players/player1/choice").set(choice);   
    
    // Set the turn value to 2, as it is now player2's turn
	  turn = 2;
    database.ref().child("/turn").set(2);
    // $("#choices2").removeClass("d-non");
    // $("#choices2").addClass("d-block");
   console.log("player2 turn")
  
    // Update the center display
    $("#status").html("Waiting on " + player2Name + " to choose...");

}


function chooseScissor2()
{
    choice="Scissors";
    player2Choice=choice;
 
    
    addToDatabase2(choice)
		
	

}
function chooseRock2()
{
 player2Choice="Rock";
 choice="Rock";


 addToDatabase2(choice)

}
function choosePaper2()
{

 choice="Paper";
 player2Choice=choice;
 addToDatabase2(choice)

}

function addToDatabase2(choice)
{  
  bootbox.alert("you choose "+choice)
    database.ref().child("/players/player2/choice").set(choice);
  
  
    getResult()
}

function getResult(){
 
    if (player1.choice === "Rock") {
      if (player2.choice === "Rock") {
        // Tie
        console.log("tie");
  
        database.ref().child("/result/").set("Tie game!");
        database.ref().child("/players/player1/tie").set(player1.tie + 1);
        database.ref().child("/players/player2/tie").set(player2.tie + 1);
      } 
      else if (player2.choice === "Paper") {
        // Player2 wins
        console.log("paper wins");
  
        database.ref().child("/result/").set("Paper wins!");
        database.ref().child("/players/player1/loss").set(player1.loss + 1);
        database.ref().child("/players/player2/win").set(player2.win + 1);
      } 
      else { // scissors
        // Player1 wins
        console.log("rock wins");
  
        database.ref().child("/result/").set("Rock wins!");
        database.ref().child("/players/player1/win").set(player1.win + 1);
        database.ref().child("/players/player2/loss").set(player2.loss + 1);
      }
  
    } 
    else if (player1.choice === "Paper") {
      if (player2.choice === "Rock") {
        // Player1 wins
        console.log("paper wins");
  
        database.ref().child("/result/").set("Paper wins!");
        database.ref().child("/players/player1/win").set(player1.win + 1);
        database.ref().child("/players/player2/loss").set(player2.loss + 1);
      } else if (player2.choice === "Paper") {
        // Tie
        console.log("tie");
  
        database.ref().child("/result/").set("Tie game!");
        database.ref().child("/players/player1/tie").set(player1.tie + 1);
        database.ref().child("/players/player2/tie").set(player2.tie + 1);
      } else { // Scissors
        // Player2 wins
        console.log("scissors win");
  
        database.ref().child("/result/").set("Scissors win!");
        database.ref().child("/players/player1/loss").set(player1.loss + 1);
        database.ref().child("/players/player2/win").set(player2.win + 1);
      }
  
    } else if (player1.choice === "Scissors") {
      if (player2.choice === "Rock") {
        // Player2 wins
        console.log("rock wins");
  
        database.ref().child("/result/").set("Rock wins!");
        database.ref().child("/players/player1/loss").set(player1.loss + 1);
        database.ref().child("/players/player2/win").set(player2.win + 1);
      } else if (player2.choice === "Paper") {
        // Player1 wins
        console.log("scissors win");
  
        database.ref().child("/outcome/").set("Scissors win!");
        database.ref().child("/players/player1/win").set(player1.win + 1);
        database.ref().child("/players/player2/loss").set(player2.loss + 1);
      } else {
        // Tie
        console.log("tie");
  
        database.ref().child("/outcome/").set("Tie game!");
        database.ref().child("/players/player1/tie").set(player1.tie + 1);
        database.ref().child("/players/player2/tie").set(player2.tie + 1);
      }
  
    }
  
    // Set the turn value to 1, as it is now player1's turn
    turn = 1;
    database.ref().child("/turn").set(1);
  }







$("#startBtn").on("click", function (event) {
  event.preventDefault();
  var name = $("#name1-input").val().trim();
  $("#name1-input").val('')
  // if player 1 not exists
  if (player1 === null) {
    //save palyer 1 
    console.log("player1 reg")
    player1Name = name;
    bootbox.alert("welcome "+name);
   
    $("#player1-name").text(name); 
     $("#status").html("wating for player 2")
    //save player Name for the broweser 
    playerName=name;
    //save palyer1 
    player1 = {
      name: name, 
      choice: "",
      win: 0,
      loss: 0,
      tie: 0
    
    };
    //push player 1 to database
    console.log(player1);
 
    database.ref().child("/players/player1").set(player1);
   
    database.ref("turn").set(1);
    database.ref("/players/player1").onDisconnect().remove();
    database.ref("turn").onDisconnect().remove();
    database.ref("result").onDisconnect().remove();

  }

 else if (player1 != null && player2 === null) {
    console.log("player2 reg")

      player2Name = name;
      playerName = name;
      player2 =
       {
            name: name, 
            choice: "",
            win: 0,
            loss: 0,
            tie: 0
           
       };
       bootbox.alert("welcome "+name);
   
       $("#player2-name").html(name); 
        $("#status").text("")
       console.log(player2);
       database.ref("/players/player2").set(player2);
       database.ref("/players/player2").onDisconnect().remove();
       database.ref("turn").onDisconnect().remove();
       database.ref("result").onDisconnect().remove();
  }

 else if (player1 != null && player2 != null) {
    console.log("wait")
   
  }



})


$("#sendBtn").on("click", function (event) {

	event.preventDefault();
console.log($("#message").val().trim())
console.log(playerName)
	// First, make sure that the player exists and the message box is non-empty
	if ( (playerName!="") && ($("#message").val().trim() !== "") ) {
		// Grab the message from the input box and subsequently reset the input box
		var msg = playerName + ": " + $("#message").val().trim();
		$("#message").val("");

		// Get a key for the new chat entry
		var chatKey = database.ref().child("/chat/").push().key;

		// Save the new chat entry
		database.ref("/chat/" + chatKey).set(msg);
	}





  // event.preventDefault();

  // var message = $("#message").val().trim();
  // database.ref(/chat/).set({
  //   name: playerName,
  //   message: message
  // })
 
  // console.log(playerName);
  // database.ref(/chat/).on("child_added", function (snapshot) {
  //   var messages = snapshot.val();

  //   fillChat(messages.name, messages.message)

  // })

})

// function fillChat(name, message) {
//   $("#chat").text("hi")
//   console.log(name)
//   console.log(message)
//   var nameP = $("<p>").text(name);
//   var messageP = $("<p>").text(message);
//   var chatDiv = $("<div>").append([nameP, messageP]);
//   $("#chat").append(chatDiv)
// }

