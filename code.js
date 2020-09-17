const map = document.getElementById("map");
const map_lite = document.getElementById("map_lite");
const area = document.getElementById("area");
const menu = document.getElementById("menu");
const warpoints = document.getElementById("warpoints");

const name = document.getElementById("name");
const desc = document.getElementById("desc");
const fon = document.getElementById("fon");
const ma = document.getElementById("ma");
const arch = document.getElementById("arch");
const way = document.getElementById("way");
const pop = document.getElementById("pop");

const version = "0.38"
const map_img = new Image();
const background = new Image();
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
      if (a.gsx$overworldx.$t && a.gsx$nom.$t != "" && a.gsx$nom.$t != "//" && a.gsx$nom != " ") {
        return a;
      }
    });
    data.sort(function(a, b) {
      return a.gsx$overworldy.$t - b.gsx$overworldy.$t;
    });
    redo();
  })




function changePage(x) {
  switch (x) {
    case 0:
      document.getElementById("option_menu").classList.remove("selected");
      document.getElementById("gallery_menu").classList.remove("selected");
      document.getElementById("info_menu").classList.add("selected");
      document.getElementById("info_page").classList.remove("none");
      document.getElementById("option_page").classList.add("none");
      document.getElementById("gallery_page").classList.add("none");
      break;
    case 1:
      document.getElementById("option_menu").classList.remove("selected");
      document.getElementById("gallery_menu").classList.add("selected");
      document.getElementById("info_menu").classList.remove("selected");
      document.getElementById("info_page").classList.add("none");
      document.getElementById("option_page").classList.add("none");
      document.getElementById("gallery_page").classList.remove("none");
      break;
    case 2:
      document.getElementById("option_menu").classList.add("selected");
      document.getElementById("gallery_menu").classList.remove("selected");
      document.getElementById("info_menu").classList.remove("selected");
      document.getElementById("info_page").classList.add("none");
      document.getElementById("option_page").classList.remove("none");
      document.getElementById("gallery_page").classList.add("none");
      break;
  }
}




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



      name.innerHTML = "Les villes"

      desc.classList.add("none");
      fon.classList.add("none");
      ma.classList.add("none");
      arch.classList.add("none");
      way.classList.add("none");
      pop.classList.add("none");

      document.getElementById("gallery_page").innerHTML = "";

      document.getElementById("background").style.backgroundImage = "url(./files/spawnv2.jpg)";
      document.getElementById("background").style.opacity = .25;
      document.getElementById("background").style.filter = "grayscale(1)";




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
    name.innerHTML = data[x].gsx$nom.$t;



    if (data[x].gsx$description != "//" || data[x.gsx$description != ".."]) {
      desc.innerHTML = data[x].gsx$description.$t;
      desc.classList.remove("none");
    } else {
      desc.classList.add("none");
    }


    if (data[x].gsx$fondateur.$t && data[x].gsx$fondateur.$t != "//") {
      fon.classList.remove("none");
      if (data[x].gsx$date.$t && data[x].gsx$date.$t != "//") {
        fon.innerHTML = "Fondée en " + data[x].gsx$date.$t + " par " + data[x].gsx$fondateur.$t;
      } else {
        fon.innerHTML = "Fondée par " + data[x].gsx$fondateur.$t;
      }
    } else if (data[x].gsx$date.$t && data[x].gsx$date.$t != "//") {
      fon.classList.remove("none");
      fon.innerHTML = "Fondée en " + data[x].gsx$date.$t;
    } else {
      fon.classList.add("none");
    }


    if (data[x].gsx$architecturegeneral.$t && data[x].gsx$architecturegeneral.$t != "//") {
      arch.classList.remove("none");
      if (data[x].gsx$architecturedetail.$t && data[x].gsx$architecturedetail.$t != "//") {
        arch.innerHTML = "Architecture: " + data[x].gsx$architecturegeneral.$t + ", " + data[x].gsx$architecturedetail.$t;
      } else {
        arch.innerHTML = "Architecture: " + data[x].gsx$architecturegeneral.$t;
      }
    } else {
      arch.classList.add("none");
    }


    if (data[x].gsx$maire.$t && data[x].gsx$maire.$t != "//") {
      ma.classList.remove("none");
      ma.innerHTML = "Maire actuel: " + data[x].gsx$maire.$t;
    } else {
      ma.classList.add("none");
    }


    if (data[x].gsx$point.$t && data[x].gsx$point.$t != "//") {
      way.classList.remove("none");
      way.innerHTML = "Adresse du nether: " + data[x].gsx$point.$t + " " + data[x].gsx$sortie.$t + " " + data[x].gsx$direction.$t;
    } else {
      way.classList.add("none");
    }


    if (data[x].gsx$populationactuel.$t && data[x].gsx$populationactuel.$t != "//") {
      pop.classList.remove("none");
      if (data[x].gsx$populationtotal.$t && data[x].gsx$populationtotal.$t != "//") {
        pop.innerHTML = "Population actuel: " + data[x].gsx$populationactuel.$t + " sur " + data[x].gsx$populationtotal.$t;
      } else {
        pop.innerHTML = "Population actuel: " + data[x].gsx$populationactuel.$t;
      }
    } else if (data[x].gsx$populationtotal.$t && data[x].gsx$populationtotal.$t != "//") {
      pop.classList.remove("none");
      pop.innerHTML = "Population total: " + data[x].gsx$populationtotal.$t;
    } else {
      pop.classList.add("none");
    }


    document.getElementById("gallery_page").innerHTML = "";
    document.getElementById("background").style.backgroundImage = "url(./files/spawnv2.jpg)";
    document.getElementById("background").style.opacity = .25;
    document.getElementById("background").style.filter = "grayscale(1)";


    document.getElementById("background").onload = function() {
      console.log("image is loaded");
    }
    if (data[x].gsx$image1.$t.startsWith("http")) {
      background.src = data[x].gsx$image1.$t;
      background.onload = function() {
        document.getElementById("background").style.backgroundImage = "url(" + this.src + ")";
        document.getElementById("background").style.opacity = 1;
        document.getElementById("background").style.filter = "none";
        loadGallery(x);
      };
    } else {
      background.src = "./files/spawnv2.jpg";
      background.onload = function() {
        document.getElementById("background").style.backgroundImage = "url(" + this.src + ")";
        document.getElementById("background").style.opacity = .25;
        document.getElementById("background").style.filter = "grayscale(1)";
        loadGallery(x);
      };
    }


    actual_selected = x;
  }
}



function loadGallery(x) {
  for (var i = 1; i < 11; i++) {
    if (data[x]["gsx$image" + i].$t) {
      var img = document.createElement("img");
      img.src = data[x]["gsx$image" + i].$t;
      document.getElementById("gallery_page").appendChild(img);
    }
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
    document.getElementById("body").style.overflowY = "hidden";
  } else {
    area.classList.add("zoom");
    menu.classList.add("none");
    document.getElementById("body").style.overflowY = "auto";
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
      name.innerHTML = data[i].gsx$nom.$t;
      div.classList.add("data");
      point.classList.add("point");
      point.title = data[i].gsx$nom.$t;
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
