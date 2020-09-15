const map = document.getElementById("map");
const map_lite = document.getElementById("map_lite");
const area = document.getElementById("area");
const menu = document.getElementById("menu");
const warpoints = document.getElementById("warpoints");
const version = "0.30"
const map_img = new Image();

var data = new Object;
var map_size = 938;
var pmc_size = 6144;
var actual_selected = "";



console.log("version: " + version);

map_img.src = "./files/map1.png";
map_img.onload = function() {
  map.src = this.src;
};
fetch("https://yxmna.github.io/playmcfrmap/data.json").then(function(response) {
  return response.json();
}).then(function(obj) {
  data = obj;
  data = data.filter(function(a) {
    if (!isNaN(a["Overworld"])) {
      return a;
    }
  });
  data.sort(function(a, b) {
    return a["__2"] - b["__2"]
  });
  redo();
});


function redo() {
  map_size = map.getBoundingClientRect().height;
  load(map_size);
}

function click(x) {
  warpoints.innerHTML = "";
  if (area.classList.contains("zoom")) {
    zoom(true);
    setTimeout(function() {
      click(x);
    }, 600);
  } else {
    map_size = map.getBoundingClientRect().height;
    load(map_size);
    if (actual_selected == x) {
      for (var div of warpoints.children) {
        if (div.localName == "p") {
          div.classList.remove("none");
        }
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
      if (div.localName == "p") {
        div.classList.add("none");
      }
    }
    document.getElementById("name" + x).classList.remove("none");
    document.getElementById(x).classList.add("selected");
    document.getElementById("name" + x).classList.add("name_selected");
    document.getElementById("name").innerHTML = data[x].__1;
    if (data[x].__13 == data[x].__14) {
      document.getElementById("mf").innerHTML = "Maire et fondateur: " + data[x].__14;
    } else {
      document.getElementById("mf").innerHTML = "Maire: " + data[x].__14 + ", fondateur:  " + data[x].__13;
    }
    document.getElementById("arch").innerHTML = "Architecture: " + data[x].Architecture;
    document.getElementById("way").innerHTML = data[x].__4 + " " + data[x]["Adresse nether"] + " " + data[x].__5;
    document.getElementById("pop").innerHTML = "Population: " + data[x].Population + "/" + data[x].__9;
    if (data[x].Images.startsWith("http")) {
      console.log(data[x].Images);
      document.getElementById("background").style.backgroundImage = "url(" + data[x].Images + ")";
      document.getElementById("background").style.opacity = 1;
      document.getElementById("background").style.filter = "none";
    } else {
      document.getElementById("background").style.backgroundImage = "url(./files/spawnv2.jpg)";
      console.log(document.getElementById("background").style.backgroundImage);
      document.getElementById("background").style.opacity = .25;
      document.getElementById("background").style.filter = "grayscale(1)";
    }
    actual_selected = x;
  }
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

function zoom(noredo) {
  warpoints.innerHTML = "";
  actual_selected = "";
  if (area.classList.contains("zoom")) {
    menu.classList.remove("none");
    area.classList.remove("zoom");
  } else {
    area.classList.add("zoom");
    menu.classList.add("none");
  }
  if (noredo) return;
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
      div.classList.add("data");
      point.classList.add("point");
      point.title = data[x]["__1"];
      point.id = x;
      // point.style.height = 15 + "px";
      // point.style.width = 15 + "px";
      div.style.left = (data[x]["Overworld"] + pmc_size) / (pmc_size * 2 / map_size) + "px";
      div.style.top = (data[x]["__2"] + pmc_size) / (pmc_size * 2 / map_size) + "px";
      point.onclick = async function() {
        click(this.id);
      }
      div.appendChild(point);
      warpoints.appendChild(div);
      name.id = "name" + x;
      name.classList.add("name");
      name.style.left = (data[x]["Overworld"] + pmc_size) / (pmc_size * 2 / map_size) + "px";
      name.style.top = (data[x]["__2"] + pmc_size) / (pmc_size * 2 / map_size) + "px";
      warpoints.appendChild(name);
    }
  }
}
