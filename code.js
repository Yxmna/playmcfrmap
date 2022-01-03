const map = document.getElementById("map");
const map_lite = document.getElementById("map_lite");
const area = document.getElementById("area");
const menu = document.getElementById("menu");
const warpoints = document.getElementById("warpoints");



const version = "1.4";
const map_img = new Image();
const lite_map_img = new Image();
const image_bg = new Image();
const villes = "https://api.airtable.com/v0/appyIbyBTngKp9P86/Villes";
const shops = "https://api.airtable.com/v0/appyIbyBTngKp9P86/Shops";
const fetch_option = {
  headers: {
    "Authorization": "Bearer keylcqMaVYO2fQnQQ",
    "Content-Type": "application/json",
  }
}

var map_size = 6144;
var x_off = 0;
var y_off = 0;
var darray = [];
var dname = "";
var lite_map = false;
var show_tag = true;
var show_color = false;
var show_only_active = false;
var show_nether = false;
var villes_data = new Object;
var shops_data = new Object;
var claims_data = [];
var pmc_size = 6144;
var db = [];
var offset = "";
const maps = {
  oldgear: {
    width: 1280,
    zoom: 0,
    x_off: -800,
    y_off: 440
  }
}



console.log("version: " + version);


function start() {
  console.log("> start");
  lite_map_img.src = "./files/map_s1.png";
  lite_map_img.onload = function() {
    map.src = lite_map_img.src;
    map_img.src = "./files/map.jpg";
    map_img.onload = function() {
      map.src = this.src;
    };
  };
  setupDb();
}


function getData(url, offset) {
  console.log("> getData");
  if (offset) {
    // console.log("offset");
    fetch(url + "?offset=" + offset, fetch_option)
      .then(function(res) {
        return res.json();
      })
      .then(function(obj) {
        let temp = obj.records;
        temp = temp.map(item => item.fields);
        db = db.concat(temp);
        if (obj.offset) {
          // console.log("next");
          getData(url, obj.offset)
        } else {
          // console.log("finish");
          loadPoint();
          updateSearch();
        }
      });
  } else {
    // console.log("no offset");
    fetch(url, fetch_option)
      .then(function(res) {
        return res.json();
      })
      .then(function(obj) {
        let temp = obj.records;
        temp = temp.map(item => item.fields);
        db = db.concat(temp);
        if (obj.offset) {
          getData(url, obj.offset)
        } else {
          // console.log("finish");
          loadPoint();
          updateSearch();
        }
      });
  }
}


function setupDb() {
  console.log("> setupDb");
  map_size = 6144;
  const datecreation = document.getElementById("datecreation");
  const populationactuel = document.getElementById("populationactuel");
  const populationtotal = document.getElementById("populationtotal");
  const batiments = document.getElementById("batiments");
  const blocs = document.getElementById("blocs");
  const insert_logs = document.getElementById("insert_logs");
  const insert_data = document.getElementById("insert_data");
  insert_logs.classList.add("none");
  insert_data.classList.add("none");
  datecreation.classList.add("none");
  populationactuel.classList.add("none");
  populationtotal.classList.add("none");
  batiments.classList.add("none");
  blocs.classList.add("none");
  document.getElementById("select_map").classList.add("none");
  document.getElementById("warpoints").innerHTML = "";
  db = [];
  ChangeArray();
  switch (document.getElementById("db").value) {
    case "villes":
      getData(villes);
      datecreation.classList.remove("none");
      populationactuel.classList.remove("none");
      populationtotal.classList.remove("none");
      batiments.classList.remove("none");
      break;
    case "shops":
      getData(shops);
      datecreation.classList.remove("none");
      break;
    case "claims":
      blocs.classList.remove("none");
      insert_logs.classList.remove("none");
      var claims_data_temp = document.getElementById("insert_logs").value;
      if (claims_data_temp && claims_data_temp.includes("(-")) {
        claims_data_temp = claims_data_temp.split("\n");
        claims_data_temp = claims_data_temp.filter(function(a) {
          return a;
        });
        claims_data_temp.forEach((item, i) => {
          if (item.includes(": : ")) {
            db[i] = {
              nom: item.split(": : ")[0].split("monde2: ")[1],
              description: "<a target='_blank' href='http://dynmap.play-mc.fr:1872/?worldname=monde2&mapname=perspective2&zoom=6&x=" + item.split("x")[1].split(",")[0] + "&y=64&z=" + item.split("z")[1].split(" ")[0] + "'>Coordonnée: x: " + item.split("x")[1].split(",")[0] + " y: " + item.split("z")[1].split(" ")[0] + " (" + item.split("(-")[1].split("blocks")[0] + "blocs)</a>",
              status: "active",
              overworld_x: item.split("x")[1].split(",")[0],
              overworld_y: item.split("z")[1].split(" ")[0],
            };
          } else {
            db[i] = {
              nom: "??",
              description: "<a target='_blank' href='http://dynmap.play-mc.fr:1872/?worldname=monde2&mapname=perspective2&zoom=6&x=" + item.split("x")[1].split(",")[0] + "&y=64&z=" + item.split("z")[1].split(" ")[0] + "'>Coordonnée: x: " + item.split("x")[1].split(",")[0] + " y: " + item.split("z")[1].split(" ")[0] + " (" + item.split("(-")[1].split("blocks")[0] + "blocs)</a>",
              status: "active",
              overworld_x: item.split("x")[1].split(",")[0],
              overworld_y: item.split("z")[1].split(" ")[0],
            };
          }
        });
        db.sort(function(a, b) {
          return a.overworld_y - b.overworld_y;
        });
        loadPoint();
        updateSearch();
      }

      break;
    case "claimsgestion":
      insert_data.classList.remove("none");
      document.getElementById("select_map").classList.remove("none");
      map_size = 160;
      x_off = maps[document.getElementById("maps").value].x_off;
      y_off = maps[document.getElementById("maps").value].y_off;
      map.src = "./maps/" + document.getElementById("maps").value + ".png";
      var claims_data_temp = document.getElementById("insert_data").value;
      if (claims_data_temp && claims_data_temp.includes(":") && claims_data_temp.includes(",") && claims_data_temp.includes("(")) {
        claims_data_temp = claims_data_temp.split("\n");
        claims_data_temp = claims_data_temp.filter(function(a) {
          return a;
        });
        claims_data_temp.forEach((item, i) => {
          item = item.replace(/\s/g, '');
          switch (item.split(":")[0]) {
            case "BEACON":
              db[i] = {
                nom: item.split("(")[1].split(")")[0],
                description: "Coordonnée: x" + item.split(":")[1].split(",")[0] + " y: " + item.split(":")[1].split(",")[1] + ", Tier:" + item.split(",")[2].split("(")[0],
                type: "beacon" + item.split(",")[2].split("(")[0],
                status: "active",
                overworld_x: item.split(":")[1].split(",")[0],
                overworld_y: item.split(":")[1].split(",")[1],
              };
              break;
          }
        });
      }

      loadPoint();
      updateSearch();
      break;

  }
  loadData();
}

function loadPoint() {
  console.log("> loadPoint");
  document.getElementById("data_list").innerHTML = "";
  document.getElementById("warpoints").innerHTML = "";
  db = db.sort(function(a, b) {
    return (a.overworld_y ?? 0) - (b.overworld_y ?? 0);
  })
  for (var i = 0; i < db.length; i++) {
    if (show_only_active) {
      if (!db[i].status || (db[i].status.toLowerCase() != "active" && db[i].status.toLowerCase() != "actif")) {
        continue;
      }
    }
    if (!db[i].overworld_x || !db[i].overworld_y) {
      continue;
    }
    var div = document.createElement("div");
    var point = document.createElement("div");
    var name = document.createElement("p");
    name.innerHTML = db[i].nom;
    if (!show_tag || !db[i].nom) {
      name.classList.add("none");
    }
    div.classList.add("data");
    point.classList.add("point");
    point.style.transform = "scale(1)";
    point.title = db[i].nom;
    if (show_color) {
      if (db[i].status) {
        point.classList.add(db[i].status.toLowerCase().replace(new RegExp("[é]", 'g'), "e"));
      } else {
        point.classList.add("idk");
      }
    }
    if (darray) {
      point.style.transform = "scale(" + (0.75 + darray[i] * 4) + ")";
      point.style.borderWidth = 4 - (3 * darray[i]) + "px";
    }
    div.style.left = mcReal(Math.floor(db[i].overworld_x) - x_off) + "px";
    div.style.top = mcReal(Math.floor(db[i].overworld_y) - y_off - 8) + "px";
    div.onclick = async function() {
      click(this.id);
    }
    div.id = i;
    if (db[i].type && db[i].type.includes("beacon")) {
      point.classList.add(db[i].type);
    }
    div.appendChild(point);
    warpoints.appendChild(div);
    name.id = "name" + i;
    name.classList.add("name");
    name.style.left = mcReal(db[i].overworld_x) + "px";
    name.style.top = mcReal(db[i].overworld_y) + "px";
    name.style.animationDuration = (Math.random() * (0.7 - 0.3)) + 0.4 + "s";
    warpoints.appendChild(name);

    var c = document.createElement("h3");
    c.innerHTML = db[i].nom;
    c.id = "list_" + i;
    c.onclick = async function() {
      click(this.id.split("_")[1]);
    }
    document.getElementById("data_list").appendChild(c);
  }
  updateSearch();
}

function click(id) {
  console.log("> click");
  if (document.getElementById(id) && document.getElementById(id).classList.contains("selected")) {
    loadPoint();
    loadData();
    return;
  }
  if (area.classList.contains("zoom")) {
    zoom(true);
    setTimeout(function() {
      click(id);
    }, 600);
    return;
  }
  loadPoint();
  for (var div of warpoints.children) {
    if (div.localName == "p") {
      div.classList.add("none");
    }
  }
  document.getElementById("list_" + id).classList.add("selected");
  document.getElementById(id).classList.add("selected");
  document.getElementById("name" + id).classList.add("name_selected");
  if (document.getElementById("name" + id).innerHTML != "") {
    document.getElementById("name" + id).classList.remove("none");
  }
  loadData(id);
}

function loadData(id) {
  console.log("> loadData");
  const name = document.getElementById("name");
  const description = document.getElementById("description");
  const comment = document.getElementById("comment");
  const foundation = document.getElementById("foundation");
  const king = document.getElementById("king");
  const detail = document.getElementById("detail");
  const way = document.getElementById("way");
  const number = document.getElementById("number");
  const background = document.getElementById("background");
  image_bg.src = "";
  switch (document.getElementById("db").value) {
    case "villes":
      name.innerHTML = "Les villes";
      background.style.backgroundImage = "url(./files/villesbg.jpg)";
      break;
    case "shops":
      name.innerHTML = "Les commerces";
      background.style.backgroundImage = "url(./files/shopsbg.jpg)";
      break;
    case "claims":
      name.innerHTML = "La claimlist";
      background.style.backgroundImage = "url(./files/spawnv2.jpg)";
      description.innerHTML = "&#160";
      description.classList.remove("none");
      break;
    case "claimsgestion":
      name.innerHTML = "Gestion de claims";
      background.style.backgroundImage = "url(./files/spawnv2.jpg)";
      break;
  }
  if (!id) {
    if (document.getElementById("db").value != "claims") {
      description.classList.add("none");
    }
    comment.classList.add("none");
    foundation.classList.add("none");
    king.classList.add("none");
    detail.classList.add("none");
    way.classList.add("none");
    number.classList.add("none");
    document.getElementById("gallery_page").innerHTML = "";
    document.getElementById("background").style.opacity = ".25";
    return;
  }
  name.innerHTML = db[id].nom;
  if (db[id].description) {
    description.innerHTML = db[id].description;
    description.classList.remove("none");
  } else {
    description.classList.add("none");
  }
  if (db[id].commentaire && db[id].commentaire) {
    comment.innerHTML = db[id].commentaire;
    comment.classList.remove("none");
  } else {
    comment.classList.add("none");
  }
  if (db[id].fondateur && db[id].fondateur) {
    foundation.classList.remove("none");
    if (db[id].date && db[id].date) {
      foundation.innerHTML = "Fondée en " + db[id].date + " par " + db[id].fondateur;
    } else {
      foundation.innerHTML = "Fondée par " + db[id].fondateur;
    }
  } else if (db[id].date && db[id].date) {
    foundation.classList.remove("none");
    foundation.innerHTML = "Fondée en " + db[id].date;
  } else {
    foundation.classList.add("none");
  }
  if (db[id].architecturegeneral && db[id].architecturegeneral) {
    detail.classList.remove("none");
    if (db[id].architecturedetail && db[id].architecturedetail != "//") {
      detail.innerHTML = "Architecture: " + db[id].architecturegeneral + ", " + db[id].architecturedetail;
    } else {
      detail.innerHTML = "Architecture: " + db[id].architecturegeneral;
    }
  } else {
    detail.classList.add("none");
  }
  if (db[id].maire && db[id].maire && db[id].maire != "//") {
    king.classList.remove("none");
    king.innerHTML = "Maire actuel: " + db[id].maire;
  } else if (db[id].gerant && db[id].gerant && db[id].gerant != "//") {
    king.classList.remove("none");
    king.innerHTML = "Gérant actuel: " + db[id].gerant;
  } else {
    king.classList.add("none");
  }
  if (db[id].point && db[id].point) {
    way.classList.remove("none");
    way.innerHTML = "Adresse du nether: " + db[id].point + " " + db[id].sortie + " " + db[id].direction;
  } else {
    way.classList.add("none");
  }
  if (db[id].pop_actuel && db[id].pop_actuel) {
    number.classList.remove("none");
    if (db[id].pop_total) {
      number.innerHTML = "Population actuel: " + db[id].pop_actuel + " sur " + db[id].pop_total;
    } else {
      number.innerHTML = "Population actuel: " + db[id].pop_actuel;
    }
  } else if (db[id].pop_total && db[id].pop_total) {
    number.classList.remove("none");
    number.innerHTML = "Population total: " + db[id].pop_total;
  } else {
    number.classList.add("none");
  }
  if (db[id].image1 && db[id].image1.startsWith("https")) {
    if (db[id].image1.startsWith("https://media.discordapp.net/attachments/")) {
      image_bg.src = db[id].image1 + "?width=600&height=200";
    } else {
      image_bg.src = db[id].image1;
    }
    image_bg.onload = function() {
      background.style.backgroundImage = "url(" + image_bg.src + ")";
    }
    background.style.opacity = ".75";
    loadGallery(id);
  } else {
    switch (document.getElementById("db").value) {
      case "villes":
        background.style.backgroundImage = "url(./files/villesbg.jpg)";
        break;
      case "shops":
        background.style.backgroundImage = "url(./files/shopsbg.jpg)";
        break;
      case "claims":
        background.style.backgroundImage = "url(./files/spawnv2.jpg)";
        break;
    }
    background.style.opacity = ".25";
    loadGallery(id);
  }
}

function loadGallery(id) {
  console.log("> loadGallery");
  document.getElementById("gallery_page").innerHTML = "";
  for (var i = 1; i < 11; i++) {
    if (db[id]["image" + i] && db[id]["image" + i]) {
      var img = document.createElement("img");
      img.src = db[id]["image" + i];
      document.getElementById("gallery_page").appendChild(img);
    }
  }
}

function zoom(noReload) {
  console.log("> zoom");
  warpoints.innerHTML = "";
  if (area.classList.contains("zoom")) {
    menu.classList.remove("none");
    area.classList.remove("zoom");
    document.getElementById("body").style.overflowY = "hidden";
  } else {
    menu.classList.add("none");
    area.classList.add("zoom");
    document.getElementById("body").style.overflowY = "auto";
  }
  if (!noReload) {
    setTimeout(function() {
      loadPoint();
    }, 600);
  }
}

function ChangeArray(type) {
  console.log("> changeArray");
  const datecreation = document.getElementById("datecreation");
  const populationactuel = document.getElementById("populationactuel");
  const populationtotal = document.getElementById("populationtotal");
  const batiments = document.getElementById("batiments");
  const blocs = document.getElementById("blocs");
  darray = [];
  if (!type) {
    return;
  }
  if (document.getElementById(type).classList.contains("check")) {
    document.getElementById(type).classList.remove("check");
    darray = [];
    loadPoint();
    return;
  }
  populationactuel.classList.remove("check");
  populationtotal.classList.remove("check");
  batiments.classList.remove("check");
  blocs.classList.remove("check");
  datecreation.classList.remove("check");
  document.getElementById(type).classList.add("check");
  switch (type) {
    case "populationactuel":
      for (var i = 0; i < db.length; i++) {
        if (!db[i].pop_actuel) {
          darray.push(0);
        } else {
          darray.push(Math.floor(db[i].pop_actuel));
        }
      }
      var max = Math.max(...darray);
      darray = darray.map(x => x / max);
      populationactuel.classList.add("check");
      break;
    case "populationtotal":
      for (var i = 0; i < db.length; i++) {
        if (isNaN(db[i].pop_total)) {
          darray.push(0);
        } else {
          darray.push(Math.floor(db[i].pop_total));
        }
      }
      var max = Math.max(...darray);
      darray = darray.map(x => x / max);
      populationtotal.classList.add("check");
      break;
    case "batiments":
      for (var i = 0; i < db.length; i++) {
        if (db[i].batiment_total) {
          darray.push(db[i].batiment_total);
        } else {
          darray.push(0);
        }
      }
      var max = Math.max(...darray);
      darray = darray.map(x => x / max);
      batiments.classList.add("check");
      break;
    case "datecreation":
      for (var i = 0; i < db.length; i++) {
        if (!db[i].date) {
          darray.push(2022);
        } else {
          darray.push(db[i].date);
        }
        datecreation.classList.add("check");
      }
      var max = Math.max(...darray);
      darray = darray.map(x => Math.abs(x - max));
      darray = darray.map(x => x / (max - 2015));
      datecreation.classList.add("check");
      break;
    case "blocs":
      for (var i = 0; i < db.length; i++) {
        console.log(db[i].description);
        darray.push(db[i].description.split(" (")[1].split(" bloc")[0]);
      }
      var max = Math.max(...darray);
      darray = darray.map(x => x / max);
      blocs.classList.add("check");
      break;
  }
  loadPoint();
}

function changeMapType() {
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
  loadPoint();
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
  loadPoint();
}

function showOnly() {
  if (!show_only_active) {
    document.getElementById("showonly").classList.add("check");
  } else {
    document.getElementById("showonly").classList.remove("check");
  }
  show_only_active = !show_only_active;
  loadPoint();
  updateSearch();
}

function showColor() {
  if (!show_color) {
    document.getElementById("showcolor").classList.add("check");
  } else {
    document.getElementById("showcolor").classList.remove("check");
  }
  show_color = !show_color;
  loadPoint();
}

function changePage(x) {
  console.log("> changePage");
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


function closeSearch() {
  document.getElementById("select").style = "";
  document.getElementById("select").style = "";
  document.getElementById("map_select").style = "";
  document.getElementById("search").style = "";
  document.getElementById("info").style = "";
  document.getElementById("close").style = "";
  document.getElementById("data_select").style = "";
}


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


function updateSearch() {
  console.log("> updateSearch");
  // document.getElementById("data_list").innerHTML = "";
  // var value = document.getElementById("search").value.toLowerCase();
  // for (var i = 0; i < db.length; i++) {
  //   if (db[i].nom.toLowerCase().includes(value)) {
  //     if (show_only_active) {
  //       if (!db[i].status || (db[i].status.toLowerCase() != "active" && db[i].status.toLowerCase() != "actif")) {
  //         continue;
  //       }
  //     }
  //     var c = document.createElement("h3");
  //     c.innerHTML = db[i].nom;
  //     c.id = "list_" + i;
  //     c.onclick = async function() {
  //       click(this.id.split("_")[1]);
  //     }
  //     document.getElementById("data_list").appendChild(c);
  //   }
  // }
  var value = document.getElementById("search").value.toLowerCase();
  document.getElementById("data_select").children[1].childNodes.forEach((item, i) => {
    if (item.innerHTML) {
      if (!item.innerHTML.toLowerCase().includes(value)) {
        item.classList.add("none");
      } else {
        item.classList.remove("none");
      }
    }
  });

}

function showCoordinates(e) {
  document.getElementById("coor").innerHTML = "x: " + realMc(e.layerX) + " y: " + realMc(e.layerY);
}

function realMc(x) {
  return Math.floor((Math.floor(x) * pmc_size * 2 / document.getElementById("map").offsetWidth) - pmc_size);

}

function mcReal(x) {
  return (Math.floor(x) + map_size) / (map_size * 2 / document.getElementById("map").offsetWidth);
}
