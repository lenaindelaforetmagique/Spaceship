var svgNS = "http://www.w3.org/2000/svg";

removeDOMChildren = function(dom) {
  //removes all children of dom
  while (dom.firstChild) {
    dom.removeChild(dom.firstChild);
  };
};




SVGView = function() {
  this.w = window.innerWidth;
  this.h = window.innerHeight;

  this.game = new Game(this.w, this.h);

  // components of universe view
  this.svg = null;
  this.buildings = [];
  this.cloudsBack = [];
  this.stars = [];
  this.ship = null;
  this.smokeGenerator = null;
  this.cloudsFront = [];
  this.viewBox = [];
  this.instrumentPanel = null;
  this.createUniverse();

  this.lastUpdate = Date.now();

  this.setupInput();
  this.setupUpdate();
};

SVGView.prototype.createUniverse = function() {
  var thiz = this;
  var svgObj = null;

  let attr = "xlink:href";
  let attrNS = "http://www.w3.org/1999/xlink"

  // SVG picture in HTML
  thiz.svg = document.createElementNS(svgNS, "svg");
  thiz.svg.setAttributeNS(null, "height", thiz.h); //window.innerHeight);
  thiz.svg.setAttributeNS(null, "id", "universe");
  document.body.appendChild(thiz.svg);

  // viewBox init
  thiz.viewBox = [0, -thiz.h + 10, thiz.w, thiz.h];
  thiz.svg.setAttributeNS(null, "viewBox", thiz.viewBox.join(" "));

  // ceil
  svgObj = document.createElementNS(svgNS, 'rect');
  svgObj.setAttributeNS(null, "id", "background");
  svgObj.setAttributeNS(null, 'x', thiz.viewBox[0]);
  svgObj.setAttributeNS(null, 'y', thiz.viewBox[1]);
  svgObj.setAttributeNS(null, 'width', thiz.w);
  svgObj.setAttributeNS(null, 'height', thiz.h);
  svgObj.setAttributeNS(null, 'fill', '#ADD8E6'); // linear - gradient(#e66465, #9198e5);
  thiz.svg.appendChild(svgObj);

  // Clouds back
  svgObj = document.createElementNS(svgNS, 'g');
  svgObj.setAttributeNS(null, "id", "cloudsBack");
  for (let i = 0; i < 200; i++) {
    thiz.cloudsBack.unshift(cloudSVG(-thiz.w * 6, thiz.w * 6, -thiz.h * 10, -thiz.h / 2));
    svgObj.appendChild(thiz.cloudsBack[0]);
  }
  thiz.svg.appendChild(svgObj);

  // Stars back
  svgObj = document.createElementNS(svgNS, 'g');
  svgObj.setAttributeNS(null, "id", "starsBack");
  for (let i = 0; i < 1000; i++) {
    thiz.stars.unshift(starSVG(-thiz.w * 6, thiz.w * 6, thiz.game.spaceLimit * 1.2, thiz.game.spaceLimit * 0.8));
    svgObj.appendChild(thiz.stars[0]);
  }
  thiz.svg.appendChild(svgObj);

  // Buildings
  svgObj = document.createElementNS(svgNS, 'g');
  svgObj.setAttributeNS(null, "id", "buildings");
  for (let i = 0; i < 100; i++) {
    thiz.buildings.unshift(buildingSVG(-thiz.w * 6, thiz.w * 6));
    svgObj.appendChild(thiz.buildings[0]);
  }
  thiz.svg.appendChild(svgObj);

  // smoke layer
  let smokeLayerObj = document.createElementNS(svgNS, 'g');
  smokeLayerObj.setAttributeNS(null, "id", "smokeLayer");
  thiz.svg.appendChild(smokeLayerObj);


  // launchingPad
  svgObj = document.createElementNS(svgNS, 'image');
  svgObj.setAttributeNS(null, "id", "spaceStation");
  svgObj.setAttributeNS(null, "x", thiz.game.home.x - 128 / 2 - 15);
  svgObj.setAttributeNS(null, "y", thiz.game.home.y - 113 / 2);
  svgObj.setAttributeNS(null, "width", 128);
  svgObj.setAttributeNS(null, "height", 113);
  svgObj.setAttributeNS(attrNS, attr, 'launchingPad.png');
  this.svg.appendChild(svgObj);


  // ground
  svgObj = document.createElementNS(svgNS, 'rect');
  svgObj.setAttributeNS(null, "id", "horizon");
  svgObj.setAttributeNS(null, 'x', -thiz.w * 6);
  svgObj.setAttributeNS(null, 'y', 0);
  svgObj.setAttributeNS(null, 'width', thiz.w * 12);
  svgObj.setAttributeNS(null, 'height', thiz.h);
  svgObj.setAttributeNS(null, 'fill', '#000000');
  thiz.svg.appendChild(svgObj);


  // Space station
  svgObj = document.createElementNS(svgNS, 'image');
  svgObj.setAttributeNS(null, "id", "spaceStation");
  svgObj.setAttributeNS(null, "x", thiz.game.mission.x - 594 / 2);
  svgObj.setAttributeNS(null, "y", thiz.game.mission.y - 578 / 2);
  svgObj.setAttributeNS(null, "width", 594);
  svgObj.setAttributeNS(null, "height", 578);
  svgObj.setAttributeNS(attrNS, attr, 'spaceStation.png');
  this.svg.appendChild(svgObj);


  // Spaceship
  thiz.ship = new ShipView(thiz.game.ship);
  thiz.svg.appendChild(thiz.ship.svg);
  thiz.smokeGenerator = new smokeGenerator(-200, thiz.ship, smokeLayerObj);


  // Clouds front
  svgObj = document.createElementNS(svgNS, 'g');
  svgObj.setAttributeNS(null, "id", "cloudsBack");
  for (let i = 0; i < 100; i++) {
    thiz.cloudsFront.unshift(cloudSVG(-thiz.w * 6, thiz.w * 6, -this.h * 10, -this.h));
    svgObj.appendChild(thiz.cloudsFront[0]);
  }
  thiz.svg.appendChild(svgObj);

  // instrument Panel
  thiz.instrumentPanel = new InstrumentPanel(thiz.svg, thiz.game);
}


SVGView.prototype.setupInput = function() {
  // all events behavior here

  var thiz = this;

  document.onkeydown = function(e) {
    switch (e.which) {
      case 32: // space
        thiz.ship.BoostOn = true;
        break;
      case 37: // left arrow
        // thiz.ship.ship.rotateAction(-1);
        thiz.ship.LRotateOn = true;
        break;
        // case 38: // up arrow
        //   break;
      case 39: // right arrow
        // thiz.ship.ship.rotateAction(1);
        thiz.ship.RRotateOn = true;
        break;
        // case 40: // down arrow
        //   break;
    }
  }

  document.onkeyup = function(e) {
    switch (e.which) {
      case 32: // space
        thiz.ship.BoostOn = false;
        break;
        // case 37: // left arrow
        //   thiz.ship.LRotateOn = false;
        //   break;
        // case 39: // right arrow
        //   thiz.ship.RRotateOn = false;
        //   break;
    }
  }

  // window.onload =
  window.onresize = function() {
    // thiz.h = window.innerHeight;
    thiz.svg.setAttributeNS(null, "height", window.innerHeight);
  };

};

SVGView.prototype.setupUpdate = function() {
  var thiz = this;

  var updateCB = function(timestamp) {
    thiz.refresh(timestamp);
    window.requestAnimationFrame(updateCB);
  };
  updateCB(0);
};

SVGView.prototype.refresh = function(ts) {
  let now = Date.now();
  if (now - this.lastUpdate > 20) {
    this.lastUpdate = now;
    this.update();
    this.draw();
  }
};

SVGView.prototype.update = function() {
  this.game.update();

  this.ship.update();
  this.smokeGenerator.update();
  this.instrumentPanel.update();
}


SVGView.prototype.draw = function() {
  var game = this.game;
  var thiz = this;

  // adjust viewBox
  thiz.viewBox[0] = Math.max(Math.min(thiz.viewBox[0], game.ship.x - this.w / 4), game.ship.x + this.w / 4 - this.w);
  thiz.viewBox[1] = Math.min(-thiz.h + 10, game.ship.y - thiz.h / 2);
  thiz.svg.setAttributeNS(null, "viewBox", thiz.viewBox.join(" "));

  // Background
  var svgObj = document.getElementById("background");
  svgObj.setAttributeNS(null, 'x', thiz.viewBox[0]);
  svgObj.setAttributeNS(null, 'y', thiz.viewBox[1]);
  let a = thiz.ship.ship.gravity();
  let col = 'rgb(' + a * 173 + ',' + a * 216 + ',' + a * 230 + ')';
  svgObj.setAttributeNS(null, 'fill', col);

  this.ship.draw();
  this.smokeGenerator.draw();
  this.instrumentPanel.draw();

}


var jeu = new SVGView();