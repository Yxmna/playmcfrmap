const map = document.getElementById("map");
const area = document.getElementById("area");
const pointswar = document.getElementById("pointswar");
const menu = document.getElementById("menu");
const version = "0.18"

var data = new Object;
var map_height = 938;
var map_width = 938;
var pmc_size = 6144;
var actual_selected = "";

console.log(version);

fetch("https://yxmna.github.io/playmcfrmap/data.json").then(function(response) {
  return response.json();
}).then(function(obj) {
  data = obj;
  zoom();
});


function mapType(x) {
  switch (x) {
    case 0:
      map.src = "./files/map1.png";
      break;
    case 1:
      map.src = "./files/map_s1.png";
      break;
  }
}

function zoom() {
  actual_selected = "";
  if (map.classList.contains("anti-zoom")) {
    menu.classList.add("none");
    map.classList.remove("anti-zoom");
  } else {
    menu.classList.remove("none");
    map.classList.add("anti-zoom");
  }
  map_height = map.getBoundingClientRect().height;
  map_width = map.getBoundingClientRect().width;
  load(map_height, map_width);
}

function click(x) {
  if (actual_selected == x) {
    console.log(true);
    for (var div of pointswar.children) {
      div.firstChild.classList.remove("void");
    }
    actual_selected = "";
    document.getElementById(x).classList.remove("selected");
    document.getElementById("name").innerHTML = "Nom"
    document.getElementById("mf").innerHTML = "Fondateur & Maire"
    document.getElementById("arch").innerHTML = "Architecture"
    document.getElementById("way").innerHTML = "Chemin du nether"
    return;
  }
  menu.classList.remove("none");
  map.classList.add("anti-zoom");
  map_height = map.getBoundingClientRect().height;
  map_width = map.getBoundingClientRect().width;
  load(map_height, map_width);
  for (var div of pointswar.children) {
    div.firstChild.classList.add("void");
    div.style.zIndex = 0;
  }
  document.getElementById(x).parentElement.firstChild.classList.remove("void");
  document.getElementById(x).parentElement.style.zIndex = 1;
  document.getElementById(x).classList.add("selected");
  document.getElementById("name").innerHTML = data[x].__1;
  if (data[x].__13 == data[x].__14) {
    document.getElementById("mf").innerHTML = "Maire et fondateur: " + data[x].__14;
  } else {
    document.getElementById("mf").innerHTML = "Maire: " + data[x].__14 + ", fondateur:  " + data[x].__13;
  }
  document.getElementById("arch").innerHTML = "Architecture: " + data[x].Architecture;
  document.getElementById("way").innerHTML = data[x].__4 + " " + data[x]["Adresse nether"] + " " + data[x].__5;
  actual_selected = x;
}

function load(map_height, map_width) {
  pointswar.innerHTML = "";
  for (var ville in data) {
    if (isNaN(data[ville]["__2"]) || data[ville]["Caractéristique"] == "Détruite") {
      //
    } else {
      var div = document.createElement("div");
      var point = document.createElement("div");
      var name = document.createElement("p");
      name.innerHTML = data[ville]["__1"];
      // name.classList.add("void");
      div.classList.add("point");
      point.title = data[ville]["__1"];
      point.id = ville
      div.style.left = (data[ville]["Overworld"] + pmc_size) / (pmc_size * 2 / map_width) + "px";
      div.style.top = (data[ville]["__2"] + pmc_size) / (pmc_size * 2 / map_height) + "px";

      point.onclick = async function() {
        click(this.id);
      }


      div.appendChild(name);
      div.appendChild(point);
      pointswar.appendChild(div);
    }
  }
}
