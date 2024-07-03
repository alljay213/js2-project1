document.addEventListener('DOMContentLoaded', function() {
  var baseballObject;
  var gameIndex = 0;
  const ISOK = 200;
  const API_KEY = "a4ba10e4181e4789ad13f742e164a09e"; // Inserted API key
  const playerCache = {};
  const stadiumCache = {};

  function getJSONAsync(url, callback) {
    var request = new XMLHttpRequest();

    request.onload = function() {
      if (request.status === ISOK) {
        callback(JSON.parse(request.responseText));
      } else {
        alert('Failed to load data. Status: ' + request.status);
      }
    };

    request.onerror = function() {
      alert('Network error occurred while trying to fetch data.');
    };

    request.open("GET", url);
    request.setRequestHeader("Ocp-Apim-Subscription-Key", API_KEY); // Set your API key here
    request.send();
  }

  function getPlayerDetails(playerId, callback) {
    if (playerCache[playerId]) {
      callback(playerCache[playerId]);
    } else {
      var playerURL = `https://api.sportsdata.io/v3/mlb/scores/json/Player/${playerId}?key=${API_KEY}`;
      getJSONAsync(playerURL, function(data) {
        playerCache[playerId] = data;
        callback(data);
      });
    }
  }

  function getStadiumDetails() {
    var stadiumURL = `https://api.sportsdata.io/v3/mlb/scores/json/Stadiums?key=${API_KEY}`;
    getJSONAsync(stadiumURL, function(data) {
      data.forEach(stadium => {
        stadiumCache[stadium.StadiumID] = stadium;
      });
    });
  }

  const year = document.getElementById('year');
  const month = document.getElementById('month');
  const day = document.getElementById('day');
  const retrieveBtn = document.getElementById('retrieve');

  function getBaseballDataAsynch() {
    let yearVal = parseInt(year.value);
    let monthVal = parseInt(month.value);
    let dayVal = parseInt(day.value);

    if (isNaN(yearVal) || isNaN(monthVal) || isNaN(dayVal)) {
      alert('Please enter valid numeric values for year, month, and day.');
      return;
    }

    // Use the Sportsdata.io API endpoint
    var tempURL =
      `https://api.sportsdata.io/v3/mlb/scores/json/GamesByDate/${yearVal}-${monthVal.toString().padStart(2, '0')}-${dayVal.toString().padStart(2, '0')}?key=${API_KEY}`;

    getJSONAsync(tempURL, function(data) {
      baseballObject = data;
      gameIndex = 0;
      displayCurrentGame();
    });
  }

  retrieveBtn.addEventListener('click', getBaseballDataAsynch);

  const nextBtn = document.getElementById('next');
  function nextGame() {
    if (baseballObject && baseballObject.length) {
      if (gameIndex < baseballObject.length - 1) {
        gameIndex++;
        displayCurrentGame();
      } else {
        alert("No more games available");
      }
    } else {
      alert("No game data available.");
    }
  }
  nextBtn.addEventListener("click", nextGame);

  const previousBtn = document.getElementById('previous');
  function previousGame() {
    if (baseballObject && baseballObject.length) {
      if (gameIndex > 0) {
        gameIndex--;
        displayCurrentGame();
      } else {
        alert("No more games available");
      }
    } else {
      alert("No game data available.");
    }
  }
  previousBtn.addEventListener("click", previousGame);

  function displayCurrentGame() {
    if (!baseballObject || !baseballObject.length) {
      alert('No game data available.');
      return;
    }

    const currentGame = baseballObject[gameIndex];

    document.getElementById("homeTeamName").value = currentGame.HomeTeam;
    document.getElementById("awayTeamName").value = currentGame.AwayTeam;

    if (currentGame.WinningPitcherID) {
      getPlayerDetails(currentGame.WinningPitcherID, function(player) {
        document.getElementById("winningPitcher").value = `${player.FirstName} ${player.LastName}`;
      });
    } else {
      document.getElementById("winningPitcher").value = 'N/A';
    }

    if (currentGame.LosingPitcherID) {
      getPlayerDetails(currentGame.LosingPitcherID, function(player) {
        document.getElementById("losingPitcher").value = `${player.FirstName} ${player.LastName}`;
      });
    } else {
      document.getElementById("losingPitcher").value = 'N/A';
    }

    document.getElementById("venue").value = currentGame.StadiumID ? (stadiumCache[currentGame.StadiumID]?.Name || 'N/A') : 'N/A';
  }

  const saveGameBtn = document.getElementById('save-game');
  function saveGame() {
    if (!baseballObject || !baseballObject.length) {
      alert('No game data available.');
      return;
    }

    const currentGame = baseballObject[gameIndex];

    currentGame.HomeTeam = document.getElementById("homeTeamName").value;
    currentGame.AwayTeam = document.getElementById("awayTeamName").value;

    var winningPitcher = document.getElementById("winningPitcher").value.split(" ");
    if (winningPitcher.length === 2) {
      currentGame.WinningPitcherFirstName = winningPitcher[0];
      currentGame.WinningPitcherLastName = winningPitcher[1];
    }

    var losingPitcher = document.getElementById("losingPitcher").value.split(" ");
    if (losingPitcher.length === 2) {
      currentGame.LosingPitcherFirstName = losingPitcher[0];
      currentGame.LosingPitcherLastName = losingPitcher[1];
    }

    currentGame.Stadium = currentGame.Stadium || {};
    currentGame.Stadium.Name = document.getElementById("venue").value;

    alert('Game data saved successfully.');
  }
  saveGameBtn.addEventListener("click", saveGame);

  // Fetch stadium details on page load
  getStadiumDetails();
});
