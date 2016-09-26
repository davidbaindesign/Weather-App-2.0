$(document).ready(function() {
 
//http://stackoverflow.com/questions/1664785/resize-html5-canvas-to-fit-window
//http://ayamerd.deviantart.com/art/Clouds-png-pack-178009335
//http://davidbaindesign.com/clouds/001.png
var lightning = false;
var celsius, fahrenheit, hiCelsius, lowCelsius, hiFahrenheit, lowFahrenheit, cloudCoverage;
var isChromium = window.chrome,
  winNav = window.navigator,
  vendorName = winNav.vendor,
  isOpera = winNav.userAgent.indexOf("OPR") > -1,
  isIEedge = winNav.userAgent.indexOf("Edge") > -1,
  isIOSChrome = winNav.userAgent.match("CriOS");
var weatherMap = null;
var f = "front";
var c = "back";
var mist = false;
var rain = false;
if (navigator.geolocation) {
  // if chrome new security disables geolocation
  if (isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
    $.getJSON("http://ipinfo.io", function(json) {
      var string = JSON.stringify(json);
      var obj = JSON.parse(string);
      obj.loc = obj.loc.split(",");
      weatherMap = "http://api.openweathermap.org/data/2.5/weather?lat=" + obj.loc[0] + "&lon=" + obj.loc[1] + "&appid=6180bd3f3dd535d87360adb5c9545cfd";
      update();
      setInterval(update, 45000);
    });
  } else {
    navigator.geolocation.getCurrentPosition(function(position) {
      weatherMap = "http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=6180bd3f3dd535d87360adb5c9545cfd";
      update();
      setInterval(update, 45000);
    });
  }
  window.requestAnimationFrame(draw);
}

function update() {
  $.getJSON(weatherMap, function(json) {
    var string = JSON.stringify(json);
    var obj = JSON.parse(string);
    cloudCoverage = obj.clouds.all;
    celsius = Math.round(obj.main.temp - 273.18);
    fahrenheit = Math.round(((celsius * 9) / 5) + 32);
    hiCelsius = Math.round(obj.main.temp_max - 273.18);
    hiFahrenheit = Math.round(((hiCelsius * 9) / 5) + 32);
    lowCelsius = Math.round(obj.main.temp_min - 273.18);
    lowFahrenheit = Math.round(((lowCelsius * 9) / 5) + 32);

    var d = new Date(0);
    d.setUTCSeconds(obj.sys.sunrise);
    var h = d.getHours();
    var m = Math.round((d.getMinutes() / 60) * 100) / 100;
    var s = Math.round((d.getSeconds() / 6000) * 10000) / 10000;
    var sunrise = h + m + s;

    var d2 = new Date(0);
    d2.setUTCSeconds(obj.sys.sunset);
    var h2 = d2.getHours();
    var m2 = Math.round((d2.getMinutes() / 60) * 100) / 100;
    var s2 = Math.round((d2.getSeconds() / 6000) * 10000) / 10000;
    var sunset = h2 + m2 + s2;

    var d3 = new Date();
    var epoch = Math.round(d3.getTime() / 1000);
    var h3 = d3.getHours();
    var m3 = Math.round((d3.getMinutes() / 60) * 100) / 100;
    var s3 = Math.round((d3.getSeconds() / 6000) * 10000) / 10000;
    var current = h3 + m3 + s3;
    // if sunrise > sunset is next day
    var sunrise1 = obj.sys.sunrise;
    var sunset1 = obj.sys.sunset;
    //next day
    if (epoch < sunrise1) {
      //fast forward a day 86400 seconds
      epoch = epoch + 86400;
    }
   else if (epoch > sunset1) {
      //previous day, rewind a day
      epoch = epoch - 86400;
    }
    
    //weather icon
    switch (obj.weather[0].icon) {

      case "01d":
        rain = false;
        lightning = false;
        mist = false;
        break;

      case "01n":
        rain = false;
        lightning = false;
        mist = false;
        break;

      case "02d":
        rain = false;
        lightning = false;
        mist = false;
        break;

      case "02n":
        rain = false;
        lightning = false;
        mist = false;
        break;

      case "03d":
        rain = false;
        lightning = false;
        mist = false;
        break;

      case "03n":
        rain = false;
        lightning = false;
        mist = false;
        break;

      case "04d":
        rain = false;
        lightning = false;
        mist = false;
        break;

      case "04n":
        rain = false;
        lightning = false;
        mist = false;
        break;

      case "09d":
        rain = true;
        lightning = false;
        mist = false;
        break;

      case "09n":
        rain = true;
        lightning = false;
        mist = false;
        break;

      case "10d":
        rain = true;
        lightning = false;
        mist = false;
        break;

      case "10n":
        rain = true;
        lightning = false;
        mist = false;
        break;

      case "11d":
        rain = true;
        lightning = true;
        mist = false;
        break;

      case "11n":
        rain = true;
        lightning = true;
        mist = false;
        break;
        //light clouds for snow
      case "13d":
        rain = false;
        lightning = false;
        mist = false;
        break;

      case "13n":
        rain = false;
        lightning = false;
        mist = false;
        break;
        //mist change sky color
      case "50d":
        rain = false;
        lightning = false;
        mist = true;
        break;

      default:
        //50n
        rain = false;
        lightning = false;
        mist = true
        break;

    }

    if (Math.abs(current - sunset) <= 1) {
      // - 20% sun top not visible
      // 120% sun not visible
      var x = current - sunset;
      var percent = 120 - (-20 * (x * 10));
      var color = "#7171C6";
      var color2 = "#EE4000";

      if (percent > 240) {
        color = "#0A0A49";
        color2 = "#8282d7";
      }
      $("#sky").css("background-image", "radial-gradient(circle at 50%" + percent.toString() + "% , #FFA500 30px, " + color2 + " 30px, " + color + " 50%)");

    } else if (Math.abs(current - sunrise) <= 1) {

      var x = sunrise - current;
      var percent = 120 - (-20 * (x * 10));
      var color = "#7171C6";
      if (percent > 240) {
        color = "#0A0A49";
      };

      $("#sky").css("background-image", "radial-gradient(circle at 50%" + percent.toString() + "% , #FFA500 30px, #EE4000 30px, " + color + " 50%)");

    } else if (epoch > sunrise1 && epoch < sunset1) { //day
      $("#sky").css("background", "#88e");
      if (mist === true){
      $("#sky").css("background", "#ddf");
      }
    } else {
      //night
      $("#sky").css("background-image", "radial-gradient(ellipse at 50% -70% , #000099 30%, #000000 70%)");
       if (mist === true){
      $("#sky").css("background", "#333");
      }
    }
   

    //anyway the wind blows does really matter to me
    if (obj.wind.deg >= 337.5 || obj.wind.deg <= 22.5) {
      //north
      var windPic = "http://davidbaindesign.com/clouds/n.png";

    } else if (obj.wind.deg > 22.5 && obj.wind.deg < 67.5) {
      //north east
      var windPic = "http://davidbaindesign.com/clouds/ne.png";
    } else if (obj.wind.deg >= 67.5 && obj.wind.deg < 112.5) {
      //east
      var windPic = "http://davidbaindesign.com/clouds/e.png";
    } else if (obj.wind.deg >= 112.5 && obj.wind.deg < 157.5) {
      //south east
      var windPic = "http://davidbaindesign.com/clouds/se.png";
    } else if (obj.wind.deg >= 157.5 && obj.wind.deg < 202.5) {
      //south
      var windPic = "http://davidbaindesign.com/clouds/s.png";
    } else if (obj.wind.deg >= 202.5 && obj.wind.deg < 247.5) {
      //south west
      var windPic = "http://davidbaindesign.com/clouds/sw.png";
    } else if (obj.wind.deg >= 247.5 && obj.wind.deg < 292.5) {
      //west
      var windPic = "http://davidbaindesign.com/clouds/w.png";
    } else {
      //north west
      var windPic = "http://davidbaindesign.com/clouds/nw.png";
    }
    
    var windspeed = (Math.round(3.6 * obj.wind.speed)) + " km wind";
    if (f === "front") {
      windspeed = (Math.round(2.23694 * obj.wind.speed)) + " mph wind";
    }

    $("#temp").html("<h1 style=font-size:280%;padding:10px>" + obj.name + ", " + obj.sys.country + 
    "</h1><div class=holder><div class= nums><img style=display:block;margin:auto;margin-bottom:5px;height:60px; src=" + 
    "http://davidbaindesign.com/clouds/" + obj.weather[0].icon + ".png><i>" + obj.weather[0].description + 
    "</i></div></div><div class=holder><div id=switch><div class=" + f + "><div class=nums><div id=numsLeft><h1>" + 
    fahrenheit + "°</h1><p>" + hiFahrenheit + " | " + lowFahrenheit + "</p></div><div id=numsRight><h1>F</h1></div></div></div><div class=" + 
    c + "><div class=nums><div id=numsLeft><h1>" + celsius + "°</h1><p>" + hiCelsius + " | " + lowCelsius + 
    "</p></div><div id=numsRight><h1>C</h1></div></div></div></div></div><div class=holder><div class= nums><img style=display:block;margin:auto;margin-bottom:5px;height:60px; src=" + windPic + "><i id=windspeed>" + windspeed + "</i></div></div>");

    //change borders for different conditions
    if (fahrenheit > 84) {
      $(".holder").css({
        "border": "2px solid #fdd",
        "box-shadow": "0 0 5px 2px #fdd"
      });
    } else if (fahrenheit < 45) {
      $(".holder").css({
        "border": "2px solid #ddf",
        "box-shadow": "0 0 5px 2px #ddf"
      });
    } else {
      $(".holder").css({
        "border": "2px solid #ddd",
        "box-shadow": "0 0 5px 2px #ddd"
      });
    }

    $("#switch").flip();

    $("#switch").click(function() {
      //Math.round(3.6 * obj.wind.speed) km
      if (f === "front") {
        f = "back";
        c = "front";
        $("#windspeed").text(Math.round(3.6 * obj.wind.speed) + " km wind");

      } else {
        c = "back";
        f = "front";
        $("#windspeed").text(Math.round(2.23694 * obj.wind.speed) + " mph wind");
      }
    });

  });
}

var cloud1 = new Image();
var cloud2 = new Image();
var cloud3 = new Image();
var cloud4 = new Image();
var cloud5 = new Image();
var cloud6 = new Image();

var cloud1L = new Image();
var cloud2L = new Image();
var cloud3L = new Image();
var cloud4L = new Image();
var cloud5L = new Image();
var cloud6L = new Image();

var bolt = new Image();

var longCloud = new Image();

var xC = window.innerWidth;
var dC = xC * .165;
var eC = xC * .33;
var fC = xC * .495;
var gC = xC * .66;
var hC = xC * .825;
var aC = 0;
var bC = aC + 995;
var cC = bC + 995;

var lightningTime = 0;

function init() {

  cloud1.src = 'http://davidbaindesign.com/clouds/007.png';
  cloud2.src = 'http://davidbaindesign.com/clouds/010.png';
  cloud3.src = 'http://davidbaindesign.com/clouds/008.png';
  cloud4.src = 'http://davidbaindesign.com/clouds/012.png';
  cloud5.src = 'http://davidbaindesign.com/clouds/022.png';
  cloud6.src = 'http://davidbaindesign.com/clouds/021.png';

  cloud1L.src = "http://davidbaindesign.com/clouds/L024.png";
  cloud2L.src = 'http://davidbaindesign.com/clouds/Lclouds2D.png';
  cloud3L.src = 'http://davidbaindesign.com/clouds/L025.png';
  cloud4L.src = 'http://davidbaindesign.com/clouds/L023.png';
  cloud5L.src = 'http://davidbaindesign.com/clouds/L020.png';
  cloud6L.src = 'http://davidbaindesign.com/clouds/Lclouds4D.png';
  bolt.src = 'http://davidbaindesign.com/clouds/bolt.png';

  longCloud.src = 'http://davidbaindesign.com/clouds/cloudsLight.png';
  lightningTime++;
  
  if (rain === true) {
    longCloud.src = 'http://davidbaindesign.com/clouds/cloudsStorm4.png';

    cloud1.src = 'http://davidbaindesign.com/clouds/024.png';
    cloud2.src = 'http://davidbaindesign.com/clouds/clouds2D.png';
    cloud3.src = 'http://davidbaindesign.com/clouds/025.png';
    cloud4.src = 'http://davidbaindesign.com/clouds/023.png';
    cloud5.src = 'http://davidbaindesign.com/clouds/020.png';
    cloud6.src = 'http://davidbaindesign.com/clouds/clouds4D.png';

  }
}

function resetC() {
  if (xC < -600) {
    xC = window.innerWidth;
  }
  if (dC < -600) {
    dC = window.innerWidth;
  }
  if (eC < -600) {
    eC = window.innerWidth;
  }
  if (fC < -600) {
    fC = window.innerWidth;
  }
  if (gC < -530) {
    gC = window.innerWidth;
  }
  if (hC < -620) {
    hC = window.innerWidth;
  }
  if (aC < -995) {
    aC = bC + 995;
    cC = aC + 995;
  }
  if (bC < -995) {
    bC = aC + 995;
    cC = bC + 995;
  }
}

$("#city").keyup(function(event) {
  if (event.keyCode == 13) {
    //update sunset
    weatherMap = "http://api.openweathermap.org/data/2.5/weather?q=" + $(this).val() + "&appid=6180bd3f3dd535d87360adb5c9545cfd";
    update();
    $(this).val("");
  }
});

function draw() {
  init();
  var ctx = document.getElementById('canvas').getContext('2d');
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = 140;
  ctx.clearRect(0, 0, ctx.canvas.width, 140);
  ctx.globalCompositeOperation = 'source-over';
  ctx.save();

  xC = xC - .32;
  dC = dC - .41;
  eC = eC - .53;
  fC = fC - .44;
  gC = gC - .35;
  hC = hC - .26;
  aC = aC - .14;
  bC = bC - .14;
  cC = cC - .14;

  if (cloudCoverage > 87) {
    if (lightning === true && lightningTime % 120 === 0) {
      var randomNum = Math.floor((Math.random() * window.innerWidth) + 1);
      ctx.drawImage(bolt, randomNum, 70);
    }
    ctx.drawImage(longCloud, aC, -70);
    ctx.drawImage(longCloud, bC, -70);

    if (window.innerWidth > 995) {
      ctx.drawImage(longCloud, cC, -70);
    }

  } else {
    if (cloudCoverage > 80) {
      ctx.drawImage(cloud6, hC, -40);
      if (lightning === true && lightningTime % 460 === 0) {
        ctx.drawImage(cloud6L, hC, -40);
      }
    }

    if (cloudCoverage > 65) {
      ctx.drawImage(cloud4, fC, -165);

      if (lightning === true && lightningTime % 730 === 0) {
        ctx.drawImage(cloud4L, fC, -165);
      }
    }
    if (cloudCoverage > 50) {
      ctx.drawImage(cloud5, gC, -40);
      if (lightning === true && lightningTime % 358 === 0) {
        ctx.drawImage(cloud5L, gC, -40);
      }
    }

    if (cloudCoverage > 40) {
      ctx.drawImage(cloud3, eC, -28);
      if (lightning === true && lightningTime % 510 === 0) {
        ctx.drawImage(cloud3L, eC, -28);
      }

    }

    if (cloudCoverage > 20) {
      ctx.drawImage(cloud2, xC, -90);
      if (lightning === true && lightningTime % 608 === 0) {
        ctx.drawImage(cloud2L, xC, -90);
      }
    }

    if (cloudCoverage > 8) {
      ctx.drawImage(cloud1, dC, -10);
      if (lightning === true) {
        if (lightning === true && lightningTime % 590 === 0) {
          ctx.drawImage(cloud1L, dC, -10);
        }
      }
    }
  }

  resetC();

  window.requestAnimationFrame(draw);
}

});
