//pilots in pilots array object from builder.html
//ships in ships array object from builder.html

var shipsByFaction = {};
var squadCost = 0;
var currentPilotCode = 1;

$(document).ready(function(){
  //Generate ship list by faction
  shipsByFaction.rebels = populateShipArray(pilots,["Rebel Alliance","Resistance"]);
  shipsByFaction.empire = populateShipArray(pilots,["Galactic Empire", "First Order"]);
  shipsByFaction.scum = populateShipArray(pilots,["Scum and Villainy"]);
  //Default faction is rebels. Populate necessary HTML for rebel ships/pilots
  generateHtml(shipsByFaction["rebels"],"rebels");

});

function selectFaction(faction){
  //function called when user clicks on different faction tab on /builder/
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
  squadCost += currentPilot[0].points;
  updateSquadCost();
  var $temp = $("#selected-pilot-template").clone();
  var $upgrade = $("#upgrade-slot-template").clone();
  var pilotUpgradeSlots = currentPilot[0].slots;
  if($.inArray('Modification',pilotUpgradeSlots)==-1){
    pilotUpgradeSlots.push('Modification');
  }
  //need to come up with id scheme that allows multiple of one pilot
  $temp.find(".squad-pilot").attr('src','../static/xwing-data/images/'+currentPilot[0].image);
  $temp.attr('id',currentPilot[0].xws+currentPilotCode);//need to randomify

  populateAllUpgradeDropdowns($temp,$upgrade,currentPilot,pilotUpgradeSlots);
  currentPilotCode+=1;

  $("#currentsquad").prepend($temp);
}

//add upgrade to selected pilot
function selectUpgrade(upgrade,p){
  var htmlObjectId = $(p).attr('id');
  var selected = $.grep(upgrades, function(e){ return e.id == upgrade});
  squadCost += selected[0].points;
  updateSquadCost();
  var upgradeImageLocation = '../static/xwing-data/images/' + selected[0].image;
  $('#' + htmlObjectId + 'slot').html('<img id=' + upgrade + ' class="upgrade" src="' + upgradeImageLocation + '">' +
                                      '<button class="btn btn-danger" onclick="removeUpgrade(' +
                                      htmlObjectId + 'slot' + ',' + upgrade + ')"><span class="glyphicon glyphicon-remove"></span></button>');
}

//remove an upgrade from pilot
function removeUpgrade(pilot,upgrade){
  var upgradeObject = $.grep(upgrades, function(e){ return e.id == upgrade});
  upgradeObject = upgradeObject[0];
  squadCost -= upgradeObject.points;
  updateSquadCost();
  divObjectId = $(pilot).attr('id');
  $("#"+divObjectId).empty();
  populateOneUpgradeDropdown(divObjectId,upgradeObject);
}

function populateAllUpgradeDropdowns($temp,$upgrade,currentPilot,pilotUpgradeSlots){
  //create a button for every upgrade type the current pilot has available
  for(i=0;i<pilotUpgradeSlots.length;i++){
    var $currentUpgrade = $upgrade.clone();
    var upgradeSlotName = pilotUpgradeSlots[i];
    var availableUpgrades = $.grep(upgrades, function(e){ return e.slot == upgradeSlotName});
    $currentUpgrade.attr('id',currentPilot[0].xws + currentPilotCode + upgradeSlotName + i + 'slot');
    $currentUpgrade.find('#upgrade-type-pilot').text(upgradeSlotName);
    $currentUpgrade.find('#upgrade-type-pilot').attr('id',currentPilot[0].xws + upgradeSlotName + i);
    $currentUpgrade.find('.dropdown-template').attr('class','dropdown');

    //populate dropdowns with all upgrades of the current type
    for(j=0;j<availableUpgrades.length;j++){
        var pilot = currentPilot[0].xws + currentPilotCode;
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

$(document).on('click','.remove-pilot', function(){
  var $pilotHtmlObject = $(this).parent().parent();
  var cleanPilotXws = $pilotHtmlObject.attr('id').replace(/\d+$/,"");
  var currentPilot = $.grep(pilots, function(xws){ return xws.xws == cleanPilotXws});
  squadCost -= currentPilot[0].points;
  var selectedUpgrades = $pilotHtmlObject.find('img');
  for(i=0;i<selectedUpgrades.length;i++){
    if(selectedUpgrades[i].id != ""){
      var currentUpgrade = $.grep(upgrades, function(id){ return id.id == selectedUpgrades[i].id});
      squadCost -= currentUpgrade[0].points;
    }
  }
  updateSquadCost();
  $pilotHtmlObject.remove();
});

function updateSquadCost(){
  $("#cost").text('  (' + squadCost + '/100)');
}
