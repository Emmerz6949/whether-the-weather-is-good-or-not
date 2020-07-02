var apiKey = '0c8fc80ce5b237fd93f2c417b34dced5';
var today = moment().format('l');
var fut1 = moment().add(1, 'days').format('l');
var fut2 = moment().add(2, 'days').format('l');
var fut3 = moment().add(3, 'days').format('l');
var fut4 = moment().add(4, 'days').format('l');
var fut5 = moment().add(5, 'days').format('l');

$('#search').on('click', function() {
   event.preventDefault();
   $('#current').html('');
   
   var city = $('#cityInput').val();
   var currentURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;
   var futureURL = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey;

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
    });
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
