const map = document.getElementById("map");
const map_lite = document.getElementById("map_lite");
const area = document.getElementById("area");
const menu = document.getElementById("menu");
const warpoints = document.getElementById("warpoints");
const version = "0.33"
const map_img = new Image();
const villes = "https://spreadsheets.google.com/feeds/list/1W1fNliviLAqHabVDkix4xUVq6S1E5wAwcCy8Dy8u65k/od6/public/values?alt=json"

var data = new Object;
var data2 = new Object;
var map_size = 938;
var pmc_size = 6144;
var actual_selected = "";



console.log("version: " + version);

map_img.src = "./files/map1.png";
map_img.onload = function() {
  map.src = this.src;
};

fetch(villes)
  .then(function(res) {
    return res.json();
  })
  .then(function(obj) {
    data = obj.feed.entry;
    data = data.filter(function(a) {
      if (!isNaN(a.gsx$overworldx.$t) && a.gsx$villes.$t != "" && a.gsx$villes.$t != "//" && a.gsx$villes.$t != "..") {
        return a;
      }
    });
    data.sort(function(a, b) {
      return a.gsx$overworldy.$t - b.gsx$overworldy.$t;
    });
    console.log(data);
    redo();
  })









function resize() {
  if (map.getBoundingClientRect().height != map_size) {
    redo();
  }
}

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
    document.getElementById("name").innerHTML = data[x].gsx$villes.$t;
    if (data[x].gsx$maire.$t == data[x].gsx$fondateur.$t) {
      document.getElementById("mf").innerHTML = "Maire et fondateur: " + data[x].gsx$maire.$t;
    } else {
      document.getElementById("mf").innerHTML = "Maire: " + data[x].gsx$maire.$t + ", fondateur:  " + data[x].gsx$fondateur.$t;
    }
    document.getElementById("arch").innerHTML = "Architecture: " + data[x].gsx$architecturegeneral.$t;
    document.getElementById("way").innerHTML = data[x].gsx$point.$t + " " + data[x].gsx$sortie.$t + " " + data[x].gsx$direction.$t;
    document.getElementById("pop").innerHTML = "Population: " + data[x].gsx$populationactuel.$t + "/" + data[x].gsx$populationtotal.$t;
    if (data[x].gsx$image1.$t.startsWith("http")) {
      document.getElementById("background").style.backgroundImage = "url(" + data[x].gsx$image1.$t + ")";
      document.getElementById("background").style.opacity = 1;
      document.getElementById("background").style.filter = "none";
    } else {
      document.getElementById("background").style.backgroundImage = "url(./files/spawnv2.jpg)";
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
  for (var i = 0; i < data.length; i++) {
    if (isNaN(data[i].gsx$overworldy.$t) || data[i].gsx$status.$t == "Détruite") {
      //
    } else {
      var div = document.createElement("div");
      var point = document.createElement("div");
      var name = document.createElement("p");
      name.innerHTML = data[i].gsx$villes.$t;
      div.classList.add("data");
      point.classList.add("point");
      point.title = data[i].gsx$villes.$t;
      point.id = i;
      // point.style.height = 15 + "px";
      // point.style.width = 15 + "px";
      div.style.left = (Math.floor(data[i].gsx$overworldx.$t) + pmc_size) / (pmc_size * 2 / map_size) + "px";
      div.style.top = (Math.floor(data[i].gsx$overworldy.$t) + pmc_size) / (pmc_size * 2 / map_size) + "px";
      point.onclick = async function() {
        click(this.id);
      }
      div.appendChild(point);
      warpoints.appendChild(div);
      name.id = "name" + i;
      name.classList.add("name");
      name.style.left = (Math.floor(data[i].gsx$overworldx.$t) + pmc_size) / (pmc_size * 2 / map_size) + "px";
      name.style.top = (Math.floor(data[i].gsx$overworldy.$t) + pmc_size) / (pmc_size * 2 / map_size) + "px";
      name.style.animationDuration = (Math.random() * (0.7 - 0.3)) + 0.4 + "s";
      warpoints.appendChild(name);
    }
  }
}
