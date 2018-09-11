var svgNS = "http://www.w3.org/2000/svg";

SVGView = function() {
  this.w = window.innerWidth;
  this.h = window.innerHeight;
  this.svg = null;
  this.setView();

  this.game = new Game(this.w, this.h);

  this.keyBoostOn = false;
  this.keyLRotateOn = false;
  this.keyRRotateOn = false;


  this.last = Date.now();

  this.setupInput();
  this.setupUpdate();
};

SVGView.prototype.setView = function() {

  let svgNS = "http://www.w3.org/2000/svg";
  this.svg = document.createElementNS(svgNS, "svg");
  this.svg.setAttributeNS(null, "viewBox", "0 0 " + this.w + " " + this.h);

  // svg.setAttributeNS(null, "width", "100%");
  this.svg.setAttributeNS(null, "height", this.h); //window.innerHeight);
  this.svg.setAttributeNS(null, "id", "space");

  var rect = document.createElementNS(svgNS, 'rect');
  rect.setAttribute('x', 0);
  rect.setAttribute('y', 0);
  rect.setAttribute('width', "100%");
  rect.setAttribute('height', "100%");
  rect.setAttribute('fill', '#CCCCCC');
  this.svg.appendChild(rect);

  document.body.appendChild(this.svg);
}

SVGView.prototype.setupInput = function() {
  var svg = this.svg;
  var game = this.game;
  var thiz = this;

  var switchKeysOff = function() {
    thiz.keyBoostOn = false;
    thiz.keyLRotateOn = false;
    thiz.keyRRotateOn = false;
  }

  document.onkeydown = function(e) {
    switch (e.which) {
      case 32: // space
        switchKeysOff();
        thiz.keyBoostOn = true;
        game.spaceAction();
        break;
      case 37: // left arrow
        switchKeysOff();
        thiz.keyLRotateOn = true;
        game.leftAction();
        break;
        // case 38: // up arrow
        //   console.log("up");
        //   break;
      case 39: // right arrow
        switchKeysOff();
        thiz.keyRRotateOn = true;
        game.rightAction();
        break;
        // case 40: // down arrow
        //   break;
    }
  };

  document.onkeyup = function(e) {
    switchKeysOff();
  }

  window.onload = window.onresize = function() {
    svg.setAttributeNS(null, "height", window.innerHeight);
  };

};

SVGView.prototype.setupUpdate = function() {
  var thiz = this;

  var updateCB = function(timestamp) {
    // console.log(timestamp);
    thiz.update(timestamp);
    window.requestAnimationFrame(updateCB);
  };

  updateCB(0);
};

SVGView.prototype.update = function(ts) {

  var now = Date.now();
  var dt = Date.now() - this.last;
  if (dt > 20) {
    this.last = now;

    this.game.update(dt);
    this.draw();
  }
};


SVGView.prototype.draw = function() {
  var game = this.game;
  // Spaceship
  var ship = document.getElementById("ship");
  var thiz = this;

  if (ship == null) {
    ship = document.createElementNS(svgNS, 'g');
    ship.setAttributeNS(null, "id", "ship");

    this.svg.appendChild(ship);
  }

  var vis = document.getElementById("shipView");

  if (vis == null) {
    vis = document.createElementNS(svgNS, 'image');
    vis.setAttributeNS(null, "id", "shipView");
    vis.setAttributeNS(null, "x", -54 / 2);
    vis.setAttributeNS(null, "y", -130 / 2);
    vis.setAttributeNS(null, "width", 54);
    vis.setAttributeNS(null, "height", 130);
    // vis.setAttributeNS(null, "transform", "rotate(90)");
    ship.appendChild(vis);
  }

  var attr = "xlink:href";
  var attrNS = "http://www.w3.org/1999/xlink"
  if (thiz.keyBoostOn) {
    vis.setAttributeNS(attrNS, attr, 'spaceship_B.png');
  } else if (thiz.keyLRotateOn) {
    vis.setAttributeNS(attrNS, attr, 'spaceship_L.png');
  } else if (this.keyRRotateOn) {
    vis.setAttributeNS(attrNS, attr, 'spaceship_R.png');
  } else {
    vis.setAttributeNS(attrNS, attr, 'spaceship.png');
  }
  let transformation = "translate(" + game.ship.x + "," + game.ship.y + "), " +
    "rotate(" + game.ship.theta + ")"; //"," + game.ship.x + "," + game.ship.y + ")";

  ship.setAttributeNS(null, 'transform', transformation);
  // +    "translate(" + (game.ship.x) + "," + (game.ship.y) + ")")
}


var jeu = new SVGView();