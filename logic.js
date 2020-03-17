// Global Variables
var trainName = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = "";
var nextArrival = "";
var minutesAway = "";

// jQuery global variables
var elTrain = $("#train-name");
var elTrainDestination = $("#train-destination");

var elTrainTime = $("#train-time");
var elTimeFreq = $("#time-freq");


// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyDa8baBE0WRmv2fqVX3EJb9QJwIwBMWmMA",
    authDomain: "hm-boot-ts.firebaseapp.com",
    databaseURL: "https://hm-boot-ts.firebaseio.com",
    projectId: "hm-boot-ts",
    storageBucket: "hm-boot-ts.appspot.com",
    messagingSenderId: "786628244975",
    appId: "1:786628244975:web:d0cdfa2f6dac1b02c8b21a"
  };


firebase.initializeApp(firebaseConfig);

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

database.ref().on("child_added" , function(snapshot)  {

    if (!snapshot.exists()) return;
    console.log(snapshot.val());
    //  create local variables to store the data from firebase
    var trainDiff = 0;
    var trainRemainder = 0;
    var minutesTillArrival = "";
    var nextTrainTime = "";
    var frequency = snapshot.val().frequency;

    // compute the difference in time from 'now' and the first train using UNIX timestamp, store in var and convert to minutes
    trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");

    // get the remainder of time by using 'moderator' with the frequency & time difference, store in var
    trainRemainder = trainDiff % frequency;

    // subtract the remainder from the frequency, store in var
    minutesTillArrival = frequency - trainRemainder;

    // add minutesTillArrival to now, to find next train & convert to standard time format
    nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");

    // append to our table of trains, inside tbody, with a new row of the train data
    $("#table-data").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesTillArrival + "</td>" +
        "<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
    );

    $("span").hide();

    // Hover view of delete button
    $("tr").hover(
        function() {
            $(this).find("span").show();
        },
        function() {
            $(this).find("span").hide();
        });

   
});

// function to call the button event, and store the values in the input form
var storeInputs = function(event) {
    // prevent from from resetting
    event.preventDefault();
    
    // get & store input values
    trainName = elTrain.val().trim();
    trainDestination = elTrainDestination.val().trim();
    trainTime = moment(elTrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = elTimeFreq.val().trim();

    // add to firebase database
    database.ref().push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    //  alert that train was added
    alert("Train successfully added!");

    //  empty form once submitted
    elTrain.val("");
    elTrainDestination.val("");
    elTrainTime.val("");
    elTimeFreq.val("");
};
$("#btn-add").on("click", storeInputs)