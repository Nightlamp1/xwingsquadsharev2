//pilots in pilots array
//ships in ships array

var shipsByFaction = {}
$(document).ready(function(){
  //Generate ship list by faction
  shipsByFaction.rebels = populateShipArray(pilots,["Rebel Alliance","Resistance"]);
  shipsByFaction.empire = populateShipArray(pilots,["Galactic Empire", "First Order"]);
  shipsByFaction.scum = populateShipArray(pilots,["Scum and Villainy"]);
  //Default faction is rebels. Populate necessary HTML for rebel ships/pilots
  generateHtml(shipsByFaction["rebels"],"rebels");
});

function selectFaction(faction){
  currentShips = shipsByFaction[faction];
  generateHtml(currentShips,faction);
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


function generateHtml(shipList,faction){
  var factionConversion = {
    "Rebel Alliance": "rebels",
    "Resistance": "rebels",
    "Galactic Empire": "empire",
    "First Order": "empire",
    "Scum and Villainy": "scum"
  };

  var $outterdiv = $("<div>", {
    "class":"panel-group",
    id:"accordian",
    "role":"tablist",
    "aria-multiselectable":"true"
  });

  for(i=0;i<shipList.length;i++){
    var ship = $.grep(ships, function(e){ return e.name == shipList[i]; });
    shipxws = ship[0].xws;

    var $temp = $("#template").clone();
    $temp.attr('id','ship'+shipxws);
    $temp.find("#headingOne").attr('id',shipxws);
    $temp.find('a').attr({'href':'#c'+shipxws, 'aria-controls':"c"+shipxws});
    $temp.find('a').text(ship[0].name);
    $temp.find('#collapseOne').attr({'id':"c"+shipxws,'aria-labelledby':shipxws});

    var $pilots = $temp.find("#ship-pilots")
    var pilotList = $.grep(pilots, function(pilot){ return pilot.ship == shipList[i]; });
    for(j=0;j<pilotList.length;j++){
      if(factionConversion[pilotList[j].faction] == faction){
      $pilots.append("<li><a onclick=addPilotToSquad(" + pilotList[j].id + ")>" +
                      pilotList[j].name + "</a></li>");
    }}
    $outterdiv.append($temp);
  }
  $("#pilots").html($outterdiv);
}

//adding a pilot to the squad
function addPilotToSquad(pilotId){
  var currentPilot = $.grep(pilots, function(e){ return e.id == pilotId; });
  var $temp = $("#selected-pilot-template").clone();
  var $upgrade = $("#upgrade-slot-template").clone();
  var pilotUpgradeSlots = currentPilot[0].slots;
  if($.inArray('Modification',pilotUpgradeSlots)==-1){
    pilotUpgradeSlots.push('Modification');
  }
  //need to come up with id scheme that allows multiple pilots
  $temp.find(".squad-pilot").attr('src','../static/xwing-data/images/'+currentPilot[0].image);
  $temp.attr('id',currentPilot[0].xws);//need to randomify

  populateAllUpgradeDropdowns($temp,$upgrade,currentPilot,pilotUpgradeSlots);

  $("#currentsquad").prepend($temp);
}

//add upgrade to selected pilot
function selectUpgrade(upgrade,p){
  var htmlObjectId = $(p).attr('id');
  var selected = $.grep(upgrades, function(e){ return e.id == upgrade});
  var upgradeImageLocation = '../static/xwing-data/images/' + selected[0].image;
  $('#' + htmlObjectId + 'slot').html('<img class="upgrade" src="' + upgradeImageLocation + '">' +
                                      '<button class="btn btn-danger" onclick="removeUpgrade(' +
                                      htmlObjectId + 'slot' + ',' + upgrade + ')"><span class="glyphicon glyphicon-remove"></span></button>');
}

//remove an upgrade from pilot
function removeUpgrade(pilot,upgrade){
  var upgradeObject = $.grep(upgrades, function(e){ return e.id == upgrade});
  upgradeObject = upgradeObject[0];
  divObjectId = $(pilot).attr('id');
  $("#"+divObjectId).empty();
  populateOneUpgradeDropdown(divObjectId,upgradeObject);
  console.log("remove it!");
  console.log(divObjectId);
  console.log(upgradeObject.slot);
}

function populateAllUpgradeDropdowns($temp,$upgrade,currentPilot,pilotUpgradeSlots){
  //create a button for every upgrade type the current pilot has available
  for(i=0;i<pilotUpgradeSlots.length;i++){
    var $currentUpgrade = $upgrade.clone();
    var upgradeSlotName = pilotUpgradeSlots[i];
    var availableUpgrades = $.grep(upgrades, function(e){ return e.slot == upgradeSlotName});
    $currentUpgrade.attr('id',currentPilot[0].xws + upgradeSlotName + i + 'slot');
    $currentUpgrade.find('#upgrade-type-pilot').text(upgradeSlotName);
    $currentUpgrade.find('#upgrade-type-pilot').attr('id',currentPilot[0].xws + upgradeSlotName + i);
    $currentUpgrade.find('.dropdown-template').attr('class','dropdown');

    //populate dropdowns with all upgrades of the current type
    for(j=0;j<availableUpgrades.length;j++){
        var pilot = currentPilot[0].xws;
        var upgradeName = availableUpgrades[j].name;
        var upgradeHtmlId = pilot + upgradeSlotName + i
        var selectUpgradeCall = 'selectUpgrade(' + availableUpgrades[j].id + ',' + upgradeHtmlId + ')';
        $currentUpgrade.find('#upgrade-list').append("<li id='temp'><a href='#'>" + upgradeName + "</a></li>");
        $currentUpgrade.find('#temp').attr({'id':upgradeHtmlId,
                                            'onclick':selectUpgradeCall});
        $temp.append($currentUpgrade);
    }
  }
}

function populateOneUpgradeDropdown(upgradeSlotObjectId,upgradeObject){
  innerHtmlId = upgradeSlotObjectId.slice(0,-4);
  var $dropdownList = $('.dropdown-template').clone();
  var availableUpgrades = $.grep(upgrades, function(e){ return e.slot == upgradeObject.slot});
  $dropdownList.find('#upgrade-type-pilot').text(upgradeObject.slot);
  $dropdownList.find('#upgrade-type-pilot').attr('id',innerHtmlId);
  $dropdownList.attr('class','dropdown');

  for(j=0;j<availableUpgrades.length;j++){
      var upgradeName = availableUpgrades[j].name;
      var selectUpgradeCall = 'selectUpgrade(' + availableUpgrades[j].id + ',' + innerHtmlId + ')';
      $dropdownList.find('#upgrade-list').append("<li id='temp'><a href='#'>" + upgradeName + "</a></li>");
      $dropdownList.find('#temp').attr({'id':innerHtmlId,
                                          'onclick':selectUpgradeCall});
  }
  $('#'+upgradeSlotObjectId).append($dropdownList);
}
