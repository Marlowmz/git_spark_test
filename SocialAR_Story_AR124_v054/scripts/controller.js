
const Participants = require('Participants');
const Mp = require('Multipeer');
const Tm = require('Time');
const D = require('Diagnostics')
export {Controller}


async function Controller(args){
  //SETUP
  /*
  this is the controller interface
  it takes in network and input data
  and turns it into usable signals
  */
  var that = {};
  that.channel = await Mp.getMessageChannel("snowee");
  that.channel.onMessage.subscribe(function(msg){
    that.message_received(msg);
  });
  that.state = {
    left:false,
    right:false,
    up:false,
    down:false,
    peers:[]
  }
  that.myID = Math.random();
  that.other_users = [];
  that.preferred_turn_order = [];
  that.am_leader=false;
  that.initiate_checkin = function(iterations){
    that.send_message({
      type:"checkin"
    })
    if(iterations>0){
      Tm.setTimeout(function(){
        that.initiate_checkin(iterations-1);
      },1000)      
    }else{
      that.detect_participants();
    }
  }
  that.player_count = function(){
    return that.other_users.length+1;
  }

  //TODO create a bunch of network hooks for which of these functions to call based on which network message comes in.
  that.input_pressed = function(key){
    //before input change
    if(key == "left"){
      that.left_pressed();
    }else if(key == "right"){
      that.right_pressed();
    }else if(key == "up"){
      that.up_pressed();      
    }else if(key == "down"){
      that.down_pressed();      
    }
    that.on_change(that.state);
    //after input change
  }
  that.input_released = function(key){
    //before input change
    if(key == "left"){
      that.left_released();
    }else if(key == "right"){
      that.right_released();
    }else if(key == "up"){
      that.up_released();      
    }else if(key == "down"){
      that.down_released();      
    }
    that.on_change(that.state);
    //after input change
  }

  that.left_pressed = function(){
    that.state.left = true;
  }

  that.left_released = function(){
    that.state.left = false;
  }

  that.right_pressed = function(){
    that.state.right = true;
  }

  that.right_released = function(){
    that.state.right = false;
  }

  that.up_pressed = function(){
    that.state.up = true;
  }

  that.up_released = function(){
    that.state.up = false;
  }

  that.down_pressed = function(){
    that.state.down = true;
  }

  that.down_released = function(){
    that.state.down = false;
  }

  that.message_received = function(msg){
    //MODIFY THE STATE SOMEHOW
    if(msg.type == "checkin"){
      var usr = msg.UID;
      if(that.other_users.includes(usr)){
      }
      else{
        D.log("adding user "+usr)
        that.other_users.push(usr);
      }
    }else if(msg.type =="player_order"){
      that.final_turn_order = msg.order;
      D.log("the final_turn_order is")
      D.log(that.final_turn_order)

    }else{
      that.on_message(msg);
    }
  }

  that.send_message = function(msg){
    msg.UID = that.myID;
    that.channel.sendMessage(msg);
  }
  that.on_change = function(){}
  that.on_message = function(st,msg){}  

  that.detect_participants =function(){   
    var observed_players = that.other_users.slice();
    observed_players.push(that.myID);
    observed_players.sort();
    if(observed_players[0] == that.myID){
      D.log("I am the leader")
      that.am_leader=true;
    }else{
      D.log("I am not the leader")
      that.am_leader=false;
    }
    that.preferred_turn_order = [];
    while(observed_players.length > 0){
      var random_index = Math.floor(Math.random()*observed_players.length);
      var individual = observed_players.splice(random_index,1)
      that.preferred_turn_order.push(individual);
    }
    if(that.am_leader){
      that.send_message({
        type:"player_order",
        order:that.preferred_turn_order
      });
      that.final_turn_order = that.preferred_turn_order;
    }
    D.log(that.preferred_turn_order);
  }

  that.initiate_checkin(10);
  return that;
}