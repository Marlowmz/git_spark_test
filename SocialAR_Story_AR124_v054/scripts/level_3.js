
const S = require('Scene');
const M = require('Materials');
const R = require('Reactive');
const P = require('Patches');
const A = require('Animation');
const Tm = require('Time');
export const D = require('Diagnostics');
export {Level_3}


function sleep(ms) {
  return new Promise(resolve => Tm.setTimeout(resolve, ms));
}
function Level_3(args){

  var that= {};
  that.refresh_items = args.refresh_items;
  that.roll_item = args.roll_item;
  that.place_item = args.place_item;
  that.controller = args.controller;
  that.overwrite_placed_items = args.overwrite_placed_items;
  that.get_placed_items = args.get_placed_items;
  that.input_blocked = true;
  that.item_count = 0;
  that.turn_index = 0;
  that.snowee_focused = true;
  that.instructions = args.instruction_manager;

  that.start = async function(args){
    P.inputs.setScalar("button_U_confirm",0);
    P.inputs.setScalar("button_D_confirm",0);
    P.inputs.setScalar("button_L_confirm",0);
    P.inputs.setScalar("button_R_confirm",0);
    //based on timer now, not driven by touch
    that.buttons.right.masked = true;
    that.buttons.left.masked = true;
    that.buttons.up.masked = true;
    that.input_blocked = true;
    that.item_count = 0;
    that.turn_index = 0;
    that.final_turn_order = that.controller.final_turn_order.slice();
    that.controller.on_change = that.on_change;
    that.controller.on_message = that.on_message;
    that.on_completed = args.on_completed;//CB when done    
    that.instructions.show("snowee needs",3000);  //show instructions "snowee needs a party outfit"
    that.refresh_items();
    await sleep(5000);
    that.input_blocked = (that.controller.myID == that.final_turn_order[that.turn_index])?false:true;

    P.inputs.setScalar("hide_buttons",(that.input_blocked)?1:0);
    if(that.input_blocked) {that.focus_snowee();}
    else {
      that.unfocus_snowee();
      that.instructions.show("your turn",3000);
    }

    if(!that.input_blocked)that.roll_and_place();

      //else show congratulation message+ hide vending setup, wait, call on_complete()
    

  }

  that.on_change = function(state){ //TODO have a timer that races the input - call that.roll_and_place if no input detected within time frame
    if(!that.input_blocked){
      if(state.up || state.left || state.right){        
        that.roll_and_place();
      }      
    }
  }

  that.on_message = function(msg){
    if(msg.type == "level_3_placed_items"){
      that.overwrite_placed_items(msg.items);
      that.item_count++;
      //TODO do something with the picked item info to update others
    }else if(msg.type == "level_3_advance"){
      that.turn_index ++;
      that.turn_index %= that.final_turn_order.length;
      that.next_turn();
    }
  }

  that.focus_snowee = function(){
    if(that.snowee_focused)return;
    that.snowee_focused = true;
    P.inputs.setPulse("level_3_focus_snowee",R.once())
  }

  that.unfocus_snowee = function(){    
    if(!that.snowee_focused)return;
    that.snowee_focused = false;
    P.inputs.setPulse("level_3_unfocus_snowee",R.once())
  }
  that.next_turn = function(){
    D.log("next_turn");

    if(that.item_count >=3){
      that.end();
    }else{
      if(that.final_turn_order[that.turn_index]==that.controller.myID){
        D.log("and it's my turn!")
        that.unfocus_snowee();
        that.instructions.show("your turn",3000);
        P.inputs.setScalar("hide_buttons",0);
        that.input_blocked = false;
      }else{
        that.focus_snowee();
        P.inputs.setScalar("hide_buttons",1);
        that.input_blocked = true;
      }
      if(!that.input_blocked)that.roll_and_place();
    }   
  }


  that.advance = function(){
    that.turn_index ++;
    that.turn_index %= that.final_turn_order.length;
    that.controller.send_message({
      type:"level_3_advance"
    });
    that.next_turn();
  }


  that.broadcast_items = function(){
    var _placed_items = that.get_placed_items()
    that.item_count++;
    that.controller.send_message({
      type:"level_3_placed_items",//TODO send real info
      items:_placed_items
    });
  }
  that.roll_and_place = async function(){
    that.input_blocked = true;
    that.refresh_items();
    await that.roll_item(); //roll a new item
    await sleep(1000);
    await that.place_item();
    await sleep(1000);
    P.inputs.setScalar("hide_buttons",1);
    that.focus_snowee();
    that.broadcast_items();
    await sleep(3000);
    that.advance();
    
    //TODO send a network message to all users saying what we drew
  }

  that.pass_to_next_user = async function(){
    D.log("passing to next"); //TODO actually pass turn on, delete standin code below
    that.refresh_items(); 
  }
  that.end = async function(){
    //TODO send a network message to all users that we're done
    //unmask buttons (should already be unmasked)
    that.buttons.right.masked = false;
    that.buttons.left.masked = false;
    that.buttons.up.masked = false;
    that.focus_snowee();
    that.instructions.show("snowee happy",3000);  //show instructions "snowee is so happy"
    P.inputs.setScalar("hide_buttons",1);
    await sleep(4000);
    that.on_completed(); //GO TO STAGE 4
  }
  return that;
}