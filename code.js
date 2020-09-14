const map = document.getElementById("map");
const area = document.getElementById("area");
const menu = document.getElementById("menu");
const warpoints = document.getElementById("warpoints");
const version = "0.21"

var data = new Object;
var map_size = 938;
var pmc_size = 6144;
var actual_selected = "";

console.log("version: " + version);

fetch("https://yxmna.github.io/playmcfrmap/data.json").then(function(response) {
  return response.json();
}).then(function(obj) {
  data = obj;
  redo();
});

function redo() {
  map_size = map.getBoundingClientRect().height;
  load(map_size);
}

function click(x) {
  area.style.transition = "none";
  menu.classList.remove("none");
  area.classList.remove("zoom");
  map_size = map.getBoundingClientRect().height;
  load(map_size);
  if (actual_selected == x) {
    for (var div of warpoints.children) {
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

  for (var div of warpoints.children) {
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
  setTimeout(function() {
    area.style.transition = "all .5s";
  }, 100);
}

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
  warpoints.innerHTML = "";
  actual_selected = "";
  if (area.classList.contains("zoom")) {
    menu.classList.remove("none");
    area.classList.remove("zoom");
  } else {
    area.classList.add("zoom");
    menu.classList.add("none");
  }
  setTimeout(function() {
    redo();
  }, 600);
}

function load(map_size) {
  warpoints.innerHTML = "";
  for (var x in data) {
    if (isNaN(data[x]["__2"]) || data[x]["Caractéristique"] == "Détruite") {
      //
    } else {
      var div = document.createElement("div");
      var point = document.createElement("div");
      var name = document.createElement("p");
      name.innerHTML = data[x]["__1"];
      // name.classList.add("void");
      div.classList.add("data");
      point.classList.add("point");
      point.title = data[x]["__1"];
      point.id = x
      div.style.left = (data[x]["Overworld"] + pmc_size) / (pmc_size * 2 / map_size) + "px";
      div.style.top = (data[x]["__2"] + pmc_size) / (pmc_size * 2 / map_size) + "px";
      point.onclick = async function() {
        click(this.id);
      }
      div.appendChild(name);
      div.appendChild(point);
      warpoints.appendChild(div);
    }
  }
}
