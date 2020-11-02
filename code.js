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


const version = "1.1";
const map_img = new Image();
const lite_map_img = new Image();
const villes = "https://spreadsheets.google.com/feeds/list/1W1fNliviLAqHabVDkix4xUVq6S1E5wAwcCy8Dy8u65k/od6/public/values?alt=json";
const shops = "https://spreadsheets.google.com/feeds/list/1yDpIpiEO_6MKyA8F9njDm8XpOIdYq7rzAG2rxm1e-MA/od6/public/values?alt=json";

var darray = [];
var dname = "";
var lite_map = false;
var show_tag = true;
var show_color = false;
var show_only = false;
var show_nether = false;
var villes_data = new Object;
var shops_data = new Object;
var claims_data = [];
var map_size = 938;
var pmc_size = 6144;
var actual_selected = "";



console.log("version: " + version);


lite_map_img.src = "./files/map_s1.png";



lite_map_img.onload = function() {
  map.src = lite_map_img.src;
  map_img.src = "./files/map1.jpg";
  map_img.onload = function() {
    map.src = this.src;
  };
};








fetch(villes)
  .then(function(res) {
    return res.json();
  })
  .then(function(obj) {
    villes_data = obj.feed.entry;
    villes_data = villes_data.filter(function(a) {
      if (a.gsx$overworldx.$t && a.gsx$nom.$t != "" && a.gsx$nom.$t != "//" && a.gsx$nom != " " && a.gsx$status.$t != "Détruite" && !isNaN(a.gsx$overworldx.$t)) {
        return a;
      }
    });
    villes_data.sort(function(a, b) {
      return a.gsx$overworldy.$t - b.gsx$overworldy.$t;
    });
    redo();
  })

fetch(shops)
  .then(function(res) {
    return res.json();
  })
  .then(function(obj) {
    shops_data = obj.feed.entry;
    shops_data = shops_data.filter(function(a) {
      if (a.gsx$overworldx.$t && a.gsx$nom.$t != "" && a.gsx$nom.$t != "//" && a.gsx$nom != " " && a.gsx$status.$t != "Détruite" && !isNaN(a.gsx$overworldx.$t)) {
        return a;
      }
    });
    shops_data.sort(function(a, b) {
      return a.gsx$overworldy.$t - b.gsx$overworldy.$t;
    });
    redo();
  })




function showSearch() {
  if (window.innerWidth <= 1650) {
    document.getElementById("select").style.maxHeight = "none";
    document.getElementById("select").style.display = "block";
    document.getElementById("map_select").style.margin = "30px";
    document.getElementById("search").style.margin = "0 30px 15px 30px";
    document.getElementById("info").style.height = "0";
    document.getElementById("close").style.display = "block";
    document.getElementById("data_select").style.height = "calc(100vh - 85px)";
  }
}

function closeSearch() {
  document.getElementById("select").style = "";
  document.getElementById("select").style = "";
  document.getElementById("map_select").style = "";
  document.getElementById("search").style = "";
  document.getElementById("info").style = "";
  document.getElementById("close").style = "";
  document.getElementById("data_select").style = "";
}


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
  if (window.innerWidth >= 1650) {
    closeSearch();
  }
  if (map.getBoundingClientRect().height != map_size) {
    redo();
  }
}

function redo() {
  map_size = map.getBoundingClientRect().height;
  load(map_size);
}


function click_two(x, db, type) {

  desc.style.position = "";


  if (type == "villes") {
    name.innerHTML = db[x].gsx$nom.$t;
    if (db[x].gsx$description != "//" || db[x.gsx$description != ".."]) {
      desc.innerHTML = db[x].gsx$description.$t;
      desc.classList.remove("none");
    } else {
      desc.classList.add("none");
    }
    if (db[x].gsx$fondateur.$t && db[x].gsx$fondateur.$t != "//") {
      fon.classList.remove("none");
      if (db[x].gsx$date.$t && db[x].gsx$date.$t != "//") {
        fon.innerHTML = "Fondée en " + db[x].gsx$date.$t + " par " + db[x].gsx$fondateur.$t;
      } else {
        fon.innerHTML = "Fondée par " + db[x].gsx$fondateur.$t;
      }
    } else if (db[x].gsx$date.$t && db[x].gsx$date.$t != "//") {
      fon.classList.remove("none");
      fon.innerHTML = "Fondée en " + db[x].gsx$date.$t;
    } else {
      fon.classList.add("none");
    }
    if (db[x].gsx$architecturegeneral.$t && db[x].gsx$architecturegeneral.$t != "//") {
      arch.classList.remove("none");
      if (db[x].gsx$architecturedetail.$t && db[x].gsx$architecturedetail.$t != "//") {
        arch.innerHTML = "Architecture: " + db[x].gsx$architecturegeneral.$t + ", " + db[x].gsx$architecturedetail.$t;
      } else {
        arch.innerHTML = "Architecture: " + db[x].gsx$architecturegeneral.$t;
      }
    } else {
      arch.classList.add("none");
    }
    if (db[x].gsx$maire.$t && db[x].gsx$maire.$t != "//") {
      ma.classList.remove("none");
      ma.innerHTML = "Maire actuel: " + db[x].gsx$maire.$t;
    } else {
      ma.classList.add("none");
    }
    if (db[x].gsx$point.$t && db[x].gsx$point.$t != "//") {
      way.classList.remove("none");
      way.innerHTML = "Adresse du nether: " + db[x].gsx$point.$t + " " + db[x].gsx$sortie.$t + " " + db[x].gsx$direction.$t;
    } else {
      way.classList.add("none");
    }
    if (db[x].gsx$populationactuel && isNaN(db[x].gsx$populationactuel.$t)) {
      db[x].gsx$populationactuel.$t = db[x].gsx$populationactuel.$t = db[x].gsx$populationactuel.$t.split(" ").join("").split(",").length;
    }
    if (db[x].gsx$populationtotal && isNaN(db[x].gsx$populationtotal.$t) && db[x].gsx$populationtotal) {
      db[x].gsx$populationtotal.$t = db[x].gsx$populationtotal.$t = db[x].gsx$populationtotal.$t.split(" ").join("").split(",").length;
    }
    if (db[x].gsx$populationinactif && isNaN(db[x].gsx$populationinactif.$t)) {
      db[x].gsx$populationinactif.$t = db[x].gsx$populationinactif.$t = db[x].gsx$populationinactif.$t.split(" ").join("").split(",").length;
    }
    if (db[x].gsx$populationbanni && isNaN(db[x].gsx$populationbanni.$t)) {
      db[x].gsx$populationbanni.$t = db[x].gsx$populationbanni.$t = db[x].gsx$populationbanni.$t.split(" ").join("").split(",").length;
    }
    if (db[x].gsx$populationparti && isNaN(db[x].gsx$populationparti.$t)) {
      db[x].gsx$populationparti.$t = db[x].gsx$populationparti.$t = db[x].gsx$populationparti.$t.split(" ").join("").split(",").length;
    }
    if (db[x].gsx$populationactuel.$t && db[x].gsx$populationactuel.$t != "//") {
      pop.classList.remove("none");
      if (db[x].gsx$populationtotal.$t && db[x].gsx$populationtotal.$t != "//") {
        pop.innerHTML = "Population actuel: " + db[x].gsx$populationactuel.$t + " sur " + db[x].gsx$populationtotal.$t;
      } else {
        pop.innerHTML = "Population actuel: " + db[x].gsx$populationactuel.$t;
      }
    } else if (db[x].gsx$populationtotal.$t && db[x].gsx$populationtotal.$t != "//") {
      pop.classList.remove("none");
      pop.innerHTML = "Population total: " + db[x].gsx$populationtotal.$t;
    } else {
      pop.classList.add("none");
    }
    if (db[x].gsx$image1.$t.startsWith("https")) {
      if (db[x].gsx$image1.$t.startsWith("https://media.discordapp.net/attachments/")) {
        document.getElementById("background").style.backgroundImage = "url(" + db[x].gsx$image1.$t + "?width=600&height=200)";
      } else {
        document.getElementById("background").style.backgroundImage = "url(" + db[x].gsx$image1.$t + ")";
      }
      document.getElementById("background").style.opacity = ".75";
      loadGallery(x, db);
    } else {
      document.getElementById("background").style = "";
      loadGallery(x, db);
    }
  } else if (type == "shops") {
    name.innerHTML = db[x].gsx$nom.$t;
    if (db[x].gsx$description != "//" || db[x.gsx$description != ".."]) {
      desc.innerHTML = db[x].gsx$description.$t;
      desc.classList.remove("none");
    } else {
      desc.classList.add("none");
    }
    if (db[x].gsx$fondateur.$t && db[x].gsx$fondateur.$t != "//") {
      fon.classList.remove("none");
      if (db[x].gsx$date.$t && db[x].gsx$date.$t != "//") {
        fon.innerHTML = "Fondée en " + db[x].gsx$date.$t + " par " + db[x].gsx$fondateur.$t;
      } else {
        fon.innerHTML = "Fondée par " + db[x].gsx$fondateur.$t;
      }
    } else if (db[x].gsx$date.$t && db[x].gsx$date.$t != "//") {
      fon.classList.remove("none");
      fon.innerHTML = "Fondée en " + db[x].gsx$date.$t;
    } else {
      fon.classList.add("none");
    }
    arch.classList.add("none");
    ma.classList.add("none");
    if (db[x].gsx$point.$t && db[x].gsx$point.$t != "//") {
      way.classList.remove("none");
      way.innerHTML = "Adresse du nether: " + db[x].gsx$point.$t + " " + db[x].gsx$sortie.$t + " " + db[x].gsx$direction.$t;
    } else {
      way.classList.add("none");
    }
    pop.classList.add("none");
    var background = new Image();
    if (db[x].gsx$image1.$t.startsWith("https")) {
      if (db[x].gsx$image1.$t.startsWith("https://media.discordapp.net/attachments/")) {
        document.getElementById("background").style.backgroundImage = "url(" + db[x].gsx$image1.$t + "?width=600&height=200)";
      } else {
        document.getElementById("background").style.backgroundImage = "url(" + db[x].gsx$image1.$t + ")";
      }
      document.getElementById("background").style.opacity = ".75";
      loadGallery(x, db);
    } else {
      document.getElementById("background").style = "";
      loadGallery(x, db);
    }
  } else if (type == "claims") {
    name.innerHTML = db[x].gsx$nom.$t;
    name.innerHTML = db[x].gsx$nom.$t;
    desc.innerHTML = "Coordonnée: " + db[x].gsx$description.$t;
    desc.classList.remove("none");
    desc.style.position = "absolute";
  }
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
        if (div.localName == "p" && show_tag) {
          div.classList.remove("none");
        }
      }
      actual_selected = "";
      document.getElementById(x).classList.remove("selected");
      // name.innerHTML = "&#160"
      desc.classList.add("none");
      fon.classList.add("none");
      ma.classList.add("none");
      arch.classList.add("none");
      way.classList.add("none");
      pop.classList.add("none");
      document.getElementById("gallery_page").innerHTML = "";
      // document.getElementById("background").style = "";
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
    document.getElementById("gallery_page").innerHTML = "";
    document.getElementById("background").style.backgroundImage = "url(./files/spawnv2.jpg)";
    document.getElementById("background").style.opacity = ".25";
    switch (document.getElementById("db").value) {
      case "villes":
        click_two(x, villes_data, "villes");
        break;
      case "shops":
        click_two(x, shops_data, "shops");
        break;
      case "claims":
        click_two(x, claims_data, "claims");
        break;
    }
    background = "";
    actual_selected = x;
  }
}



function loadGallery(x, db) {
  for (var i = 1; i < 11; i++) {
    if (db[x]["gsx$image" + i].$t) {
      var img = document.createElement("img");
      img.src = db[x]["gsx$image" + i].$t;
      document.getElementById("gallery_page").appendChild(img);
    }
  }
}


function mapType() {
  if (!lite_map) {
    map.src = lite_map_img.src;
    document.getElementById("maptype").classList.add("check");
  } else {
    map.src = map_img.src;
    document.getElementById("maptype").classList.remove("check");
  }
  lite_map = !lite_map;
}

function showTag() {
  if (!show_tag) {
    document.getElementById("showtag").classList.add("check");
  } else {
    document.getElementById("showtag").classList.remove("check");
  }
  show_tag = !show_tag;
  load(map_size);
}



function showOnly() {
  if (!show_only) {
    document.getElementById("showonly").classList.add("check");
  } else {
    document.getElementById("showonly").classList.remove("check");
  }
  show_only = !show_only;
  load(map_size);
}

function showColor() {
  if (!show_color) {
    document.getElementById("showcolor").classList.add("check");
  } else {
    document.getElementById("showcolor").classList.remove("check");
  }
  show_color = !show_color;
  load(map_size);
}

function showNether() {
  if (!show_nether) {
    document.getElementById("nether").classList.remove("none");
      document.getElementById("shownether").classList.add("check");
  } else {
    document.getElementById("nether").classList.add("none");
      document.getElementById("shownether").classList.remove("check");
  }
  show_nether = !show_nether;
  load(map_size);
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

function startSearch() {
  switch (document.getElementById("db").value) {
    case "villes":
      updateSearch(villes_data);
      break;
    case "shops":
      updateSearch(shops_data);
      break;
    case "claims":
      updateSearch(claims_data);
      break;
  }
}

function updateSearch(db) {
  document.getElementById("data_list").innerHTML = "";
  var value = document.getElementById("search").value.toLowerCase();
  for (var i = 0; i < db.length; i++) {
    if (db[i].gsx$nom.$t.toLowerCase().includes(value)) {
      if (show_only) {
        if (db[i].gsx$status.$t.toLowerCase() != "active" && db[i].gsx$status.$t.toLowerCase() != "actif") {
          continue;
        }
      }
      var c = document.createElement("h3");
      c.innerHTML = db[i].gsx$nom.$t;
      c.id = i;
      c.onclick = async function() {
        click(this.id);
      }
      document.getElementById("data_list").appendChild(c);
    }
  }
}


function loadPoint(db) {
  for (var i = 0; i < db.length; i++) {
    if (show_only) {
      if (db[i].gsx$status.$t.toLowerCase() != "active" && db[i].gsx$status.$t.toLowerCase() != "actif") {
        continue;
      }
    }
    var div = document.createElement("div");
    var point = document.createElement("div");
    var name = document.createElement("p");
    name.innerHTML = db[i].gsx$nom.$t;
    div.classList.add("data");
    point.classList.add("point");
    point.style.transform = "scale(1)";
    point.title = db[i].gsx$nom.$t;

    if (show_color) {
      if (db[i].gsx$status.$t) {
        point.classList.add(db[i].gsx$status.$t.toLowerCase().replace(new RegExp("[é]", 'g'), "e"));
      } else {
        point.classList.add("idk");
      }
    }

    if (darray) {
      point.style.transform = "scale(" + (0.75 + darray[i] * 4) + ")";
      point.style.borderWidth = 4 - (3 * darray[i]) + "px";



      // point.style.height = (100 * darray[i] + 10) + "px";
      // point.style.width = (100 * darray[i] + 10) + "px";
      // point.style.transform =  "translateY(-50%)"
    }



    div.style.left = (Math.floor(db[i].gsx$overworldx.$t) + pmc_size) / (pmc_size * 2 / map_size) + "px";
    div.style.top = (Math.floor(db[i].gsx$overworldy.$t) + pmc_size) / (pmc_size * 2 / map_size) + "px";
    div.onclick = async function() {
      click(this.id);
    }
    div.id = i;
    div.appendChild(point);
    warpoints.appendChild(div);
    name.id = "name" + i;
    name.classList.add("name");
    name.style.left = (Math.floor(db[i].gsx$overworldx.$t) + pmc_size) / (pmc_size * 2 / map_size) + "px";
    name.style.top = (Math.floor(db[i].gsx$overworldy.$t) + pmc_size) / (pmc_size * 2 / map_size) + "px";
    name.style.animationDuration = (Math.random() * (0.7 - 0.3)) + 0.4 + "s";
    if (!show_tag) {
      name.classList.add("none");
    }
    warpoints.appendChild(name);
    updateSearch(db);
  }
}


function newMap() {
  darray = [];
  dname = "";
  load();
}



function idkhownameit(db, x) {
  console.log(dname);
  console.log(x);
  darray = [];
  if (dname.split("")[1] == x) {
    dname = "";
  } else {

    switch (x) {

      case 0:
        dname = "h0"
        for (var i = 0; i < db.length; i++) {
          if (isNaN(db[i].gsx$populationactuel.$t)) {
            darray.push(db[i].gsx$populationactuel.$t.split(",").length);
          } else {
            darray.push(Math.floor(db[i].gsx$populationactuel.$t));
          }
        }
        var max = Math.max(...darray);
        darray = darray.map(x => x / max);
        document.getElementById("h0").classList.add("check");
        break;

      case 1:
        dname = "h1"
        for (var i = 0; i < db.length; i++) {
          if (isNaN(db[i].gsx$populationtotal.$t)) {
            darray.push(db[i].gsx$populationtotal.$t.split(",").length);
          } else {
            darray.push(Math.floor(db[i].gsx$populationtotal.$t));
          }
        }
        var max = Math.max(...darray);
        darray = darray.map(x => x / max);
        document.getElementById("h1").classList.add("check");
        break;

      case 2:
        dname = "h2"
        for (var i = 0; i < db.length; i++) {
          darray.push(db[i].gsx$total.$t);
        }
        var max = Math.max(...darray);
        darray = darray.map(x => x / max);
        document.getElementById("h2").classList.add("check");
        break;

      case 3:
        dname = "h3"
        for (var i = 0; i < db.length; i++) {
          if (db[i].gsx$date.$t == "") {
            darray.push(2020);
          } else {
            darray.push(db[i].gsx$date.$t);
          }
        }
        var max = Math.max(...darray);
        darray = darray.map(x => Math.abs(x - max));
        darray = darray.map(x => x / (max - 2015));


        document.getElementById("h3").classList.add("check");
        break;


      case 4:
        dname = "h4"
        for (var i = 0; i < db.length; i++) {
          darray.push(db[i].gsx$nom.$t.split(" bloc")[0]);
        }
        var max = Math.max(...darray);
        darray = darray.map(x => x / max);


        document.getElementById("h4").classList.add("check");
        break;

    }
  }
  load(map_size);
}




function load(map_size) {
  for (var div of warpoints.children) {
    if (div.localName == "p") {
      div.classList.remove("none");
    }
  }
  name.innerHTML = "&#160"
  desc.innerHTML = "";
  fon.innerHTML = "";
  ma.innerHTML = "";
  arch.innerHTML = "";
  way.innerHTML = "";
  pop.innerHTML = "";
  document.getElementById("gallery_page").innerHTML = "";
  document.getElementById("background").style = "";
  warpoints.innerHTML = "";


  document.getElementById("option_data").innerHTML = "";
  switch (document.getElementById("db").value) {




    case "villes":

      name.innerHTML = "Les villes";
      document.getElementById("background").style.backgroundImage = "url(./files/villesbg.jpg)";

      document.getElementById("insert_text").classList.add("none");
      loadPoint(villes_data);



      for (var i = 0; i < 4; i++) {
        var h = document.createElement("h3");
        h.id = "h" + i;
        h.onclick = function() {
          idkhownameit(villes_data, Math.floor(this.id.split("")[1]));
        }
        switch (i) {
          case 0:
            h.innerHTML = "Population actuel";
            break;
          case 1:
            h.innerHTML = "Population total";
            break;
          case 2:
            h.innerHTML = "Batiments";
            break;
          case 3:
            h.innerHTML = "Date de création";
            break;
        }
        if (dname == h.id) {
          h.classList.add("check");
        }
        document.getElementById("option_data").appendChild(h);
      }
      break;





    case "shops":
      name.innerHTML = "Les commerces";
      document.getElementById("background").style.backgroundImage = "url(./files/shopsbg.jpg)";


      document.getElementById("insert_text").classList.add("none");
      loadPoint(shops_data);

      for (var i = 0; i < 4; i++) {
        var h = document.createElement("h3");
        h.id = "h" + i;
        h.onclick = function() {
          idkhownameit(villes_data, Math.floor(this.id.split("")[1]));
        }
        switch (i) {
          case 3:
            h.innerHTML = "Date de création";
            break;
        }
        if (dname == h.id) {
          h.classList.add("check");
        }
        if (h.innerHTML != "") {
          document.getElementById("option_data").appendChild(h);
        }
      }
      break;


    case "claims":

      name.innerHTML = "La claimslist";



      document.getElementById("insert_text").classList.remove("none");
      var claims_data_temp = document.getElementById("insert_text").value;
      claims_data_temp = claims_data_temp.split("\n");
      claims_data_temp = claims_data_temp.filter(function(a) {
        return a;
      });
      claims_data = [];
      claims_data_temp.forEach((item, i) => {
        claims_data[i] = {
          gsx$nom: {
            $t: item.split("(-")[1].split(")")[0]
          },
          gsx$description: {
            $t: "x: " + item.split("x")[1].split(",")[0] + " y: " + item.split("z")[1].split(" ")[0]
          },
          gsx$status: {
            $t: "active"
          },
          gsx$overworldx: {
            $t: item.split("x")[1].split(",")[0]
          },
          gsx$overworldy: {
            $t: item.split("z")[1].split(" ")[0]
          }
        };
      });
      claims_data.sort(function(a, b) {
        return a.gsx$overworldy.$t - b.gsx$overworldy.$t;
      });
      // console.log(claims_data_temp);
      // console.log(claims_data);
      loadPoint(claims_data);
      for (var i = 0; i < 5; i++) {
        var h = document.createElement("h3");
        h.id = "h" + i;
        h.onclick = function() {
          idkhownameit(claims_data, Math.floor(this.id.split("")[1]));
        }
        switch (i) {
          case 4:
            h.innerHTML = "Blocs";
            break;
        }
        if (dname == h.id) {
          h.classList.add("check");
        }
        if (h.innerHTML != "") {
          document.getElementById("option_data").appendChild(h);
        }
      }
      break;
  }
}
