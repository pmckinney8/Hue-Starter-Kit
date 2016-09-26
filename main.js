$(document).ready(function(){
 var internal_ip;
 var hue_user_name;
 var hue_api_key;
 var num_of_lights = 0;
 var toggle_lights = false
 var loop_status = "colorloop"

$('#manipulate_lights').hide();

 // listener for when the find ip button is pressed
$('#find_ip').click(function(){

 // ajax (get) request to receive the ip address of the bridge
 $.get("https://www.meethue.com/api/nupnp", function(res){
   if(res[0]['internalipaddress']){
    internal_ip = res[0]['internalipaddress']
    $('#your_ip').text(internal_ip)
   }
 },"json")

})

// set the user name to get your api key back
$('#set_user_name').click(function(){
 hue_user_name = $('#username').val()

 $.ajax({
   method: "POST",
   url: "http://"+ internal_ip +"/api",
   data:JSON.stringify({devicetype:"my_hue_app#" + hue_user_name})
 })
   .done(function( res ) {
     if(res[0]['error']){
      $('#api_key').text("You must click the middle button on the hue bridge first")
     }else if (res[0]['success']){
      hue_api_key = res[0]['success']['username']
      $('#api_key').text(hue_api_key)

      // show the manipulate_lights sections
      $('#manipulate_lights').show();

      // get info about all of the connected lights
      show_light_info();
     }

   });

})


// Allows you to customize a particular light
$('#change_light').click(function(){
 var light_num = $('#light').val();
 var on_off_status = $('#on_off').val();
 var light_status;
 if(on_off_status == 'false'){
  light_status = false
 }else{
  light_status = true
 }

 var saturation = $('#saturation').val();
 var hue = $('#hue').val();
 var brightness = $('#brightness').val();

 $.ajax({
   method: "Put",
   url: "http://"+ internal_ip +"/api/"+ hue_api_key +"/lights/"+ light_num +"/state",
   data:JSON.stringify({ on : light_status , sat: parseInt(saturation), bri: parseInt(brightness), hue: parseInt(hue)})
 })
   .done(function( res ) {
     show_light_info()
   });

})


// Toggles all of the lights on and off
$("#toggle_lights").click(function(){
 $.ajax({
   method: "Put",
   url: "http://"+ internal_ip +"/api/"+ hue_api_key +"/groups/0/action",
   data:JSON.stringify({ on : toggle_lights})
 })
   .done(function( res ) {
     toggle_lights = !toggle_lights
     show_light_info()
   });

})


// Sets a color loop for a all lights
$("#color_loop").click(function(){
 $.ajax({
   method: "Put",
   url: "http://"+ internal_ip +"/api/"+ hue_api_key +"/groups/0/action",
   data:JSON.stringify({ effect : loop_status})
 })
   .done(function( res ) {

    if(loop_status == "colorloop"){
     loop_status = "none"
    }else{
     loop_status = "colorloop"
    }

   });

})


// FUNCTIONS

function show_light_info(){
 $('#table_body').html("");

 // Grabs information about all of the lights connected to your hue bridge
 $.get('http://'+ internal_ip +'/api/'+ hue_api_key +'/lights', function(res){

  for(light in res){
   num_of_lights += 1
   var row = "<tr><td>" + res[light]['name'] + "</td><td>"+ res[light]['state']['on'] + "</td><td>"+ res[light]['state']['bri'] + "</td><td>"+ res[light]['state']['sat'] + "</td><td>" + res[light]['state']['hue'] + "</td></tr>";
   $('#table_body').append(row);
  }
  set_lights_input();
 },'json')

}

// Sets the correct amount of inputs for the bottom form
function set_lights_input(){
 $('#light').html("");
 for(var i = 0; i < num_of_lights; i++){
  var num = i + 1;
  $('#light').append("<option>"+ num +"</option>");
 }
}




})

// -HURFyu7gzAHleHL1zZZMCYFOwZBQJpyMuapUflT
