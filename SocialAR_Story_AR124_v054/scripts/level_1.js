
const S = require('Scene');
const M = require('Materials');
const R = require('Reactive');
const P = require('Patches');
const A = require('Animation');
const Tm = require('Time');
export const D = require('Diagnostics');

export {Level_1}

function v3_from_f(f){
  return R.vector(f,f,f);
}

function sleep(ms) {
  return new Promise(resolve => Tm.setTimeout(resolve, ms));
}
function Level_1(args){
  var that ={};
  that.controller = args.controller;
  that.snowball = args.snowball;
  that.locations={};
  that.materials = args.materials;
  that.instructions = args.instruction_manager;
  that.arrow_mat = args.arrow_mat;
  // that.locations["left"]=R.vector(-0.13603,-0.2,0.0);
  // that.locations["right"]=R.vector(0.13603,-0.2,0.0);
  // that.locations["off left"]=R.vector(-0.39042,-0.2,0.0);
  // that.locations["off right"]=R.vector(0.39042,-0.2,0.0);

  that.steps = [];
  that.last_received = [];

  var snowball_step_0_scale = 0.4; //first step
  var snowball_step_3_scale = 1.2; //last step
  var snowball_step_1_scale = snowball_step_0_scale+(snowball_step_3_scale-snowball_step_0_scale)*1/3; //map into even steps
  var snowball_step_2_scale = snowball_step_0_scale+(snowball_step_3_scale-snowball_step_0_scale)*2/3; //map into even steps

  var left = -0.1;
  var right = 0.1;
  var vertical_offset = -0.15;
  var off_left = -0.35;
  var off_right = 0.35;
  var enter_duration=1000;
  var leave_duration=1000;
  var step_duration = 2000;
  that.rounds = [
    {
      name:"first snowball",
      start:{
        from:{position:R.vector(off_left,vertical_offset,0.0),scale:v3_from_f(snowball_step_0_scale)},
        to:{position:R.vector(left,vertical_offset,0.0),scale:v3_from_f(snowball_step_0_scale)},
        duration:enter_duration,
        criteria:"n"
      },
      steps:[
        {
          from:{position:R.vector(left,vertical_offset,0.0),scale:v3_from_f(snowball_step_0_scale)},
          to:{position:R.vector(right,vertical_offset,0.0),scale:v3_from_f(snowball_step_1_scale)},
          duration:step_duration,
          criteria:"r"
        },{
          from:{position:R.vector(right,vertical_offset,0.0),scale:v3_from_f(snowball_step_1_scale)},
          to:{position:R.vector(left,vertical_offset,0.0),scale:v3_from_f(snowball_step_2_scale)},
          duration:step_duration,
          criteria:"l"
        },{
          from:{position:R.vector(left,vertical_offset,0.0),scale:v3_from_f(snowball_step_2_scale)},
          to:{position:R.vector(right,vertical_offset,0.0),scale:v3_from_f(snowball_step_3_scale)},
          duration:step_duration,
          criteria:"r"
        }
      ],
      end:{
        from:{position:R.vector(right,vertical_offset,0.0),scale:v3_from_f(snowball_step_3_scale)},
        to:{position:R.vector(right,vertical_offset*2,0.0),scale:v3_from_f(snowball_step_3_scale)},
        duration:leave_duration,
        criteria:"n"
      }
    },{
      name:"second snowball",
      start:{
        from:{position:R.vector(off_left,vertical_offset,0.0),scale:v3_from_f(snowball_step_0_scale)},
        to:{position:R.vector(left,vertical_offset,0.0),scale:v3_from_f(snowball_step_0_scale)},
        duration:enter_duration,
        criteria:"n"
      },
      steps:[
        {
          from:{position:R.vector(left,vertical_offset,0.0),scale:v3_from_f(snowball_step_0_scale)},
          to:{position:R.vector(right,vertical_offset,0.0),scale:v3_from_f(snowball_step_1_scale)},
          duration:step_duration,
          criteria:"r"
        },{
          from:{position:R.vector(right,vertical_offset,0.0),scale:v3_from_f(snowball_step_1_scale)},
          to:{position:R.vector(left,vertical_offset,0.0),scale:v3_from_f(snowball_step_2_scale)},
          duration:step_duration,
          criteria:"l"
        },{
          from:{position:R.vector(left,vertical_offset,0.0),scale:v3_from_f(snowball_step_2_scale)},
          to:{position:R.vector(right,vertical_offset,0.0),scale:v3_from_f(snowball_step_3_scale)},
          duration:step_duration,
          criteria:"r"
        }
      ],
      end:{
        from:{position:R.vector(right,vertical_offset,0.0),scale:v3_from_f(snowball_step_3_scale)},
        to:{position:R.vector(right,vertical_offset*2,0.0),scale:v3_from_f(snowball_step_3_scale)},
        duration:leave_duration,
        criteria:"n"
      }
    },{
      name:"third snowball",
      start:{
        from:{position:R.vector(off_left,vertical_offset,0.0),scale:v3_from_f(snowball_step_0_scale)},
        to:{position:R.vector(left,vertical_offset,0.0),scale:v3_from_f(snowball_step_0_scale)},
        duration:enter_duration,
        criteria:"n"
      },
      steps:[
        {
          from:{position:R.vector(left,vertical_offset,0.0),scale:v3_from_f(snowball_step_0_scale)},
          to:{position:R.vector(right,vertical_offset,0.0),scale:v3_from_f(snowball_step_1_scale)},
          duration:step_duration,
          criteria:"r"
        },{
          from:{position:R.vector(right,vertical_offset,0.0),scale:v3_from_f(snowball_step_1_scale)},
          to:{position:R.vector(left,vertical_offset,0.0),scale:v3_from_f(snowball_step_2_scale)},
          duration:step_duration,
          criteria:"l"
        },{
          from:{position:R.vector(left,vertical_offset,0.0),scale:v3_from_f(snowball_step_2_scale)},
          to:{position:R.vector(right,vertical_offset,0.0),scale:v3_from_f(snowball_step_3_scale)},
          duration:step_duration,
          criteria:"r"
        }
      ],
      end:{
        from:{position:R.vector(right,vertical_offset,0.0),scale:v3_from_f(snowball_step_3_scale)},
        to:{position:R.vector(right,vertical_offset*2,0.0),scale:v3_from_f(snowball_step_3_scale)},
        duration:leave_duration,
        criteria:"n"
      }
    },
  ];

  that.round_index = 0;
  that.left = false;
  that.right = false;
  that.promises = [];
  that.advance_promises = [];
  that.start = function(_args){
    that.buttons.up.masked = true;
    P.inputs.setScalar("arrow_setting",-1);
    P.inputs.setScalar("hide_buttons",0);
    that.round_index = 0;
    that.input_blocked = true;
    that.on_completed = _args.on_completed;
    that.begin_round();
    that.controller.on_change =that.on_change;
    that.controller.on_message = that.on_message;
    that.player_count = that.controller.player_count();
  }

  that.begin_round = function(){
    that.step_index = -1;
    that.input_blocked = true;
    that.snowball.hidden = false;
    var current_round = that.rounds[that.round_index];
    that.go_from_to(
      current_round.start.from,
      current_round.start.to,
      current_round.start.duration,
      function(){
        that.input_blocked = false;
        that.step_index++;
        that.evaluate_step()
      },
      true);
  }
  that.go_from_to = function(A_transform,B_transform,duration,cb,onRails,hop){
    var current_round = that.rounds[that.round_index];
    var sampler = A.samplers.linear(0,1);
    var A_pos = A_transform.position;
    var B_pos = B_transform.position;

    var A_scale = A_transform.scale;
    var B_scale = B_transform.scale;

    that.timedriver = A.timeDriver({
      durationMilliseconds:duration,
      mirror:false,
      loopCount:1
    });
    // that.timedriver.onCompleted().subscribe(function(e){
    //   D.log(that.timedriver)
    //   cb();
    // });
    var position_anim = A.animate(that.timedriver,sampler).expSmooth(200);
    position_anim.gt(0.99).onOn().subscribe(function(){ 
      that.catchup = false; //reset whether we need to catch up or not    
      cb();
    });

    if(hop){
      var bez = A_pos.add(R.vector(0,.15,0));
      var Q_1 = A_pos.mix(bez,position_anim);
      var Q_2 = bez.mix(B_pos,position_anim);
      that.snowball.transform.position = Q_1.mix(Q_2,position_anim);
    }else{
      that.snowball.transform.position = A_pos.mix(B_pos,position_anim);       
    }

    that.snowball.transform.scale = A_scale.mix(B_scale,position_anim);
    that.snowball.transform.rotation = R.quaternionFromEuler(0,0,that.snowball.transform.x.mul(-45)); 
    if(onRails){
      that.timedriver.start();
    }else{      
      P.inputs.setScalar("button_U_confirm",0);
      P.inputs.setScalar("button_D_confirm",0);
      P.inputs.setScalar("button_L_confirm",0);
      P.inputs.setScalar("button_R_confirm",0);
    }
  }

  that.evaluate_step = function(){
    var current_round = that.rounds[that.round_index];
    that.controller.send_message({
      type:"level_1",
      round:that.round_index,
      step:that.step_index
    }); 
    that.left = false;
    that.right = false;
    that.clear_promises();
    that.clear_advance_promises();
    if(that.step_index < current_round.steps.length) {
      var current_step  = current_round.steps[that.step_index];
      //set arrow direction, mask out invalid buttons
      if(current_step.criteria == "l"){
        that.input_blocked = false;
        P.inputs.setScalar("arrow_setting",0);
        var show_hint_promise = Tm.setTimeout(function(){that.arrow_mat.setParameter("fade",1)},3000);
        that.promises.push(show_hint_promise);
        that.buttons.right.masked = true;
        that.buttons.left.masked = false;
      }
      else if(current_step.criteria == "r"){
        that.input_blocked = false;
        P.inputs.setScalar("arrow_setting",1);
        var show_hint_promise = Tm.setTimeout(function(){that.arrow_mat.setParameter("fade",1)},3000);
        that.promises.push(show_hint_promise);
        that.buttons.left.masked = true;
        that.buttons.right.masked = false;
      }
      else {
        that.input_blocked = true;
        that.arrow_mat.setParameter("fade",0);
        P.inputs.setScalar("arrow_setting",-1);
        that.buttons.right.masked = true;
        that.buttons.left.masked = true;
      }
      that.go_from_to(current_step.from,current_step.to,current_step.duration,function(){
        that.step_index++;
        that.evaluate_step();
      },false);
    }
    else {
      P.inputs.setScalar("arrow_setting",-1);
      that.end_round();
    }
  }

  that.end_round = function(){
    that.input_blocked = true;
    that.snowball.hidden = false;
    var current_round = that.rounds[that.round_index];
    //blink the gems
    P.inputs.setScalar("button_U_confirm",1);Tm.setTimeout(function(){P.inputs.setScalar("button_U_confirm",0);Tm.setTimeout(function(){P.inputs.setScalar("button_U_confirm",1);Tm.setTimeout(function(){P.inputs.setScalar("button_U_confirm",0);},400);},400);},400);
    P.inputs.setScalar("button_D_confirm",1);Tm.setTimeout(function(){P.inputs.setScalar("button_D_confirm",0);Tm.setTimeout(function(){P.inputs.setScalar("button_D_confirm",1);Tm.setTimeout(function(){P.inputs.setScalar("button_D_confirm",0);},400);},400);},400);
    P.inputs.setScalar("button_L_confirm",1);Tm.setTimeout(function(){P.inputs.setScalar("button_L_confirm",0);Tm.setTimeout(function(){P.inputs.setScalar("button_L_confirm",1);Tm.setTimeout(function(){P.inputs.setScalar("button_L_confirm",0);},400);},400);},400);
    P.inputs.setScalar("button_R_confirm",1);Tm.setTimeout(function(){P.inputs.setScalar("button_R_confirm",0);Tm.setTimeout(function(){P.inputs.setScalar("button_R_confirm",1);Tm.setTimeout(function(){P.inputs.setScalar("button_R_confirm",0);},400);},400);},400);
    that.go_from_to(
      current_round.end.from,
      current_round.end.to,
      current_round.end.duration,
      function(){
        that.round_index++;
        that.snowball.hidden = true;
        if(that.round_index < that.rounds.length)that.begin_round();
        else that.end();
      },
      true,
      true);
  }

  that.end= function(){ 
    that.input_blocked = true;
    P.inputs.setScalar("hide_buttons",1);
    P.inputs.setScalar("arrow_setting",-1);
    //unmask the buttons
    that.buttons.up.masked = false;
    that.buttons.left.masked = false;
    that.buttons.right.masked = false;
    that.on_completed();
  }

  that.on_change = function(state){
    if(that.round_index >=0 && that.round_index < that.rounds.length){
      var current_round = that.rounds[that.round_index];
      if(that.step_index < current_round.steps.length && that.step_index >= 0 && !that.input_blocked){
        var current_step = current_round.steps[that.step_index];
        if(state.right){
          if(current_step.criteria=="r"){
            that.arrow_mat.setParameter("fade",0);
            that.clear_promises() 
            var show_hint_promise = Tm.setTimeout(function(){that.arrow_mat.setParameter("fade",1)},3000);
            that.promises.push(show_hint_promise);
            that.advance(true);
          }
        }
        if(state.left){
          if(current_step.criteria=="l"){ 
            that.arrow_mat.setParameter("fade",0); 
            that.clear_promises(); 
            var show_hint_promise = Tm.setTimeout(function(){that.arrow_mat.setParameter("fade",1)},3000);
            that.promises.push(show_hint_promise);
            that.advance(true);          
          }
        }
      }
    }  
  }

  that.advance = function(personal){
    that.clear_advance_promises();
    that.timedriver.start();
    var stop_again_promise = Tm.setTimeout(function(){
      that.timedriver.stop();
    },575);
    that.advance_promises.push(stop_again_promise);
    if(personal)that.controller.send_message({type:"level_1_advance",round:that.round_index,step:that.step_index});
  }


  that.clear_promises = function(){
    that.promises.forEach(function(p){Tm.clearTimeout(p)});
  }
  that.clear_advance_promises = function(){
    that.advance_promises.forEach(function(p){Tm.clearTimeout(p)});
  }
  that.on_message = function(msg){
    //messages are only sent when a change is detected
    that.catchup = false;
    if(msg.round > that.round_index || (msg.step > that.step_index && msg.round >= that.round_index)){ //we need to catch up if we see that someone is on the next round, or if they're on the same round, but a later step
      that.catchup = true;
      that.clear_advance_promises();
      that.timedriver.start();
      that.input_blocked = true;
    }
    else if(msg.type == "level_1_advance" && !that.input_blocked){
      that.advance();
    }
  }

  return that;
}

