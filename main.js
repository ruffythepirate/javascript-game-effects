

const gameCanvas = document.getElementById('game-canvas');

const foregroundContext = gameCanvas.getContext('2d');

const typer = new Typer(gameCanvas, '30px Joystix', 'green', 30);

var currentGameLoop = introLoop;

const Game = {
  frameRate: 60,
  run: () => {
    currentGameLoop();
  }
};


(function() {
  var onEachFrame;
  if (window.webkitRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); webkitRequestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / Game.frameRate);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(Game.run);

typer.play( [
  'Hello world!', 'On a second line as well.'],
  1);

function introLoop() {
  typer.render(foregroundContext);
}