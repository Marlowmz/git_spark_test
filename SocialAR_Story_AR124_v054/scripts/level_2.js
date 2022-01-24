const S = require('Scene');
const M = require('Materials');
const R = require('Reactive');
const P = require('Patches');
const A = require('Animation');
const Tm = require('Time');
export const D = require('Diagnostics');
export {Level_2}

function sleep(ms) {
  return new Promise(resolve => Tm.setTimeout(resolve, ms));
}
function Level_2(args){
  var that = {};
  that.input_sequence = "";
  that.materials = args.materials;
  that.controller = args.controller;
  that.progress = args.progress;
  that.anim_controller = args.anim_controller;
  that.controller_speed_in = args.controller_speed_in; //pass out through a loop so we can use a set + hold expsmooth or decay function w easing
  that.controller_speed_out = args.controller_speed_out;
  that.controller_play = args.controller_play;
  that.controller_stop = args.controller_stop;
  that.controller_restart = args.controller_restart;
  that.round_index = 0;
  that.success_duration = 300;
  that.input_blocked = true;
  that.promises = [];
  that.level_2_snowee = args.level_2_snowee;
  that.instructions = args.instruction_manager;
  that.arrow_mat = args.arrow_mat;
  P.inputs.setScalar("arrow_setting",-1);
  that.arrow_mat.setParameter("fade",0);
  that.rounds = [
    {name:"setup",timecode:155/477,onrails:true},
    {name:"first_ball",timecode:192/477,onrails:false},
    {name:"second_setup",timecode:308/477,onrails:true},
    {name:"second_ball",timecode:378/477,onrails:false},
    {name:"settle_in",timecode:415/477,onrails:true},
  ];

  that.start = function(_args){
    //mask all but the top button
    that.buttons.right.masked = true;
    that.buttons.left.masked = true;
    that.buttons.up.masked = false;
    that.on_completed = _args.on_completed; //CB passed in from outside    
    that.controller.on_change =that.on_change;
    that.controller.on_message = that.on_message;
    P.inputs.setScalar("hide_buttons",0);
    P.inputs.setPulse(that.controller_stop,R.once());
    P.inputs.setPulse(that.controller_restart,R.once());
    Tm.setTimeout(function(){
      that.evaluate_round();
    },400);
  }

  that.evaluate_round = function(){
    //HANDLE ROUNDS
    if(that.round_index < that.rounds.length){
      var current_round = that.rounds[that.round_index]; //grab current round

      if(current_round.name =="first_ball")that.instructions.show("now stack",3000);
      that.clear_promises();
      if(current_round.onrails){
        that.clear_promises();
        that.arrow_mat.setParameter("fade",0);
        P.inputs.setScalar("button_U_confirm",1);
        P.inputs.setScalar("button_D_confirm",1);
        P.inputs.setScalar("button_L_confirm",1);
        P.inputs.setScalar("button_R_confirm",1);
        P.inputs.setScalar("arrow_setting",-1);
        that.input_blocked = true;
        P.inputs.setPulse(that.controller_play,R.once());
        P.inputs.setScalar(that.controller_speed_out,1);
      }else{
        that.clear_promises();
        // that.instructions.show("look up",3000);
        P.inputs.setScalar("arrow_setting",2);

        var show_hint_promise = Tm.setTimeout(function(){that.arrow_mat.setParameter("fade",1);},3000);
        that.promises.push(show_hint_promise);

        P.inputs.setScalar("button_U_confirm",0);
        P.inputs.setScalar("button_D_confirm",0);
        P.inputs.setScalar("button_L_confirm",0);
        P.inputs.setScalar("button_R_confirm",0); 
        that.input_blocked = false;
        P.inputs.setPulse(that.controller_stop,R.once());
        P.inputs.setScalar(that.controller_speed_out,1);//start off with no movement
      }

      //CONFIGURE NEXT STEP BREAKPOINT
      D.log(current_round.name); //returns ie "setup"/"first round"/ "second round setup" / "etc"
      var timecode_subscription = that.progress.ge(current_round.timecode).onOn().subscribe(function(){
        P.inputs.setPulse(that.controller_play,R.once());
        that.round_index ++;
        that.broadcast_progress();
        that.evaluate_round();
        timecode_subscription.unsubscribe();
        //UNSUBSCRIBE THIS SUBSCRIPTION
      });
    }
    else{
      that.end();//FINISH UP
    }
    
  }

  that.end = async function(){
    //tell everyone we finished up
    that.round_index ++;
    that.broadcast_progress();
    //unmask the buttons
    that.buttons.right.masked = false;
    that.buttons.left.masked = false;
    that.buttons.up.masked = false;
    P.inputs.setScalar("arrow_setting",-1);
    var sampler = A.samplers.easeInOutSine(0,1);
    var fade_time_driver = A.timeDriver({
      durationMilliseconds:500,
      mirror:false,
      loopCount:1
    });
    var fade_anim = A.animate(fade_time_driver,sampler);
    var inverted_fade = R.val(1).sub(fade_anim)
    that.materials.head.setParameter("fade",inverted_fade);
    that.materials.torso.setParameter("fade",inverted_fade);
    that.materials.base.setParameter("fade",inverted_fade);
    that.materials.assembled.setParameter("fade",fade_anim);
    fade_time_driver.start();
    P.inputs.setScalar("hide_buttons",1);
    var move_time_driver = A.timeDriver({
      durationMilliseconds:1500,
      mirror:false,
      loopCount:1
    });
    var move_anim = A.animate(move_time_driver,sampler);

    var move_position = that.level_2_snowee.transform.position.pinLastValue().mix(R.vector(0.012,-.1,0),move_anim);//horizontal position must match same in patch view
    that.level_2_snowee.transform.position = move_position;

    var move_scale = that.level_2_snowee.transform.scale.pinLastValue().mix(R.vector(5,5,5),move_anim);
    that.level_2_snowee.transform.scale = move_scale;
    await sleep(1000);
    move_time_driver.start();
    that.input_blocked = true;
    await sleep(1500);
    that.instructions.show("well done",3000);
    await sleep(4000);
    that.instructions.show("say hi",3000);
    await sleep(4000);
    that.on_completed();//call the callback passed in on 'that.start(_args)'
    P.inputs.setPulse(that.controller_restart,R.once());
    P.inputs.setPulse(that.controller_stop,R.once());
    
  }
  that.advance = function(){
    that.clear_promises();
    P.inputs.setPulse(that.controller_play,R.once());
    var stop_again_promise = Tm.setTimeout(function(){
      P.inputs.setPulse(that.controller_stop,R.once());
    },that.success_duration);
    that.promises.push(stop_again_promise);
  }
  that.broadcast_progress=function(){
    that.controller.send_message({
      type:"level_2_progress",
      round:that.round_index
    })
  };
  that.on_change = function(state){
    if(!that.input_blocked){
      if(state.up){
        that.arrow_mat.setParameter("fade",0);
        that.clear_promises();        
        that.advance();        
        that.controller.send_message({
          type:"level_2_advance"
        })
        var show_hint_promise = Tm.setTimeout(function(){that.arrow_mat.setParameter("fade",1);},3000);
        that.promises.push(show_hint_promise);
      }
    }else{      
      P.inputs.setPulse(that.controller_play,R.once());
    }
  }

  that.on_message = function(msg){
    D.log(msg);
    if(msg.type == "level_2_advance"){
      that.advance();
    }else if(msg.type=="level_2_progress"){
      if(msg.round > that.round_index){P.inputs.setPulse(that.controller_play,R.once());that.input_blocked = true;}//if someone is ahead of us, play out whatever remains for us
    }
  }
  that.clear_promises = function(){
    that.promises.forEach(function(p){
      Tm.clearTimeout(p);
    });
  }
  return that;
}