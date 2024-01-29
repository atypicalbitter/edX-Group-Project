
//function that runs once page loaded, this ensures html & styling loaded prior to running javascript.

function pageFunction() {
  getRandomWord();
  //getLocalStorage();
}

//random word API 
function getRandomWord() {

let options = {
  method: 'GET',
  headers: { 'x-api-key': 'YdZ93eaf9/lPDJWzKd54Cw==SM2tbGXwQvwZfeB5' }
}

let queryURL = `https://api.api-ninjas.com/v1/randomword`

fetch(queryURL, options)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    let randomWord = data.word
    wordDefinition(randomWord);
    })

}

//dictionary API (no API required)
function wordDefinition(search) {

let queryURL = `https://api.dictionaryapi.dev/api/v2/entries/en/${search}`;

fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.title === "No Definitions Found") {
        getRandomWord();
      } else {
        //access word 
        $("#wordOfDay").text(data[0].word);
        //access definition
        $("#definition").text(data[0].meanings[0].definitions[0].definition);
}})

    }

//weather API


//intial script to get user geolocation needed to tailor weather report.

  var latitude = document.getElementById("latitude");
  var longitude = document.getElementById("longitude");
  var latitudeValue;
  var longitudeValue;

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      latitude.innerHTML = "Geolocation is not supported by this browser.";
      longitude.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
  
  function showPosition(position) {
    latitudeValue = position.coords.latitude;
    longitudeValue = position.coords.longitude;
    getWeatherLocationKey();
  }

//function to get weather API location key value needed.

//var AccuWeatherAPIKey = `eSxgoyGiT952q1nqJ6Y7oQkK8iM8L5nS`
var AccuWeatherAPIKey = `lQIft71p6aq5BQY6ApIiqGydcSheULRG`
var locationName;



function getWeatherLocationKey() {

var locationKey;

var queryLocationKey = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${AccuWeatherAPIKey}&q=${latitudeValue}%2C%20${longitudeValue}`

fetch(queryLocationKey)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    locationKey = data.Key;
    locationName = data.EnglishName;
    displayNews(locationName);
    getWeatherUpdate(locationKey);
        })

}

//function to get weather details based on location key value.

function getWeatherUpdate(key) {
  
  var queryWeather = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${key}?apikey=${AccuWeatherAPIKey}&details=true&metric=true`

  fetch(queryWeather)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    //min temp of day (works)
    $("#minTempDiv").text(data.DailyForecasts[0].Temperature.Minimum.Value + " °C");
    //max temp of day (works)
    $("#maxTempDiv").text(data.DailyForecasts[0].Temperature.Maximum.Value + " °C");
    //weather description
    $("#WeatherDescriptionDiv").text(`it's ` + data.DailyForecasts[0].Day.IconPhrase + ` in ` + locationName);
    //icon number
    if (data.DailyForecasts[0].Day.Icon < 10) {
    $("#WeatherIcon").css({"background-image":`url(https://developer.accuweather.com/sites/default/files/0${data.DailyForecasts[0].Day.Icon}-s.png)`});
    $("#dateDiv").text(dayjs().format('DD/MM/YYYY'));
    } else {
    $("#WeatherIcon").css({"background-image":`url(https://developer.accuweather.com/sites/default/files/${data.DailyForecasts[0].Day.Icon}-s.png)`});
    $("#dateDiv").text(dayjs().format('DD/MM/YYYY'));  
    }
    
   
    })
}

getLocation();

 //end of weather API

$( document ).ready(pageFunction());


$(document).ready(function () {
  // This will load tasks from local storage on page load
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  //  renderTasks function is responsible for updating the HTML to display the tasks.
  function renderTasks() {
      const taskList = $('#taskList');
      taskList.empty();

      tasks.forEach((task, index) => {
          const listItem = $('<li class="list-group-item d-flex justify-content-between align-items-center"></li>');
          
          const taskText = $('<span></span>');
          taskText.text(task.text);

          const checkbox = $('<input type="checkbox">');
          checkbox.prop('checked', task.completed);
          checkbox.on('change', function () {
              tasks[index].completed = $(this).prop('checked');
              saveTasks();
              renderTasks();
          });

          const deleteButton = $('<button class="btn btn-danger btn-sm ml-2">Delete</button>');
          deleteButton.on('click', function () {
              tasks.splice(index, 1);
              saveTasks();
              renderTasks();
          });

          listItem.append(checkbox);
          listItem.append(taskText);
          listItem.append(deleteButton);

          if (task.completed) {
              listItem.addClass('completed');
          }

          taskList.append(listItem);
      });
  }

  // This is the function to save tasks to local storage
  function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Event listener for the Add button
  $('#addButton').on('click', function () {
      const taskInput = $('#taskInput');
      const newTask = {
          text: taskInput.val(),
          completed: false,
      };

      if (newTask.text !== '') {
          tasks.push(newTask);
          saveTasks();
          renderTasks();
          taskInput.val('');
      }
  });

  renderTasks();
});


// Facts of the Day
$(document).ready(function () {

    const factTextEl = $("#fact-text");
    
    function factOfTheDay() {
        
        $.ajax({
            method: 'GET',
            url: 'https://uselessfacts.jsph.pl/api/v2/facts/random?language=en',
            contentType: 'application/json',
            success: function(result) {
                displayFact(result.text);
            },
            error: function ajaxError(jqXHR) {
            console.error('Error: ', jqXHR.responseText);
            }
        });
    }
    
    function displayFact(fact) {
        factTextEl.text(fact)
    }
    
    factOfTheDay();
    });

// News API

function displayNews(location) {
  const newsTextEl = $("#news-text");

  var requestOptions = {
      method: 'GET'
  };
  
  var params = {
      //api_token: `PliHxYcD4LPkVNVen8FR9XmvgKGGVrTr1z84qwiF`,
      api_token: 'uRyUO8NPQfbJFYAwA1buugfRSCrRyHyLy0UTsrIw',
      categories: 'general',
      search: `${location}`,
      limit: '1'
  };
  
  var esc = encodeURIComponent;
  var query = Object.keys(params)
      .map(function(k) {return esc(k) + '=' + esc(params[k]);})
      .join('&');
  
  fetch("https://api.thenewsapi.com/v1/news/all?" + query, requestOptions)
  .then(response => response.json())
    .then(result => {
      const articleTitle = result.data[0].title;
      const articleText = result.data[0].description;
      
      result.data.forEach(article => {
          newsTextEl.append(`<h3>${articleTitle}</h3><p>${articleText}</p>`)
      });
  })
  .catch(error => console.log('error', error));
}

