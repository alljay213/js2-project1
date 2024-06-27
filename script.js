// Doesn't included the <select> HTML controls
var baseballObject;
var gameIndex = 0;

// return code value from requests
const ISOK = 200;

// AJAX asynchronous XMLHttpRequest to get the JSON
// from the site defined by url and using the
// callback function callback (alias for myCallBack)
function getJSONAsync(url) {
  var request = new XMLHttpRequest();
  request.onload = function () {
    if (request.status === ISOK) {
      baseballObject = JSON.parse(request.responseText);
      gameIndex = 0;
      displayCurrentGame();
    }
  };
  request.open("GET", url);
  request.send();
}

// onload event handler creates the URL
// for a given year month and day
function getBaseballDataAsynch() {
  var year = "2018";
  var month = "07";
  var day = "08";

  // build a URL as required by the MLB site
  var tempURL =
    "http://gd2.mlb.com/components/game/mlb/year_" +
    year +
    "/month_" +
    month +
    "/day_" +
    day +
    "/master_scoreboard.json";

  // this is what the actual URL will look like
  // http://gd2.mlb.com/components/game/mlb/year_2017/month_07/day_08/master_scoreboard.json

  // get the data for the specified date with an asynchronous call
  // the result will be seen above in the callBack function
  getJSONAsync(tempURL);
}

// the event handler for the "next game" button
// must check to be sure we're not trying to display
// a game that's not in the "game" array
function nextGame() {
  // if the "gameIndex" is less than the length
  // of the "game" array -1,
  // we can add 1 to "gameIndex" and not go "over the top"
  // of the array
  if (gameIndex < baseballObject.data.games.game.length - 1) {
    gameIndex++;
    displayCurrentGame();
  } else alert("No more games avaialable");
}

// the event handler for the "previous game" button
// must check to be sure we're not trying to display
// a game that's not in the "game" array
function previousGame() {
  // if the "gameIndex" is greater than 0
  // we can subtract 1 from "gameIndex"
  if (gameIndex > 0) {
    gameIndex--;
    displayCurrentGame();
  } else alert("No more games available");
}

// this function just displays the fields for the "current" game
// based on the value of the "gameIndex" variable
function displayCurrentGame() {
  // assign the home team name from the property "home_team_name" in the "game" array "gameIndex" element
  // which is from the "games" object which in turn is part of the "data"
  // manually inspect the MLB.json to see this hierarchy
  document.getElementById("txtHome").value =
    baseballObject.data.games.game[gameIndex].home_team_name;
  document.getElementById("txtAway").value =
    baseballObject.data.games.game[gameIndex].away_team_name;

  var first = baseballObject.data.games.game[gameIndex].winning_pitcher.first;
  var last = baseballObject.data.games.game[gameIndex].winning_pitcher.last;
  document.getElementById("txtWinning").value = first + " " + last;

  first = baseballObject.data.games.game[gameIndex].losing_pitcher.first;
  last = baseballObject.data.games.game[gameIndex].losing_pitcher.last;
  document.getElementById("txtLosing").value = first + " " + last;

  document.getElementById("txtVenue").value =
    baseballObject.data.games.game[gameIndex].venue;
}
