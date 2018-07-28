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
            time: moment($('.time').val().trim(), 'HH:mm').subtract(1, 'years').format('X'),
            frequency: $('.frequency').val().trim()
        }
        //sending to database
        database.ref('new_train').push(newTrain);
        //gotta console log you know
        console.log('Checking new object', newTrain);
        console.log('this is button');
    }
    //reseting input fields(I know the name didn't give that a way)
    var resetFields = () => {
        $('.train').val("");
        $('.destination').val("");
        $('.time').val("");
        $('.frequency').val("");
    }


    $('.submit').on('click', function () {
        event.preventDefault();
        pushToBase();
        resetFields();
    })

    database.ref('new_train').on('child_added', function (childSnapshot) {
        console.log('This is CHILD ADDED', childSnapshot.val());

        $('.body').append(
            `<tr><td class='nameDisplay'>${childSnapshot.val().name}</td>
              <td class='destDisplay'>${childSnapshot.val().destination}</td>
              <td class='freqDisplay'>${childSnapshot.val().frequency}</td>
              <td class='timeDisplay'>${childSnapshot.val().time}</td></tr>`
        )


    });

    $('.parallax').parallax();

});