//pilots in pilots array


$(document).ready(function(){
  //Generate ship list
  var rebels = ["Rebel Alliance","Resistance"];
  var empire = ["Galactic Empire", "First Order"];
  var rebelShips = populateShipArray(pilots,rebels);
  var empireShips = populateShipArray(pilots,empire);
  var scumShips = populateShipArray(pilots,["Scum and Villainy"]);

  //Iterate over pilot objects array to populate dropdowns
  for(i=0;i<pilots.length;i++){
    //Populate html dropdowns with pilots from respective factions
    var listString = "<li><a onclick=selectPilot("+pilots[i].id+ ");>" + pilots[i].name + "</a></li>";
    var shipID = pilots[i].ship.replace(/\s/g, '') + "pilots";
    shipID = shipID.replace("(","");
    shipID = shipID.replace(")","");
    shipID = shipID.replace("/","");

    if(pilots[i].faction == "Rebel Alliance" || pilots[i].faction == "Resistance"){
      $("#" + shipID + "Rebels").append(listString);
    }else if(pilots[i].faction == "Galactic Empire" || pilots[i].faction == "First Order"){
      $("#" + shipID + "Empire").append(listString);
    }else if(pilots[i].faction == "Scum and Villainy"){
      $("#" + shipID + "Scum").append(listString);
    }
  }
});

function selectFaction(faction){
  console.log(faction);
}

function populateShipArray(pilotArray,factions){
  var shipArray = [];
  for(i=0;i<pilotArray.length;i++){
    if($.inArray(pilotArray[i].ship, shipArray)== -1 && $.inArray(pilotArray[i].faction,factions) != -1){
      shipArray.push(pilotArray[i].ship);
    }
  }
  return shipArray;
}

function selectPilot(pilot){
  console.log(pilot);
}
