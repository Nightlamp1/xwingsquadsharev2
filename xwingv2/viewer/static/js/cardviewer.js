//pilots in pilots array


$(document).ready(function(){
  //Generate ship list
  var rebels = ["Rebel Alliance","Resistance"];
  var empire = ["Galactic Empire", "First Order"];
  var rebelShips = populateShipArray(pilots,rebels);
  var empireShips = populateShipArray(pilots,empire);
  var scumShips = populateShipArray(pilots,["Scum and Villainy"]);
  generateShipDropdowns(rebelShips,"Rebels");
  generateShipDropdowns(empireShips,"Empire");
  generateShipDropdowns(scumShips,"Scum");

  //Iterate over pilot objects array to populate dropdowns
  for(i=0;i<pilots.length;i++){
    //Populate html dropdowns with pilots from respective factions
    var listString = "<li><a onclick=updateViewer("+pilots[i].id+ ");>" + pilots[i].name + "</a></li>";
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

function updateViewer(pilot){
  var currentPilot = $.grep(pilots, function(e){ return e.id == pilot; });
  console.log("Made it into function");
  console.log(currentPilot[0].name);
  //BUILD THIS OUT
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

function generateShipDropdowns(shipArray,faction){
  var htmlString = "";
  for(i=0;i<shipArray.length;i++){
    var shipID = shipArray[i].replace(/\s/g, '');
    shipID = shipID.replace("(","");
    shipID = shipID.replace(")","");
    shipID = shipID.replace("/","");
    console.log(shipID);
    htmlString += '<div class="dropdown">' +
                  '<button class="btn btn-default dropdown-toggle" type="button" id='+ shipID +
                  ' data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">' + shipArray[i] +
                  ' <span class="caret"> </span> </button>' +
                  '<ul class="dropdown-menu" aria-labelledby=' + shipID + ' id=' + shipID +
                  'pilots' + faction + '></ul></div>';
  }
  $("#"+faction).append(htmlString);
}
