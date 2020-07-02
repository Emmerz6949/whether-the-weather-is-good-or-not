var apiKey = '0c8fc80ce5b237fd93f2c417b34dced5';
var today = moment().format('l');

current(localStorage.getItem('lastName'));

$('#search').on('click', function() {
   event.preventDefault();

   $('#current').html('');
   $('#fiveDay').text('');
   $('#future').html('');
   
   var city = $('#cityInput').val();
   current(city);
}); 

function getUV(lat, lon) {
    var uvURL = 'http://api.openweathermap.org/data/2.5/uvi?appid=' + apiKey + '&lat=' + lat + '&lon=' + lon;

    $.ajax({
        url: uvURL,
        method: "GET"
      })
        .then(function(response) {
            var curIndex = response.value;
            var condition = '';

            if (curIndex < 3) {
                condition = 'badge-success';
            }
            else if (curIndex >= 3 && curIndex < 8) {
                condition = 'badge-warning';
            }
            else if (curIndex >= 8) {
                condition = 'badge-danger';
            }

            var seeUV = $('<p class="card-text">UV Index: <span class="badge ' + condition + ' p-2">' + curIndex + '</span></p>');
            $('#currentBody').append(seeUV);
     });
}

var t = 0;

function current(city) {
    $('#current').html('');
    $('#fiveDay').text('');
    $('#future').html('');
    var currentURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;
 
    $.ajax({
     url: currentURL,
     method: "GET"
   })
     .then(function(response) {
         var kelvin = response.main.temp;
         var temp = ((kelvin - 273.15) * 1.80 + 32).toFixed(2);
         var cityName = response.name;
         var humid = response.main.humidity;
         var wind = response.wind.speed;
         var lati = response.coord.lat;
         var long = response.coord.lon;
         var iconID = response.weather[0].icon;
         var iconSrc = 'http://openweathermap.org/img/wn/' + iconID + '@2x.png';
 
         var cardBody = $('<div class="card-body" id="currentBody"></div>');
         $('#current').addClass('card');
         $('#current').append(cardBody);
 
         var cardTitle = $('<h2 class="card-title">' + cityName + ' ' + today + ' <img src="' + iconSrc + '" alt="related weather icon"/></h2>');
         $('#currentBody').append(cardTitle);
 
         var cardTemp = $('<p class="card-text">Temperature: ' + temp + ' &#8457;</p>');
         $('#currentBody').append(cardTemp);
 
         var cardHumid = $('<p class="card-text">Humidity: ' + humid + '%</p>');
         $('#currentBody').append(cardHumid);
 
         var cardWind = $('<p class="card-text">Wind Speed: ' + wind + ' MPH</p>');
         $('#currentBody').append(cardWind);
 
         getUV(lati, long);

         future(lati, long);

         localStorage.setItem('lastName', cityName);

            var pastSearch = $('<li class="list-group-item list-group-item-action" id="' + t + '">'+ cityName + '</li>');
            $('#pastCity').append(pastSearch);
    
    
            $('#' + t).on('click', function() {
                event.preventDefault();

                $('#current').html('');
                $('#fiveDay').text('');
                $('#future').html('');
    
                var oldCity = $(this).text();
                current(oldCity);
    
                $('#current').html('');
                $('#fiveDay').text('');
                $('#future').html('');
            });
     });
     t++;
}

function future(lat, lon) {
    var futureURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=current,minutely,hourly&appid=' + apiKey;
    var i = 1;

    $.ajax({
     url: futureURL,
     method: "GET"
   })
     .then(function(response) {
         $('#fiveDay').text('5-Day Forecast: ');
         for (i = 1; i < 6; i++) {
             var futureIconID = response.daily[i].weather[0].icon;
             var futureSrc = 'http://openweathermap.org/img/wn/' + futureIconID + '@2x.png';
             var futureKelvin = response.daily[i].temp.day;
             var futureTemp = ((futureKelvin - 273.15) * 1.80 + 32).toFixed(2);
             var futureHumid = response.daily[i].humidity;
             var futureDay = moment().add(i, 'days').format('l');

             var futureCard = $('<div class="card bg-primary mb-5 text-white day-' + i + '" style="width: 20%;">');
             $('#future').append(futureCard);

             var futureBody = $('<div class="card-body body-' + i + '">');
             $('.day-' + i).append(futureBody);

             var futureTitle = $('<h5 class="card-title">' + futureDay + '</h5>');
             $('.body-' + i).append(futureTitle);

             var futureIcon = $('<img src="' + futureSrc + '" alt="related weather icon"/>');
             $('.body-' + i).append(futureIcon);
     
             var futureCardTemp = $('<p class="card-text">Temperature: ' + futureTemp + ' &#8457;</p>');
             $('.body-' + i).append(futureCardTemp);
     
             var futureCardHumid = $('<p class="card-text">Humidity: ' + futureHumid + '%</p>');
             $('.body-' + i).append(futureCardHumid);
         }
     });
}
