
const titleElement = document.getElementById("title");
const weatherContainer = document.getElementById("w-container");
const cityElement = document.getElementById("city");
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');
var w = canvas.width;
var h = canvas.height;



const weather = {};
weather.temperature = {
    unit: "celsius"
}

const KELVIN = 273;

const APIkey = "2d3376bce4cc1b689dbc425ad6dbeb55";

if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition,showError);
}
else{
   titleElement.innerHTML = "Error";
}

function setPosition(position){
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    getWeather(lat,long);

}

function showError(error){
    titleElement.innerHTML = "Error";
}
let climate;
function getWeather(latitude,longitude){
  let api = 'http://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+ longitude +'&appid='+APIkey;
  console.log(api);
  fetch(api)
     .then(function(response){
         let data = response.json();
         return data
     })
     .then(function(data){
         weather.temperature.value = Math.floor(data.main.temp - KELVIN);
         weather.city = data.name;
         weather.climate = data.weather[0].main;
     })
     .then(function(){
         displayWeather();
     });
}




function displayWeather(){
    weatherContainer.innerHTML = weather.temperature.value+"°C";
    titleElement.innerHTML = weather.climate;
    cityElement.innerHTML = weather.city;
    if(weather.climate=="Rain")
    {       
      rain(1000);
    }  
    if(weather.climate=="Drizzle")
    {       
     rain(100);
    }
    if(weather.climate=="Snow")
    {
     snow(25);
    }
    if(weather.climate=="Clouds")
    {
     cloud();
    }
    if(weather.climate=="Clear")
    {
     sun();
    }

}


function rain(maximumParticles){
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    var init = [];
    for(var a = 0; a < maximumParticles; a++) {
      init.push({
        x: Math.random() * w,
        y: Math.random() * h,
        l: Math.random() * 1,
        dx: -2 + Math.random() * 2 + 2,
        dy: Math.random() * 8 + 8
      })
    }
    var particleArray = [];
    for(var b = 0; b < maximumParticles; b++) {
      particleArray[b] = init[b];
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for(var c = 0; c < particleArray.length; c++) {
        var p = particleArray[c];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.l * p.dx, p.y + p.l * p.dy);
        ctx.stroke();
      }
      move();
    }
    function move() {
      for(var b = 0; b < particleArray.length; b++) {
        var p = particleArray[b];
        p.x += p.dx;
        p.y += p.dy;
        if(p.x > w || p.y > h) {
          p.x = Math.random() * w;
          p.y = -18;
        }
      }
    }
    
    setInterval(draw, 30);
}

function snow(maxparticles)
{   
    document.body.style.backgroundColor="black";

	var snowflakes = [];
	for(var i = 0; i < maxparticles; i++)
	{
		snowflakes.push({
			x: Math.random()*w, 
			y: Math.random()*h, 
			r: Math.random()*5+1, 
			d: Math.random()*maxparticles
		})
	}
	
	function draw()
	{
		ctx.clearRect(0, 0, w, h);
		
		ctx.fillStyle = "white";
		ctx.beginPath();
		for(var i = 0; i < maxparticles; i++)
		{
			var p =snowflakes[i];
			ctx.moveTo(p.x, p.y);
			ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
		}
		ctx.fill();
		update();
	}
	
	
	var angle = 0;
	function update()
	{
		angle += 0.01;
		for(var i = 0; i < maxparticles; i++)
		{
			var p = snowflakes[i];
			p.y += Math.cos(angle+p.d) + 1 + p.r/2;
			p.x += Math.sin(angle) * 2;
			if(p.x > w+5 || p.x < -5 || p.y > h)
			{
				if(i%3 > 0) 
				{
					snowflakes[i] = {x: Math.random()*w, y: -10, r: p.r, d: p.d};
				}
				else
				{
				   if(Math.sin(angle) > 0)
					{
						snowflakes[i] = {x: -5, y: Math.random()*h, r: p.r, d: p.d};
					}
					else
					{
						snowflakes[i] = {x: w+5, y: Math.random()*h, r: p.r, d: p.d};
					}
				}
			}
		}
	}
	
	setInterval(draw, 33);
}

function cloud()
{
var yPosMax = 175;
var yPosMin = 125;
var yPosStart = 150;
var xPosStart = -50;
var yPosChangeMultiplier = 60;
var xPosChangeMin = 125;
var xPosChangeMultiplier = 25;
var yControlMultiplier = 20;
var yControlMin = 40;
ctx.fillStyle = 'lightblue';
var xPos = xPosStart;
var yPos = yPosStart;
ctx.beginPath();
ctx.moveTo(xPos, yPos);
while (xPos < canvas.width) {
  lastX = xPos;
	xPos += Math.floor(Math.random() * xPosChangeMultiplier + xPosChangeMin);
	yPos += Math.floor(Math.random() * yPosChangeMultiplier - yPosChangeMultiplier/2);
	while (yPos < yPosMin) {
		yPos += Math.floor(Math.random() * yPosChangeMultiplier/2); 
	}
	while (yPos > yPosMax) {
		yPos -= Math.floor(Math.random() * yPosChangeMultiplier/2); 
	}
  controlX = (lastX + xPos)/2;
  controlY = yPos-Math.floor(Math.random() * yControlMultiplier + yControlMin);
	ctx.quadraticCurveTo(controlX,controlY,xPos,yPos);
}
ctx.lineTo(canvas.width,yPos);
ctx.lineTo(canvas.width,canvas.height);
ctx.lineTo(0,canvas.height);
ctx.fill();
   
}

function sun()
{
    var rotate = 0;
    draw();


  function draw() {
    updateAnimation();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

 
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(rotate);
    ctx.beginPath();
    ctx.arc(0,0, 75, 0, 2*Math.PI, false);
    ctx.fillStyle="orange";
    ctx.fill();
 
    var rotate2 = 0;
    for( var i = 0; i < 6; i++) {
        ctx.save(); 
        ctx.fillStyle = "red"
        ctx.rotate(rotate2);
        ctx.translate(75, 0);
        if (i % 2 == 0)
            ctx.fillRect(0,0,35,2);
        else
            ctx.fillRect(0,0,25,2);            
        ctx.restore();
        rotate2 += (2*Math.PI) / 8;
    }
    ctx.restore();

    setTimeout(draw, 25);
}

function updateAnimation() {
    rotate += Math.PI / 200;
}
}