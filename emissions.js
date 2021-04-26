var j = 0;
var sec = 80
var heading = "Know your footprint."
var typedheading = ""
var cities = [];
var lat = [];
var displayed = 0;
const pollutants = {
  "PM2.5":"PM<sub>2.5</sub>",
  "PM10": "PM<sub>10</sub>",
  "NO2": "Nitrogen Dioxide",
  "SO2": "Sulfur Dioxide",
  "CO": "Carbon Monoxide",
  "O3": "Ozone",
}

window.onload = type()
function type() {
  if (j < heading.length) {
    typedheading += heading.charAt(j);
    document.getElementById("footprint").innerHTML = typedheading
    j++
    sec -= 2
    setTimeout(type, sec)
  }
}



function calcEmissions() {
  const kwh = document.getElementById('kwh').value
  const gal = document.getElementById('gal').value
  const fuelco2 = Number(gal) * 19.55 * 12
  const elecco2 = Number(kwh) * 0.947 * 12
  const res = fuelco2 + elecco2
  const printableRes = res.toLocaleString()
  const trees = Math.round((res / 48)).toLocaleString()
  const acreage = Number(trees) / 200
  const html = "It would take "
  const treehtml = trees + " trees or "
  const acrehtml = acreage + " acres of forest land to offset your footprint."
  const annualco2 = "<h1>" + printableRes +
    " lb.</h1>Your emissions are estimated to be " + printableRes +
    " pounds of Carbon Dioxide annually from gasoline and residential" +
    " electricity use alone. <br><br>" + html + treehtml + acrehtml;
  document.getElementById('calc').innerHTML =
    (res || res === 0) ? annualco2 : "<br><br><h1>Please enter numbers only</h1>"
  // const trees = Math.round((res / 48)).toLocaleString()
  // const acreage = Number(trees) / 200
  // const html = "It would take "
  // const treehtml = trees + " trees or"
  // const acrehtml = acreage + " acres of forest land to offset your footprint."
  // document.getElementById('title').innerHTML =
  // (res || res === 0) ? html : "";
  // document.getElementById('offset').innerHTML =
  // (res || res === 0) ? treehtml : "0 trees";
  // document.getElementById('acre').innerHTML =
  // (res || res === 0) ? acrehtml : "0 acres of forest";

}

for (var i = 0; i < document.querySelectorAll("#state").length; i++) {
  document.querySelectorAll("#state")[i].addEventListener("click", clickedOn);
}

function backToMap(){
  document.getElementById("airq").style.display="none";
  document.getElementById("svg").style.display = "initial"
  document.getElementById("select").style.display = "initial"
  document.getElementById("map").style.display = "none"
  for (var i = 0; i < document.querySelectorAll(".city").length; i++) {
    document.querySelectorAll(".city")[i].style.display="none";
    document.querySelectorAll(".data")[i].style.display="none";
  }
}

function clickedOn() {
  document.getElementById("airq").style.display="initial";
  for (var i = 0; i < document.querySelectorAll(".city").length; i++) {
    document.querySelectorAll(".city")[i].style.display="none";
    document.querySelectorAll(".data")[i].style.display="none";
    document.querySelectorAll(".data")[i].innerHTML="";
  }
  cities = [];
  document.getElementById("select").style.display = "none"
  document.getElementById("map").style.display = "initial"
  abbr = this.getAttribute("class")
  var statename = name3[abbr.toUpperCase()];
  lat = [];
  var lon = [];
  var city = [];
  displayed = 0;
  for (let e = 0; e < locations.length; e++){
    if (statename == locations[e]["state"]){
      lat.push(locations[e]['latitude'])
      lon.push(locations[e]['longitude'])
    }
  }
  if (lat.length){
    for (let num1 = 0; num1 <= 4 && num1 < lat.length; num1++){
      var options = {}
      options["url"] = "https://airnowapi.org/aq/observation/latLong/current"
      options["lat"] = lat[num1]
      options["lon"] = lon[num1]

      options["format"] = "application/json"
      options["api_key"] = "A3BFFE47-AC59-4828-8ABD-6DCD435FC82D"
      var request_URL = options["url"]
                        + "?latitude=" + options["lat"]
                        + "&longitude=" + options["lon"]
                        + "&format=" + options["format"]
                        + "&api_key=" + options["api_key"];
      fetch(request_URL)
         .then(res => res.json())
         .then(data => displayData(data))
    }
  }
}

function displayData(data){
  displayed += 1;
  if (data.length == 0) {
    if (lat.length == displayed){
      cityName = document.querySelector(".city0")
      cityName.innerHTML = "<h3>Sorry, no data to display.</h3>";
      cityName.style.display = "flex";
    }
    return
  }
  if (cities.includes(data[0]["ReportingArea"])){
    return
  }
  cities.push(data[0]["ReportingArea"]);
  cityclass = ".city" + String(cities.length)
  cityName = document.querySelector(".city"+String(cities.length-1))
  dataAQI = document.querySelector(".data"+String(cities.length-1))
  dataAQI.style.display= "flex";
  cityName.style.display = "flex";
  cityName.innerHTML = "<h3>"+cities[cities.length-1]+"</h3>";

  for (let x = 0; x < data.length; x++){
    var newDiv = document.createElement('div');
    var html ="<h2>" + String(data[x]["AQI"]) + "</h2>"
    + "<h6>" + pollutants[String(data[x]["ParameterName"])] + "</h6>";
    newDiv.classList.add("col-sm");
    newDiv.innerHTML = html;
    dataAQI.appendChild(newDiv);
  }
  var hr = document.createElement('hr');
  dataAQI.appendChild(hr);
}
