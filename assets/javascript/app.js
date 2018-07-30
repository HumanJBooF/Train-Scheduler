$(function () {

    $('.card').hide()
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyD3Ax76YqmjJii-sZcTpolidVB-VleH58k",
        authDomain: "train-database-eadf6.firebaseapp.com",
        databaseURL: "https://train-database-eadf6.firebaseio.com",
        projectId: "train-database-eadf6",
        storageBucket: "train-database-eadf6.appspot.com",
        messagingSenderId: "430166995585"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    var pushToBase = () => {
        var trainName = $('.train').val().trim();
        var destination = $('.destination').val().trim();
        var firstTrain = $('.time').val().trim();
        var freq = $('.frequency').val().trim();
        //creating objext to send to database
        var newTrain = {
            name: trainName,
            destination: destination,
            time: firstTrain,
            frequency: freq,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        }
        //checking to make sure all form fields and filled
        if (trainName === "" || destination === "" || firstTrain === "" || freq === "") {
            $( ".card" ).fadeIn("fast");

            setTimeout(function(){ 
                $(".card").fadeOut("slow", function() {
                });
            }, 5000);
            return false;
        } else {
               //sending to database
        database.ref('new_train').push(newTrain);
        //gotta console log you know
        // console.log('Checking new object', newTrain);
        // console.log('this is button');
        }
     
    };

    //reseting input fields(I know the name didn't give that a way)
    var resetFields = () => {
        $('.train, .destination, .time, .frequency').val("");
    };

    //display live time
    function displayTime() {
        var time = moment().format('hh:mm:ss A');
        $('.nav-title').html(time);
        setTimeout(displayTime, 1000);
    }

    database.ref('new_train').on('child_added', function (childSnapshot) {
        console.log('This is CHILD ADDED', childSnapshot.val());

        var trainName = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var freq = childSnapshot.val().frequency
        var firstTrainTime = childSnapshot.val().time
        var key = childSnapshot.key

        var newFreq = parseInt(freq)
        // first train time going back in time like Marty McFly to come before the current time
        var firstTimeConverted = moment(firstTrainTime, 'hh:mm').subtract(1, 'years');
        // Difference between times (omg no way!)
        var timeBetween = moment().diff(moment(firstTimeConverted), 'minutes')
        // Dividing the remaining time with the frequency 
        var timeRemainder = timeBetween % newFreq;
        // well well well now here we got to subtract the frequency from the remaining till to get the minutes until next train you know?!
        var minutesTillTrain = newFreq - timeRemainder;
        // Next trains coming down the track choooo choooooo
        var nextTrain = moment().add(minutesTillTrain, 'minutes')
        var displayNext = moment(nextTrain).format('hh:mm A')


        $('.tBody').append(
            `<tr>
              <td>${trainName}</td>
              <td>${destination}</td>
              <td>${freq}</td>
              <td>${displayNext}</td>
              <td>${minutesTillTrain}</td>
              <td><a class="remove waves-effect waves-light deep-orange darken-4 btn" id="${key}"><i class="material-icons">remove_circle_outline</i></a></td>
             </tr>`
        );

    }, function(error) {
        console.log(`Uh I think you have yourself an error boy ${error}`);
    });

    //click me function and it like tottally calls some things you know
    $('.submit').on('click', function () {
        event.preventDefault();
        pushToBase();
        resetFields();
    });


    $(document).on('click', '.remove', function () {
        var deleteKey = $(this).attr("id");
        database.ref('new_train').child(deleteKey).remove();

        location.reload();
    })

    //Almost working.... Sign in with google click event
    $('.signin').on('click', function () {
        console.log('click')
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
            var token = result.credential.accessToken;
            var user = result.user;
        
                console.log(token)
                console.log(user)

        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log(error.code)
            console.log(error.message)
        });

    })
    //reloads page every minute to display accurate train times ... trying to find a better way to do this
    // setInterval(function () {
    //     location.reload();
    // }, 1000 * 60)

    //current Time
    displayTime()
    $('.parallax').parallax();


});