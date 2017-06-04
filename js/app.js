var endpointURLScoring = "http://api.fantasy.nfl.com/v1/players/scoringleaders";

var state = {
  selected:{
    year: '',
    position:'',
    week:'',
    playerOne:'',
    playerTwo:''
  },
  results: null
};


// ---------------------------  API Call Fxn  ---------------------------------------

// Fxn to GET all player information for a given position, year, and week from API scoringleaders endpoint:
function getPlayersFromAPI(state, callback){
  var settings = {
    url: endpointURLScoring,
    data: {
      season: state.selected.year,
      week: state.selected.week,
      position: state.selected.position,
      format: 'json'
    },
    dataType: 'jsonp',
    method: 'GET',
    success: callback
  };
  $.ajax(settings);
}


// ----------------------------  Display Fxns.  --------------------------------------

// Callback Fxn that displays a list of players in a dropdown menu for user selection for both Player 1 and Player 2:
function displayDropdown(playerData){
  var player = {};
  var players = [];
  var resultElement = '';

  var selectedPosition = Object.keys(playerData.positions)[0];
  var selectedPlayers = playerData.positions[selectedPosition]; //array of objects

  state.results = selectedPlayers;

  for(var i = 0; i < selectedPlayers.length; i++){
    player = {
      name: selectedPlayers[i].firstName + ' ' + selectedPlayers[i].lastName,
      team: selectedPlayers[i].teamAbbr,
      alpha: selectedPlayers[i].lastName
    };
    players.push(player);
  }

  players.sort(alphaSort);

  for(var x = 0; x < players.length; x++){
    resultElement += '<option>' + players[x].name + ',  ' + players[x].team + '</option>'
  }

  $('.player-list').html(resultElement);
}

// Fxn that sorts names alphabetically in both player-list dropdown menus:
function alphaSort(a, b) {
    var playerA = a.alpha.toUpperCase();
    var playerB = b.alpha.toUpperCase();

    var comparison = 0;
      if (playerA > playerB) {
        comparison = 1;
      } else if (playerA < playerB) {
        comparison = -1;
      }
      return comparison;
  }

//Fxn that displays stats and player bio for both players:
function displayStats(state){
  var playerArrayOne = state.selected.playerOne.split(' ');
  var playerOneFN = playerArrayOne.shift();
  var playerOneLN = playerArrayOne.shift().slice(0, -1);

  var playerArrayTwo = state.selected.playerTwo.split(' ');
  var playerTwoFN = playerArrayTwo.shift();
  var playerTwoLN = playerArrayTwo.shift().slice(0, -1);

  for (var i = 0; i < state.results.length; i++){
    if ((playerOneFN === state.results[i].firstName) && (playerOneLN === state.results[i].lastName)){
      var playerOneObject = state.results[i];
      var playerOneStats =  state.results[i].stats;
    }

    if ((playerTwoFN === state.results[i].firstName) && (playerTwoLN === state.results[i].lastName)){
      var playerTwoObject = state.results[i];
      var playerTwoStats =  state.results[i].stats;
    }
  }

  var displayOne = '<h2>Stats for ' + state.selected.year + ', Week ' + state.selected.week + ':</h2>' + '<ul>';
    for (var k = 0; k < 10; k++){
      var statKeyOne = Object.keys(playerOneStats)[k];
      var statValueOne = playerOneStats[statKeyOne];
        if (statValueOne === false){
          statValueOne = 0;
        }
        switch (state.selected.position){
            case "QB":
              if (k <= 4 || k >= 8){
                displayOne += '<li class="stat1-' + statKeyOne + '">' + statKeyOne + ': ' + statValueOne + '</li>';
              }
              break;
            case "RB":
            case "WR":
            case "TE":
              if ((k >=3 && k <= 6) || k >= 8){
                displayOne += '<li class="stat1-' + statKeyOne + '">' + statKeyOne + ': ' + statValueOne + '</li>';
              }
              break;
            default:   // for kicker:
              if (k <= 5){
                displayOne += '<li class="stat1-' + statKeyOne + '">' + statKeyOne + ': ' + statValueOne + '</li>';
              }
         }
    }
  displayOne += '</ul>';

  var displayTwo = '<h2>Stats for ' + state.selected.year + ', Week ' + state.selected.week + ':</h2>' + '<ul>';
    for (var k = 0; k < 10; k++){
      var statKeyTwo = Object.keys(playerTwoStats)[k];
      var statValueTwo = playerTwoStats[statKeyTwo];

      if (statValueTwo === false){
        statValueTwo = 0;
      }
      switch (state.selected.position){
            case "QB":
              if (k <= 4 || k >= 8){
                displayTwo += '<li class="stat2-' + statKeyTwo + '">' + statKeyTwo + ': ' + statValueTwo + '</li>';
              }
              break;
            case "RB":
            case "WR":
            case "TE":
              if ((k >=3 && k <= 6) || k >= 8){
                displayTwo += '<li class="stat2-' + statKeyTwo + '">' + statKeyTwo + ': ' + statValueTwo + '</li>';
              }
              break;
            default:   // for kicker:
              if (k <= 5){
                displayTwo += '<li class="stat2-' + statKeyTwo + '">' + statKeyTwo + ': ' + statValueTwo + '</li>';
              }
         }
    }
  displayTwo += '</ul>';

  $('.playerOne-bio').html('<h1>' + playerOneFN + ' ' + playerOneLN + '</h1><h2>' + playerOneObject.teamAbbr + '</h2><h2>' + state.selected.position + '</h2>')
  $('.playerTwo-bio').html('<h1>' + playerTwoFN + ' ' + playerTwoLN + '</h1><h2>' + playerTwoObject.teamAbbr + '</h2><h2>' + state.selected.position + '</h2>')

  $('#playerOne-stat-display').html(displayOne);
  $('#playerTwo-stat-display').html(displayTwo);

  compare(playerOneStats, playerTwoStats);

  displayPhoto(playerOneObject, playerTwoObject);
}

//Fxn that compares the stats listed between both players and highlights the stat that is greater:
function compare(playerOneStats, playerTwoStats){
  for (var k = 0; k < 10; k++){
    var statKeyOne = Object.keys(playerOneStats)[k];
    var statValueOne = playerOneStats[statKeyOne];

    var statKeyTwo = Object.keys(playerTwoStats)[k];
    var statValueTwo = playerTwoStats[statKeyTwo];

    if (statValueOne > statValueTwo){
      $('.stat1-' + statKeyOne).addClass('highlight');
    }
    else if (statValueOne < statValueTwo){
      $('.stat2-' + statKeyTwo).addClass('highlight');
    }
  }
}

//Fxn that displays the headshot and logo for both players:
function displayPhoto(playerOneObject, playerTwoObject){
  var headshotOne = '<img src="http://s.nflcdn.com/static/content/public/static/img/fantasy/transparent/200x200/' + playerOneObject.esbid + '.png">';
  var teamLogoOne = '<img src="http://fantasy.nfl.com/static/img/clubs/' + playerOneObject.teamAbbr.toLowerCase() + '/280x240_1495738232.png">';

  var headshotTwo = '<img src="http://s.nflcdn.com/static/content/public/static/img/fantasy/transparent/200x200/' + playerTwoObject.esbid + '.png">';
  var teamLogoTwo = '<img src="http://fantasy.nfl.com/static/img/clubs/' + playerTwoObject.teamAbbr.toLowerCase() + '/280x240_1495738232.png">';

  $('#playerOne-headshot').html(headshotOne);
  $('#playerOne-logo').html(teamLogoOne);
  $('#playerTwo-headshot').html(headshotTwo);
  $('#playerTwo-logo').html(teamLogoTwo);
}


// ---------------------------  User Event fxns.  ---------------------------------

//Fxn that calls API fxn when user selects a position, year, and week, then clicks the "start" button:
function initialSelect(){
  $('.initial-select').click(function(e){
    e.preventDefault();
    state.selected.position = $('#position-choice').val();
    state.selected.year = $('#year').val();
    state.selected.week = $('#week').val();
      if ((state.selected.position != "no-choice") && (state.selected.year != "no-choice") && (state.selected.week != "no-choice")){
        getPlayersFromAPI(state, displayDropdown);
      $('.hide').removeClass('hide');
      }
      else{
        alert("Please pick a position, a year, and a week!");
      }
  });
}

//Fxn that calls the displayStats fxn and opens the popup window when user selects players from both dropdown menus, then clicks the "Compare" button:
function selectCompare(){
  $('.compare-initial').click(function(e){
    state.selected.playerOne = $('#player-one').find('option:selected').val();
    state.selected.playerTwo = $('#player-two').find('option:selected').val();
      if ((state.selected.playerOne != "no-choice") && (state.selected.playerTwo != "no-choice")){
        $('.overlay').addClass('is-on');
        displayStats(state);
      }
      else{
        alert("You can't compare players if you don't pick two!  Please select a player from both menus.");
      }
  });
}

//Fxn that closes the popup window, and takes user back to 1st page upon clicking the "Close and Choose Again" button:
function closePopup(){
  $('#close').on('click', function() {
    $('.overlay').removeClass('is-on');
  });
}

//jQuery Onload fxn:
$(function(){
  initialSelect();
  selectCompare();
  closePopup();
});







