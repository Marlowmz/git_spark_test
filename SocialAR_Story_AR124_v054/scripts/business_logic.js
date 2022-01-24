
const S = require('Scene');
const M = require('Materials');
const R = require('Reactive');
const P = require('Patches');
const A = require('Animation');
const Tm = require('Time');
export const D = require('Diagnostics');

import { Ease, PFTween } from './PFTween';
import { ImageManifest, image_manifest } from './image_manifest';
import { items, VendingItem } from './items';
import { Button } from './button';
import { Controller } from './controller';
import { StateManager } from './state_manager';
import { Level_1 } from './level_1';
import { Level_2 } from './level_2';
import { Level_3 } from './level_3';
import { Instructions } from './instruction_wiring';
var image_manifest_lookup = {};
for(let image of image_manifest) {
  image_manifest_lookup[image.name] = image;
}

function sleep(ms) {
  return new Promise(resolve => Tm.setTimeout(resolve, ms));
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function shuffleArray(array) {
  for(let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}


 async function open_doors(mat){
  for(var i =0; i < 4; i++){
    mat.setParameter("index", i + 0.00);
    await sleep(25);
  }
  await sleep(1000);
  for(var i = 3; i >= 0; i--){
    mat.setParameter("index", i + 0.00);
    await sleep(25);
  }
 }


(async function () {
    P.inputs.setBoolean("level_3_hidden",true);
  P.inputs.setScalar("instruction_number",-1);
  P.inputs.setScalar("arrow_setting",-1);
  //======================================vending machine
  const vendingMachine = await S.root.findFirst("VendingMachine");

  // Vending machine materials
  const vmUnlit = await M.findFirst("VendingMachine");
  const vmLitA = await M.findFirst("VendingMachine_A_Lit");
  const vmLitB = await M.findFirst("VendingMachine_B_Lit");
  const vmLitC = await M.findFirst("VendingMachine_C_Lit");

  // Doors
  const doorMats = await Promise.all([
    M.findFirst("Door_A"),
    M.findFirst("Door_B"),
    M.findFirst("Door_C"),
  ]);

  // Item slots
  const itemSlots = await Promise.all([
    vendingMachine.findFirst("Item_A"),
    vendingMachine.findFirst("Item_B"),
    vendingMachine.findFirst("Item_C")]);
  const itemSlotsPos = [];
  for(let itemSlot of itemSlots) {
    itemSlotsPos.push({
      position: itemSlot.transform.position.pinLastValue(),
      scale: itemSlot.transform.scale.pinLastValue(),
    });
  }

  // Item slot materials
  const itemSlotMats = await Promise.all([
    M.findFirst("Item_A"),
    M.findFirst("Item_B"),
    M.findFirst("Item_C"),
  ]);
  const itemSlotBGMats = await Promise.all([
    M.findFirst("Item_A_BG"),
    M.findFirst("Item_B_BG"),
    M.findFirst("Item_C_BG"),
  ]);

  // Snowee slots
  const snoweeSlots = await Promise.all([
    S.root.findFirst("Item_Head"),
    S.root.findFirst("Item_Eyes"),
    S.root.findFirst("Item_Face"),
    S.root.findFirst("Item_Body"),
    S.root.findFirst("Item_Special"),
  ]);
  const snowee = await S.root.findFirst("Snowee");
  const snoweeItemTransforms = {};
  for(let item of items) {
    snoweeItemTransforms[item.name] = await snowee.findFirst(item.name);
  }

  const snoweeSlotItemMats = await Promise.all([
    M.findFirst("Snowee_Slot0"),
    M.findFirst("Snowee_Slot1"),
    M.findFirst("Snowee_Slot2"),
    M.findFirst("Snowee_Slot3"),
    M.findFirst("Snowee_Slot4"),
  ]);


  // Set up directional buttons
  const dirBtns = [
    "button_L_confirm",
    "button_U_confirm",
    "button_R_confirm"
  ];
  
  const btnLit = 1;
  const btnUnlit = 0;
  
  // REFRESH BUTTON

  var placedItems = [];
  var vendedItems = [];

  var get_placed_items = function(){
    return placedItems.slice();
  }

  var overwrite_placed_items = function(replacement){
    placedItems=replacement;
    if(placedItems.length == 0)return;
    var new_item = placedItems[placedItems.length-1];
    var snoweeItem = snoweeSlotItemMats[new_item.slot];
    var fg_manifest = image_manifest_lookup[new_item.fg];
    snoweeItem.setParameter("sheet", fg_manifest.sheet);
    snoweeItem.setParameter("row", fg_manifest.row);
    snoweeItem.setParameter("column", fg_manifest.column);


    var targetPlane = snoweeItemTransforms[new_item.name];
    var targetSlot = snoweeSlots[new_item.slot];
    targetSlot.transform.position = targetPlane.transform.position;
    targetSlot.transform.scale = targetPlane.transform.scale;

    
    var sampler = A.samplers.easeInOutSine(0,1);
    var fade_time_driver = A.timeDriver({
      durationMilliseconds:500,
      mirror:false,
      loopCount:1
    });
    var fade_anim = A.animate(fade_time_driver,sampler);

    snoweeItem.opacity = fade_anim;
    Tm.setTimeout(function(){fade_time_driver.start();},1500);
  }

  var refresh_items = function(){
    // Clear state
    vendedItems = [];
    // Shuffle items
    shuffleArray(items);
    // Assign all 3 slots, skip used items
    var j = 0;
    var occupiedSlots =  placedItems.map(s => s.slot);
    for(let i = 0; i < itemSlots.length; i++) {
      // Item
      while(items[j].used || occupiedSlots.includes(items[j].slot) ) j++;
      let item = items[j];
      // FG
      let itemSlotMat = itemSlotMats[i];
      let icon_manifest = image_manifest_lookup[item.icon];
      itemSlotMat.setParameter("sheet", icon_manifest.sheet);
      itemSlotMat.setParameter("row", icon_manifest.row);
      itemSlotMat.setParameter("column", icon_manifest.column);
      itemSlotMat.opacity = 1.0;
      // Clear visible state
      itemSlots[i].cameraVisibility.forFrontCamera = true;
      itemSlots[i].cameraVisibility.forBackCamera = true;
      
      // Add to vended items
      vendedItems.push(items[j]);
      j++;
    }
    doorMats.forEach(function(d){d.setParameter("index", 0)});

    // Clear lit state
    vendingMachine.material = vmUnlit;
    // Clear item slot positions
    for(let i in itemSlots) {
      itemSlots[i].transform.position = itemSlotsPos[i].position;
      itemSlots[i].transform.scale = itemSlotsPos[i].scale;
    }
    
    // Done
  }

  // ROLL BUTTON

  var rolledItem = null;
  var rolledItemIndex = 0;
  var roll_item = async function(){

    const vmLitMats = [ vmLitA, vmLitB, vmLitC ];

    // Roll, cycling buttons
    const rolledSlot = randomInt(3);
    // Result
    vendedItems[rolledSlot].used = true;
    rolledItem = vendedItems[rolledSlot];
    rolledItemIndex = rolledSlot;
    var delay = 30;
    for(let i = 0; i <= 15 + rolledSlot; i++) {
      for(let j = 0; j < dirBtns.length; j++) {
        P.inputs.setScalar(dirBtns[j],(i % 3 == j) ? btnLit : btnUnlit);
      }
      vendingMachine.material = vmLitMats[i%3];
      await(sleep(delay));
      delay += 15;
    }
    // Light up resulting slot

    vendingMachine.material = vmLitMats[rolledSlot]
    // Wait a bit
    await(sleep(1000));
    // Clear button lit state
    for(let j = 0; j < dirBtns.length; j++) {
     P.inputs.setScalar(dirBtns[j],btnUnlit);
    }
  }

  // PLACE BUTTON

  var place_item = async function(){
    const itemSlot = itemSlots[rolledItemIndex];
    const targetSlot = snoweeSlots[rolledItem.slot];
    const targetPlane = snoweeItemTransforms[rolledItem.name];
    // Mark slots as occupied
    placedItems.push(rolledItem);


    // Why is this necessary? I don't know. Spark is broken.
    const temp = itemSlot.worldTransform.position.pinLastValue();
    const temp2 = targetPlane.worldTransform.position.pinLastValue();
    await(sleep(0));

    // Animate to position
    const fromPos = itemSlot.worldTransform.position.pinLastValue();
    const toPos = targetPlane.worldTransform.position.pinLastValue();
    //const animTr = new PFTween(fromPos, toPos, 500).setEase(Ease.easeInOutSine).build(false);
    var animTr = new PFTween(fromPos, fromPos.add(R.vector(0,0,0.0003)), 350).setEase(Ease.easeInOutSine).build(false);
    const animSc = new PFTween(itemSlot.transform.scale, targetPlane.transform.scale, 500).setEase(Ease.easeInOutSine).build(false);



    animTr.start();


    open_doors(doorMats[rolledItemIndex]);
    await sleep(500)

    animTr = new PFTween(fromPos.add(R.vector(0,0,0.0003)), toPos, 1200).setEase(Ease.easeInExpo).build(false);
    animTr.start();
    animSc.start();
    itemSlot.worldTransform.position = animTr.pack3;
    itemSlot.transform.scale = animSc.pack3;
    // Wait for animation
    await(sleep(1500));


    // move the snowee slot into position for the item
    targetSlot.transform.position = targetPlane.transform.position;
    targetSlot.transform.scale = targetPlane.transform.scale;


    // move the snowee slot into position for the item
    targetSlot.transform.position = targetPlane.transform.position;
    targetSlot.transform.scale = targetPlane.transform.scale;

    // Swap from icon image to actual image in slot
    var snoweeItem = snoweeSlotItemMats[rolledItem.slot];
    var fg_manifest = image_manifest_lookup[rolledItem.fg];
    snoweeItem.setParameter("sheet", fg_manifest.sheet);
    snoweeItem.setParameter("row", fg_manifest.row);
    snoweeItem.setParameter("column", fg_manifest.column); 
    // Hide animated icon
    itemSlot.worldTransform.position = R.point(0.0, 0.0, 1000.0);

    // Show snowee item
    await(sleep(0));
    snoweeItem.opacity = 1.0;

    // Clear lit state, after delay
    await(sleep(1000));
    vendingMachine.material = vmUnlit;
  }



  //=======================================vending machine

  P.inputs.setScalar("instruction_number",-1);

  var [
  left_button_mat,
  right_button_mat,
  up_button_mat,
  down_button_mat,
  nose_null,
  up_null,
  left_null,
  face_center_null,
  scene_center_null,
  intro_animation_controller,
  intro_animation_clip,
  level_1_initialization_instructions
  ] = await Promise.all([
    M.findFirst("left_button_mat"),
    M.findFirst("right_button_mat"),
    M.findFirst("up_button_mat"),
    M.findFirst("down_button_mat"),
    S.root.findFirst("nose_null"),
    S.root.findFirst("up_null"),
    S.root.findFirst("left_null"),
    S.root.findFirst("face_center_null"),
    S.root.findFirst("scene_center_null"),
    A.playbackControllers.findFirst("intro_animation_controller"),
    A.animationClips.findFirst("snowee_intro_splash")
    ]);



  var intro_animation = {
    controller:intro_animation_controller,
    clip:intro_animation_clip
  }

  var controller = await Controller({
    intro_animation:intro_animation

  });
  var instruction_manager = await Instructions();
  var arrow_mat = await M.findFirst("arrow_material");
  arrow_mat.setParameter("fade",0);
  var level_1_container = await S.root.findFirst("level_1");
  var level_1_snowball = await level_1_container.findFirst("snowball");
  var level_1 = Level_1({
    controller:controller,
    snowball:level_1_snowball,
    instruction_manager:instruction_manager,
    arrow_mat:arrow_mat
  });
  // controller_speed_in
  // controller_speed_out
  var level_2_animcontroller = await A.playbackControllers.findFirst("level_2_animation_controller");
  var level_2_controller_speed_in = await P.outputs.getScalar("lvl2_speed_in");
  var level_2_progress = await P.outputs.getScalar("lvl2_progress");


  var level_2_snowee_base_mat = await M.findFirst("level_2_snowee_base");
  var level_2_snowee_torso_mat = await M.findFirst("level_2_snowee_torso");
  var level_2_snowee_head_mat = await M.findFirst("level_2_snowee_head");
  var level_2_snowee_assembled = await M.findFirst("level_2_snowee_assembled");
  var level_2_snowee = await S.root.findFirst("level_2_assembled");
  var level_2 = Level_2({
    controller:controller,
    controller_speed_in:level_2_controller_speed_in,
    progress:level_2_progress,
    controller_speed_out:"lvl2_speed_out",
    controller_play:"lvl2_play",
    controller_stop:"lvl2_stop",
    controller_restart:"lvl2_restart",
    materials:{
      head:level_2_snowee_head_mat,
      torso:level_2_snowee_torso_mat,
      base:level_2_snowee_base_mat,
      assembled:level_2_snowee_assembled
    },
    level_2_snowee:level_2_snowee,
    instruction_manager:instruction_manager,
    arrow_mat:arrow_mat
  });



  var level_3 = Level_3({
    refresh_items:refresh_items,
    roll_item:roll_item,
    place_item:place_item,
    controller:controller,
    get_placed_items:get_placed_items,
    overwrite_placed_items:overwrite_placed_items,
    instruction_manager:instruction_manager
  });


  var level_4_null = await S.root.findFirst("level_4");
  var outro_animation_null = await S.root.findFirst("outro_animation");
  var state_manager = StateManager({
    controller:controller,
    intro_animation:intro_animation,
    level_1:level_1,
    level_2:level_2,
    level_3:level_3,
    level_4_null:level_4_null,
    outro_animation_null:outro_animation_null,
    instruction_manager:instruction_manager
  });

  var nose_diff = nose_null.worldTransform.position.sub(face_center_null.worldTransform.position.mix(scene_center_null.worldTransform.position,0.5));
  var safe_region = 0.1;
  var trigger_region = 0.15;
  var up_button = Button(up_button_mat,
    nose_diff.y.gt(trigger_region),
    function(){controller.input_pressed("up")},
    function(){controller.input_released("up")}
    );
  var down_button = Button(down_button_mat,
    nose_diff.y.lt(-trigger_region),
    function(){controller.input_pressed("down")},
    function(){controller.input_released("down")}
    );
  var left_button = Button(left_button_mat,
    nose_diff.x.gt(trigger_region),
    function(){controller.input_pressed("left")},
    function(){controller.input_released("left")}
    );
  var right_button = Button(right_button_mat,
    nose_diff.x.lt(-trigger_region),
    function(){controller.input_pressed("right")},
    function(){controller.input_released("right")}
    );

  var buttons = {
    up:up_button,
    down:down_button,
    left:left_button,
    right:right_button
  }
  level_1.buttons = buttons;
  level_2.buttons = buttons;
  level_3.buttons = buttons;
  state_manager.start();
})();