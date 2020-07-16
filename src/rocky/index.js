var rocky = require('rocky');

// Global object to store weather data
var weather;

rocky.on('message', function(event) {
  // Receive a message from the mobile device (pkjs)
  var message = event.data;

  if (message.weather) {
    // Save the weather data
    weather = message.weather;

    // Request a redraw so we see the information
    rocky.requestDraw();
  }
});

function drawWeather(ctx, weather) {
  var bounds = { width: ctx.canvas.unobstructedWidth, height: ctx.canvas.unobstructedHeight };
  // Create a string describing the weather
  //var weatherString = weather.celcius + '°C, ' + weather.desc;
  var weatherString = weather.fahrenheit + '°F  |  ' + weather.desc;

  //top border weather text
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.font = '24px bold Gothic';
  ctx.fillText(weatherString, bounds.width / 2, bounds.height / 3 - bounds.height / 6 -2);
}

rocky.on('draw', function(event) {
  var ctx = event.context;
  var bounds = { width: ctx.canvas.unobstructedWidth, height: ctx.canvas.unobstructedHeight };

  // Clear the previous selection.
  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
  
  //top rectangle
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, bounds.width, bounds.height / 3 - bounds.height / 6);
  
  //top border
  ctx.fillStyle = '#b3b3b3';
  ctx.fillRect(0, bounds.height / 3 - bounds.height / 6, bounds.width, bounds.height / 6);

  //middle rectangle
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, bounds.height / 3, bounds.width, 2 * bounds.height / 3);

  //bottom border
  ctx.fillStyle = '#b3b3b3';
  ctx.fillRect(0, 2 * bounds.height / 3, bounds.width, bounds.height / 6);

  //bottom rectangle
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 2 * bounds.height / 3 + bounds.height / 6, bounds.width, bounds.height);

  if (weather) {
    drawWeather(ctx, weather);
  }

  //style time
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.font = '42px bold numbers Leco-numbers';
    
  //get and define time
  var time = new Date();
    
  //convert hour to 12 hour base time
  var twelveHour = time.getHours() > 12 ? time.getHours() % 12 : time.getHours();
    
  //concantenate minute zero to time less than 10
  var minConcatZero = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    
  //display time
  ctx.fillText((twelveHour) + ':' + (minConcatZero),
    bounds.width / 2, bounds.height / 2 - 28);
    

  //get and convert month number to month text
  var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var monTxt = month[time.getMonth()];
  //get and convert day number to day text
  var day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var dayTxt = day[time.getDay()];

  //display date
  ctx.fillStyle = 'black';
  ctx.font = '24px bold Gothic';

  ctx.fillText(dayTxt + ', ' + monTxt + ' ' + time.getDate().toString(), bounds.width / 2 , 2 * bounds.height / 3 - 4);  
});

rocky.on('minutechange', function(event) {
  //screen redraw
  rocky.requestDraw();
});

rocky.on('hourchange', function(event) {
  rocky.postMessage({'fetch': true});
});

//using guide created by scottlogic.com