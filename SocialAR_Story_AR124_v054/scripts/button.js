export {Button}
function Button(mat,measure,pressed,released){
  var that = {};
  that.myMat = mat;
  that.myMeasure = measure;
  that.state = "idle";
  that.confirm_cooldown = 200;
  that.pressed = pressed;
  that.released = released;
  
  that.masked = false;

  that.myMeasure.onOn().subscribe(function(){
    if(!that.masked){
      that.myMat.setParameter("hover_amount",1);
      that.pressed();
    }
  });
  that.myMeasure.onOff().subscribe(function(){
    if(!that.masked) that.released();
    that.myMat.setParameter("hover_amount",0);
  });
  return that;
}