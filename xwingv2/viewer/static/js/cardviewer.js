//pilots in pilots array


$(document).ready(function(){
  for(i=0;i<pilots.length;i++){
    console.log(pilots[i].faction);
    if(pilots[i].faction == "Rebel Alliance" || pilots[i].faction == "Resistance"){
      $("#RebelPilots").append("<li><a>" + pilots[i].name + "</a></li>");
      console.log("made it in if");
    }
  }
});
