var svgNS = "http://www.w3.org/2000/svg";

SVGView = function() {
  this.w = window.innerWidth;
  this.h = window.innerHeight;
  this.viewBox = [];
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
  var thiz = this;

  let svgNS = "http://www.w3.org/2000/svg";
  thiz.svg = document.createElementNS(svgNS, "svg");
  thiz.viewBox = [0, -thiz.h + 10, thiz.w, thiz.h];

  thiz.svg.setAttributeNS(null, "viewBox", thiz.viewBox.join(" "));

  // svg.setAttributeNS(null, "width", "100%");
  thiz.svg.setAttributeNS(null, "height", thiz.h); //window.innerHeight);
  thiz.svg.setAttributeNS(null, "id", "space");

  var rect = document.createElementNS(svgNS, 'rect');
  rect.setAttributeNS(null, "id", "background");
  rect.setAttributeNS(null, 'x', thiz.viewBox[0]);
  rect.setAttributeNS(null, 'y', thiz.viewBox[1]);
  rect.setAttributeNS(null, 'width', thiz.w);
  rect.setAttributeNS(null, 'height', thiz.h);
  rect.setAttributeNS(null, 'fill', '#ADD8E6');
  thiz.svg.appendChild(rect);

  rect = document.createElementNS(svgNS, 'rect');
  rect.setAttributeNS(null, "id", "horizon");
  rect.setAttributeNS(null, 'x', thiz.viewBox[0]);
  rect.setAttributeNS(null, 'y', 0);
  rect.setAttributeNS(null, 'width', thiz.w);
  rect.setAttributeNS(null, 'height', thiz.h);
  rect.setAttributeNS(null, 'fill', '#000000');
  thiz.svg.appendChild(rect);

  // Buildings
  for (let i = 0; i < 50; i++) {
    rect = document.createElementNS(svgNS, 'rect');
    let v = Math.random();
    let dx = v * 100 + 20;
    let dy = v * 800 + 40;
    let x = Math.random() * 5 * thiz.w - 2.5 * thiz.w;
    let alpha = Math.random();
    rect.setAttribute('x', x);
    rect.setAttribute('y', -dy);
    rect.setAttribute('width', dx);
    rect.setAttribute('height', dy);
    rect.setAttribute('fill', 'rgb(50, 50, 50,' + alpha + ')');
    thiz.svg.appendChild(rect);
  }

  // Clouds
  for (let i = 0; i < 100; i++) {
    rect = document.createElementNS(svgNS, 'ellipse');

    let rx = Math.random() * 300;
    let ry = rx * (0.5 + 0.25 * Math.random());
    let x = Math.random() * 5 * thiz.w - 2.5 * thiz.w;
    let y = -Math.random() * 5 * thiz.h - this.h;
    let alpha = Math.random();
    rect.setAttribute('cx', x);
    rect.setAttribute('cy', y);
    rect.setAttribute('rx', rx);
    rect.setAttribute('ry', ry);
    rect.setAttribute('fill', 'rgb(255, 255, 255,' + alpha + ')');
    thiz.svg.appendChild(rect);
  }




  document.body.appendChild(thiz.svg);
}

SVGView.prototype.setupInput =
  function() {
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


  // viewBox
  // this.viewBox[0] =
  thiz.viewBox[0] = Math.max(Math.min(thiz.viewBox[0], game.ship.x - this.w / 4), game.ship.x + this.w / 4 - this.w);
  thiz.viewBox[1] = Math.min(-thiz.h + 10, game.ship.y - thiz.h / 2);
  console.log(this.viewBox);
  thiz.svg.setAttributeNS(null, "viewBox", thiz.viewBox.join(" "));
  var bg = document.getElementById("background");
  bg.setAttributeNS(null, 'x', thiz.viewBox[0]);
  bg.setAttributeNS(null, 'y', thiz.viewBox[1]);
  var hz = document.getElementById("horizon");
  hz.setAttributeNS(null, 'x', thiz.viewBox[0]);

}


var jeu = new SVGView();