
const S = require('Scene');
const M = require('Materials');
const D = require('Diagnostics');
const A = require('Animation');
const Tm = require('Time');
export {Instructions}

async function Instructions(){
  var that = {};
  var [
    use_your,
    look_left,
    green_light,
    get_ready,
    make_snowballs,
    roll_ball,
    move_sync,
    next_ball,
    now_stack,
    look_up,
    well_done,
    say_hi,
    snowee_needs,
    your_turn,
    snowee_happy,
    steer_sleigh,
    until_next,
    see_you,
    thanks_for
  ] = await Promise.all([
  S.root.findFirst("use your"),
  S.root.findFirst("look left"),
  S.root.findFirst("green light"),
  S.root.findFirst("get ready"),
  S.root.findFirst("make snowballs"),
  S.root.findFirst("roll ball"),
  S.root.findFirst("move sync"),
  S.root.findFirst("next ball"),
  S.root.findFirst("now stack"),
  S.root.findFirst("look up"),
  S.root.findFirst("well done"),
  S.root.findFirst("say hi"),
  S.root.findFirst("snowee needs"),
  S.root.findFirst("your turn"),
  S.root.findFirst("snowee happy"),
  S.root.findFirst("steer sleigh"),
  S.root.findFirst("until next"),
  S.root.findFirst("see you"),
  S.root.findFirst("thanks for")
  ]);

  that.instructions = {};
  that.instructions["use your"] = use_your;
  that.instructions["look left"] = look_left;
  that.instructions["green light"] = green_light;
  that.instructions["get ready"] = get_ready;
  that.instructions["make snowballs"] = make_snowballs;
  that.instructions["roll ball"] = roll_ball;
  that.instructions["move sync"] = move_sync;
  that.instructions["next ball"] = next_ball;
  that.instructions["now stack"] = now_stack;
  that.instructions["look up"] = look_up;
  that.instructions["well done"] = well_done;
  that.instructions["say hi"] = say_hi;
  that.instructions["snowee needs"] = snowee_needs;
  that.instructions["your turn"] = your_turn;
  that.instructions["snowee happy"] = snowee_happy;
  that.instructions["steer sleigh"] = steer_sleigh;
  that.instructions["until next"] = until_next;
  that.instructions["see you"] = see_you;
  that.instructions["thanks for"] = thanks_for;

  that.show = function(str,hold_time){
    D.log(`showing ${str}`)
    var item_to_show = that.instructions[str];
    var linear = A.samplers.linear(0,1);
    var reverse = A.samplers.linear(1,0);
    item_to_show.getMaterial().then(function(m){
      var td = A.timeDriver({
        durationMilliseconds:500,
        loopCount:1,
        mirror:false
      });
      td.start();
      var fade = A.animate(td,linear);
      m.setParameter("fade",fade);

      Tm.setTimeout(function(){
        td = A.timeDriver({
          durationMilliseconds:500,
          loopCount:1,
          mirror:false
        });
        td.start();
        fade = A.animate(td,reverse);
        m.setParameter("fade",fade);
      },hold_time);
    });
  }
  return that;
}