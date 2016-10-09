//pilots in pilots array

var ships = {}
$(document).ready(function(){
  //Generate ship list
  ships.rebels = populateShipArray(pilots,["Rebel Alliance","Resistance"]);
  ships.empire = populateShipArray(pilots,["Galactic Empire", "First Order"]);
  ships.scum = populateShipArray(pilots,["Scum and Villainy"]);
});

function selectFaction(faction){
  currentShips = ships[faction];
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
