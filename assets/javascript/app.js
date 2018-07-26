$(function() {



    var config = {
        apiKey: "AIzaSyA85l8B-AKnOiRKtdSzY5iP-XtynZnHU5Q",
        authDomain: "test-b6c38.firebaseapp.com",
        databaseURL: "https://test-b6c38.firebaseio.com",
        projectId: "test-b6c38",
        storageBucket: "test-b6c38.appspot.com",
        messagingSenderId: "9218918367"
      };
      firebase.initializeApp(config);

      var database = firebase.database();

      $('.btn').on('click', function() {
          event.preventDefault();
         
          var newTrain = {
              name: $('.train').val().trim(),
              destination: $('.destination').val().trim(),
              time: $('.time').val().trim(),
              frequency: $('.frequency').val().trim()
          };

          database.ref('new_train').push(newTrain)
          console.log('Checking new object' + newTrain)
          console.log('this is button')
      })

      database.ref('new_train').on('child_added', function(childSnapshot) {
          console.log('This is CHILD ADDED', childSnapshot.val())
          
        var currentTime = moment().format("HH:mm")

        console.log(currentTime)
          $('.body').append(
              `<tr><td class='nameDisplay'>${childSnapshot.val().name}</td>
              <td class='destDisplay'>${childSnapshot.val().destination}</td>
              <td class='timeDisplay'>${childSnapshot.val().time}</td>
              <td class='freqDisplay'>${childSnapshot.val().frequency}</td></tr>`
          )
      })
})