//pilots in pilots array


$(document).ready(function(){
  //Iterate over pilot objects array to populate dropdowns
  for(i=0;i<pilots.length;i++){
    //Populate html dropdowns with pilots from respective factions
    var listString = "<li><a onclick=updateViewer("+pilots[i].id+ ");>" + pilots[i].name + "</a></li>";
    
    if(pilots[i].faction == "Rebel Alliance" || pilots[i].faction == "Resistance"){
      $("#RebelPilots").append(listString);
    }else if(pilots[i].faction == "Galactic Empire" || pilots[i].faction == "First Order"){
      $("#EmpirePilots").append(listString);
    }else if(pilots[i].faction == "Scum and Villainy"){
      $("#ScumPilots").append(listString);
    }
  }
});

function updateViewer(pilot){
  var currentPilot = $.grep(pilots, function(e){ return e.id == pilot; });
  console.log("Made it into function");
  console.log(currentPilot[0].name);
}
