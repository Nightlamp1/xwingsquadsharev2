//pilots in pilots array

var shipsByFaction = {}
$(document).ready(function(){
  //Generate ship list
  shipsByFaction.rebels = populateShipArray(pilots,["Rebel Alliance","Resistance"]);
  shipsByFaction.empire = populateShipArray(pilots,["Galactic Empire", "First Order"]);
  shipsByFaction.scum = populateShipArray(pilots,["Scum and Villainy"]);
});

function selectFaction(faction){
  currentShips = shipsByFaction[faction];
  generateHtml(currentShips);
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


function generateHtml(shipList){
  var $outterdiv = $("<div>", {
    "class":"panel-group",
    id:"accordian",
    "role":"tablist",
    "aria-multiselectable":"true"
  });

  for(i=0;i<shipList.length;i++){
    console.log(shipList[i]);
    var shipxws = $.grep(ships, function(e){ return e.name == shipList[i]; });
    shipxws = shipxws[0].xws;

    var $temp = $("#template").clone();
    $temp.attr('id','ship'+shipxws);
    $temp.find("#headingOne").attr('id',shipxws);
    $temp.find('a').attr({'href':'#c'+shipxws, 'aria-controls':"c"+shipxws});
    $temp.find('#collapseOne').attr({'id':"c"+shipxws,'aria-labelledby':shipxws});

    $outterdiv.append($temp);
  }

  $("#pilots").html($outterdiv);
}
