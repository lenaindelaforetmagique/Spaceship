var svgNS = "http://www.w3.org/2000/svg";

SVGView = function() {
  this.w = window.innerWidth;
  this.h = window.innerHeight;
  this.svg = null;
  this.setView();

  this.game = new Game(this.w, this.h);


  this.last = Date.now();

  this.setupInput();
  this.setupUpdate();
};

SVGView.prototype.setView = function() {

  let svgNS = "http://www.w3.org/2000/svg";
  this.svg = document.createElementNS(svgNS, "svg");
  this.svg.setAttributeNS(null, "viewBox", "0 0 " + this.w + " " + this.h);

  // svg.setAttributeNS(null, "width", "100%");
  this.svg.setAttributeNS(null, "height", window.innerHeight);
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

  document.onkeydown = function(e) {
    switch (e.which) {
      case 32: // space
        console.log("space");
        game.spaceAction();
        break;
      case 37: // left arrow
        console.log("left");
        game.leftAction();
        break;
        // case 38: // up arrow
        //   console.log("up");
        //   break;
      case 39: // right arrow
        console.log("right");
        game.rightAction();
        break;
        // case 40: // down arrow
        //   break;
    }
  };

  window.onload = window.onresize = function() {
    // console.log(window.innerHeight);
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

  if (ship == null) {
    ship = document.createElementNS(svgNS, 'g');
    ship.setAttributeNS(null, "id", "ship");
    ship.setAttributeNS(null, 'fill', '#FF0000');
    var rect1 = document.createElementNS(svgNS, 'rect');
    rect1.setAttributeNS(null, "x", 0);
    rect1.setAttributeNS(null, "y", -5);
    rect1.setAttributeNS(null, "width", 20);
    rect1.setAttributeNS(null, "height", 10);
    ship.appendChild(rect1);

    var rect2 = document.createElementNS(svgNS, 'rect');
    rect2.setAttributeNS(null, "x", -10);
    rect2.setAttributeNS(null, "y", -10);
    rect2.setAttributeNS(null, "width", 10);
    rect2.setAttributeNS(null, "height", 20);
    ship.appendChild(rect2);

    this.svg.appendChild(ship);
  }
  let xc = game.ship.x + 15;
  let yc = game.ship.y + 5;

  let transformation = "translate(" + game.ship.x + "," + game.ship.y + ")" +
    "rotate(" + game.ship.theta + ")"; //"," + game.ship.x + "," + game.ship.y + ")";

  ship.setAttributeNS(null, 'transform', transformation);
  // +    "translate(" + (game.ship.x) + "," + (game.ship.y) + ")")
}


var jeu = new SVGView();