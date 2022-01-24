const S = require('Scene');
const M = require('Materials');
const R = require('Reactive');
const P = require('Patches');
const A = require('Animation');
const Tm = require('Time');
export const D = require('Diagnostics');
export {StateManager}


function sleep(ms) {
  return new Promise(resolve => Tm.setTimeout(resolve, ms));
}

function StateManager(args){
  var that = {};

  that.intro_animation = args.intro_animation;
  that.controller = args.controller;
  that.level = "intro"; //intro, level_1, level_2, level_3, outro
  that.stage = "intialization"; //initialization, game_loop, outro
  that.level_1 = args.level_1;
  that.level_2 = args.level_2;
  that.level_3 = args.level_3;
  that.level_4_null = args.level_4_null;
  that.outro_animation_null = args.outro_animation_null;
  that.instructions = args.instruction_manager;
  that.intro_start = function(){
    that.level = "intro";
    that.stage = "intialization";
    D.log(`entering ${that.level} ${that.stage}`);

    P.inputs.setScalar("hide_buttons",1);//hide the buttons
    that.intro_animation.controller.reset();
    that.intro_animation.controller.looping =false;
    that.intro_animation.controller.playing = true;//play back the intro animation
    var intro_clip_length = that.intro_animation.clip.duration.pinLastValue()*1000;
    var intro_clip_padding = 5000;
    Tm.setTimeout(function(){
      that.level_1_instructions();
    },intro_clip_length+intro_clip_padding);
  }


  that.level_1_instructions = async function(){
    that.level = "level_1";
    that.stage = "instructions";
    D.log(`entering ${that.level} ${that.stage}`);
    var instruction_hold_time = 5000;
    P.inputs.setPulse("hide_intro",R.once())
    await sleep(1000);
    that.instructions.show("use your",3000);
    await sleep(1500);    
    that.instructions.show("look left",3000);
    await sleep(4000);
    that.instructions.show("green light",3000);
    await sleep(4000);
    that.instructions.show("get ready",3000);
    await sleep(4000);
    that.instructions.show("make snowballs",3000);
    await sleep(2000);
    that.instructions.show("roll ball",3000);
    await sleep(2000);
    that.level_1_game_loop();
  }
  //IS CALLED AFTER TIME DELAY
  that.level_1_game_loop = function(){
    that.level = "level_1";
    that.stage = "game_loop";
    Tm.setTimeout(function(){that.instructions.show("move sync",3000)},3000);
    D.log(`entering ${that.level} ${that.stage}`);
    that.level_1.start({
      on_completed:function(){that.level_1_outro()}//when the game considers itself complete, it moves on
    });

  }


  //IS CALLED BY SUCCESS FUNCTION OF LVL 1 GAME LOOP
  that.level_1_outro = function(){
    that.level = "level_1";
    that.stage = "outro";
    D.log(`entering ${that.level} ${that.stage}`);
    //ball exits stage
    //time delay
    that.level_2_initialization();
  }

  //IS CALLED BY LVL 1 OUTRO AFTER TIME DELAY
  that.level_2_initialization = function(){
    that.level = "level_2";
    that.stage = "intialization";
    D.log(`entering ${that.level} ${that.stage}`);
    that.level_2_game_loop();
    //base snowball enters screen
    //show instruction
    //time delay
  }

  that.level_2_game_loop = function(){
    that.level = "level_2";
    that.stage = "game_loop";
    D.log(`entering ${that.level} ${that.stage}`);
    that.level_2.start({
      on_completed:function(){that.level_2_outro()}//when the game considers itself complete, it moves on
    });
  }

  that.level_2_outro = function(){
    that.level = "level_2";
    that.stage = "outro";
    D.log(`entering ${that.level} ${that.stage}`);
    that.level_3_initialization();
  }
  that.level_3_initialization = function(){
    that.level = "level_3";
    that.stage = "intialization";

    D.log(`entering ${that.level} ${that.stage}`);
    P.inputs.setBoolean("level_3_hidden",false);
    P.inputs.setBoolean("level_2_hidden",true);
    that.level_3_game_loop();
  }

  that.level_3_game_loop = function(){
    that.level = "level_3";
    that.stage = "game_loop";
    that.level_3.start({
      on_completed:function(){that.level_3_outro()}
    });
    D.log(`entering ${that.level} ${that.stage}`);

  }
  that.level_3_outro =async function(){
    P.inputs.setScalar("hide_buttons",1);
    that.level = "level_3";
    that.stage = "outro";
    D.log(`entering ${that.level} ${that.stage}`);
    await sleep(3000);
    //show finished snowperson
    //present option to restart - > if so go to that.level_3_initialization()
    //time delay
    that.level_4_initialization(); 
  }
  that.level_4_initialization = async function(){
    that.level = "level_4";
    that.stage = "intialization";
    that.level_4_null.hidden = false;
    P.inputs.setBoolean("level_4_intro",true);
    await sleep(3000);
    Tm.setTimeout(function(){P.inputs.setBoolean("level_3_hidden",true);},1500);
    P.inputs.setBoolean("level_4_intro",false);
    D.log(`entering ${that.level} ${that.stage}`);
    await sleep(10000);
    that.instructions.show("until next",3000);
    await sleep(1500);
    that.instructions.show("thanks for",3000);
  }
  that.level_4_game_loop = function(){
    that.level = "level_4";
    that.stage = "game_loop";
    D.log(`entering ${that.level} ${that.stage}`);
    //enable sleigh ride control
    //time delay
    that.level_4_null.hidden = true;
    that.level_4_outro();
  }
  that.level_4_outro = async function(){
    that.level = "level_4";
    that.stage = "outro";
    D.log(`entering ${that.level} ${that.stage}`);
    //play back outro animation
    //END

    that.outro_animation_null.hidden = false;
    D.log("game over");
  }

  that.start = function(){that.intro_start();} //RUN SOMETHING ON STARTUP 
  return that;
}

