//pilots in pilots array


var shipsByFaction = {};
var squadCost = 0;
var currentPilotCode = 1;


$(document).ready(function(){
  //Generate ship list
  console.log('jheyalkhsdf');
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

function updateViewer(pilotId){
  //find pilot object and update viewer with static image link to display image to user
  //var currentPilot = $.grep(pilots, function(e){ return e.id == pilot; });
  //$("#currentsquad").html("<img src='../static/xwing-data/images/" +currentPilot[0].image + "'>" + "</img>");
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
  var htmlString = '<div class="btn-group-vertical" role="group" aria-label="...">';
  for(i=0;i<shipArray.length;i++){
    var shipID = shipArray[i].replace(/\s/g, '');
    shipID = shipID.replace("(","");
    shipID = shipID.replace(")","");
    shipID = shipID.replace("/","");
    htmlString += '<div class="btn-group" role="group">' +
                  '<button class="btn btn-default dropdown-toggle" type="button" id='+ shipID +
                  ' data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">' + shipArray[i] +
                  ' <span class="caret"> </span> </button>' +
                  '<ul class="dropdown-menu" aria-labelledby=' + shipID + ' id=' + shipID +
                  'pilots' + faction + '></ul></div>';
  }
  htmlString += '</div>';
  $("#"+faction).append(htmlString);
}

function updateSquadCost(){
  $("#cost").text('  (' + squadCost + '/100)');
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
