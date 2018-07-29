$(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyD3Ax76YqmjJii-sZcTpolidVB-VleH58k",
        authDomain: "train-database-eadf6.firebaseapp.com",
        databaseURL: "https://train-database-eadf6.firebaseio.com",
        projectId: "train-database-eadf6",
        storageBucket: "",
        messagingSenderId: "430166995585"
    };

    firebase.initializeApp(config);

    var database = firebase.database();


    var pushToBase = () => {
        //creating objext to send to database
        var newTrain = {
            name: $('.train').val().trim(),
            destination: $('.destination').val().trim(),
            time: $('.time').val().trim(),
            frequency: $('.frequency').val().trim(),
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        };
        //sending to database
        database.ref('new_train').push(newTrain);
        //gotta console log you know
        console.log('Checking new object', newTrain);
        console.log('this is button');
    };

    //reseting input fields(I know the name didn't give that a way)
    var resetFields = () => {
        $('.train, .destination, .time, .frequency').val("");
    };
    //display live time
    function displayTime() {
        var time = moment().format('HH:mm:ss');
        $('.nav-title').html(time);
        setTimeout(displayTime, 1000);
    }



    //click me function and it like tottally calls some things you know
    $('.submit').on('click', function () {
        event.preventDefault();
        pushToBase();
        resetFields();
    });

    database.ref('new_train').on('child_added', function (childSnapshot) {
        console.log('This is CHILD ADDED', childSnapshot.val());

        var trainName = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var freq = childSnapshot.val().frequency
        var firstTrainTime = childSnapshot.val().time

        var newFreq = parseInt(freq)
        // first train time going back in time like Marty McFly to come before the current time
        var firstTimeConverted = moment(firstTrainTime, 'HH:mm').subtract(1, 'years');
        // Difference between times (omg no way!)
        var timeBetween = moment().diff(moment(firstTimeConverted), 'minutes')
        // Dividing the remaining time with the frequency 
        var timeRemainder = timeBetween % newFreq;
        // well well well now here we got to subtract the frequency from the remaining till to get the minutes until next train you know?!
        var minutesTillTrain = newFreq - timeRemainder;
        // Next trains coming down the track choooo choooooo
        var nextTrain = moment().add(minutesTillTrain, 'minutes')
        var displayNext = moment(nextTrain).format('HH:mm A')

        // var removeButton = $('<button>').addClass(`waves-effect waves-light btn`).text('remove')
        // <td>${removeButton}</td>
        $('.body').append(
            `<tr><td>${trainName}</td>
              <td>${destination}</td>
              <td>${freq}</td>
              <td>${displayNext}</td>
              <td>${minutesTillTrain}</td>
              </tr>`
        );

    });
    //current Time
    displayTime()
    $('.parallax').parallax();

});