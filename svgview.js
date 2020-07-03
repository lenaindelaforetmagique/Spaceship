var svgNS = "http://www.w3.org/2000/svg";

removeDOMChildren = function(dom) {
  //removes all children of dom
  while (dom.firstChild) {
    dom.removeChild(dom.firstChild);
  };
};


colorGenerator = function(r = 0, g = 0, b = 0, alpha = 1) {
  return `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${alpha})`;
  // return `rgb(${r}, ${g}, ${b})`;
}



SVGView = function() {
  this.w = 1000 * 12; //window.innerWidth;
  this.h = 24 * 1000; //window.innerHeight;

  this.Init();
};

SVGView.prototype.Init = function() {
  this.game = new Game(this.w, this.h); //this.w, this.h);

  // components of universe view
  this.svg = null;

  // moving items
  this.ship = null;
  this.smokeGenerator = null;
  this.viewBox = null;
  this.instrumentPanel = null;
  this.createUniverse();

  this.lastUpdate = Date.now();

  this.setupInput();
  this.touchInput();
  this.setupUpdate();
}

SVGView.prototype.createUniverse = function() {
  var thiz = this;
  var svgObj = null;

  let attr = "xlink:href";
  let attrNS = "http://www.w3.org/1999/xlink"

  // reset previous universe

  var oldSVG = document.getElementById("universe");
  if (oldSVG !== null) {
    oldSVG.parentNode.removeChild(oldSVG);
  }


  // SVG picture in HTML
  thiz.svg = document.createElementNS(svgNS, "svg");
  // thiz.svg.setAttributeNS(null, "height", thiz.h); //window.innerHeight);
  thiz.svg.setAttributeNS(null, "id", "universe");
  document.body.appendChild(thiz.svg);

  // viewBox init
  thiz.viewBox = new ViewBox(thiz.svg, thiz.game.ship);

  // Clouds back
  thiz.svg.appendChild(cloudsGenerator(-thiz.w / 2, thiz.w / 2, -thiz.h / 3, 0, 0.25, 0.25, 200));

  // Stars
  thiz.svg.appendChild(starsGenerator(-thiz.w / 2, thiz.w / 2, -thiz.h, -this.h / 3, 2000));

  // Buildings
  thiz.svg.appendChild(buildingsGenerator(-thiz.w / 2, thiz.w / 2, 100));

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
  thiz.svg.appendChild(cloudsGenerator(-thiz.w / 2, thiz.w / 2, -thiz.h / 3, -this.h / 24, 0.25, 0.25, 200));


  // = Universe limit =
  // ground
  svgObj = document.createElementNS(svgNS, 'rect');
  svgObj.setAttributeNS(null, "id", "horizon");
  svgObj.setAttributeNS(null, 'x', -thiz.w / 2 - window.innerWidth);
  svgObj.setAttributeNS(null, 'y', 0);
  svgObj.setAttributeNS(null, 'width', thiz.w + 2 * window.innerWidth);
  svgObj.setAttributeNS(null, 'height', window.innerHeight / 2);
  svgObj.setAttributeNS(null, 'fill', '#000000');
  thiz.svg.appendChild(svgObj);

  // topWall
  svgObj = document.createElementNS(svgNS, 'rect');
  svgObj.setAttributeNS(null, "id", "topWall");
  svgObj.setAttributeNS(null, 'x', -thiz.w / 2 - window.innerWidth);
  svgObj.setAttributeNS(null, 'y', -this.h - window.innerHeight / 2);
  svgObj.setAttributeNS(null, 'width', thiz.w + 2 * window.innerWidth);
  svgObj.setAttributeNS(null, 'height', window.innerHeight / 2);
  svgObj.setAttributeNS(null, 'fill', '#000000');
  thiz.svg.appendChild(svgObj);

  // leftWall
  svgObj = document.createElementNS(svgNS, 'rect');
  svgObj.setAttributeNS(null, "id", "leftWall");
  svgObj.setAttributeNS(null, 'x', -thiz.w / 2 - window.innerWidth);
  svgObj.setAttributeNS(null, 'y', -thiz.h);
  svgObj.setAttributeNS(null, 'width', window.innerWidth);
  svgObj.setAttributeNS(null, 'height', this.h);
  svgObj.setAttributeNS(null, 'fill', '#000000');
  thiz.svg.appendChild(svgObj);

  // rightWall
  svgObj = document.createElementNS(svgNS, 'rect');
  svgObj.setAttributeNS(null, "id", "rightWall");
  svgObj.setAttributeNS(null, 'x', thiz.w / 2);
  svgObj.setAttributeNS(null, 'y', -thiz.h);
  svgObj.setAttributeNS(null, 'width', window.innerWidth);
  svgObj.setAttributeNS(null, 'height', this.h);
  svgObj.setAttributeNS(null, 'fill', '#000000');
  thiz.svg.appendChild(svgObj);

  // line
  var listPts = -this.w / 2 + ", 0 " + -this.w / 2 + "," + -this.h + " " + this.w / 2 + "," + -this.h + " " + this.w / 2 + ",0";
  svgObj = document.createElementNS(svgNS, 'polyline');
  svgObj.setAttributeNS(null, "points", listPts);
  svgObj.setAttributeNS(null, "style", "fill:none;stroke:red;stroke-width:3");
  thiz.svg.appendChild(svgObj);


  // instrument Panel
  thiz.instrumentPanel = new InstrumentPanel(thiz.svg, thiz.viewBox, thiz.game);
}


SVGView.prototype.setupInput = function() {
  // all events behavior here

  var thiz = this;

  document.onkeydown = function(e) {
    switch (e.which) {
      case 78: // n
        thiz.game.restart();
        break;
      case 32: // space
        thiz.ship.boostAction();
        break;
      case 37: // left arrow
        thiz.ship.LRotateAction();
        break;
      case 38: // up arrow
        thiz.ship.UMoveAction();
        break;
      case 39: // right arrow
        thiz.ship.RRotateAction();
        break;
      case 40: // down arrow
        thiz.ship.DMoveAction();
        break;
    }
  }

  document.onkeyup = function(e) {
    switch (e.which) {
      case 32: // space
        thiz.ship.unboostAction();

        break;
    }
  }

  // window.onload =
  window.onresize = function() {
    // thiz.h = window.innerHeight;
    thiz.viewBox.resize();

    thiz.svg.setAttributeNS(null, "height", window.innerHeight);
  };

};



SVGView.prototype.touchInput = function() {
  var dom = this.svg;
  var thiz = this;

  dom.addEventListener("touchstart", function(e) {
    e.preventDefault();
    if (e.touches[0].clientX < window.innerWidth / 4) {
      thiz.ship.LRotateOn = true;
    } else if (e.touches[0].clientX < window.innerWidth * 3 / 4) {
      if (!thiz.ship.BoostOn) {
        thiz.ship.BoostOn = true;
      }
    } else {
      thiz.ship.RRotateOn = true;
    }
  });

  dom.addEventListener("touchmove", function(e) {
    e.preventDefault();
  });

  dom.addEventListener("touchend", function(e) {
    e.preventDefault();

    thiz.ship.BoostOn = false;

  });

  dom.addEventListener("touchcancel", function(e) {
    e.preventDefault();
  });
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

  this.viewBox.update();
  this.ship.update();
  this.smokeGenerator.update();
  this.instrumentPanel.update();
}


SVGView.prototype.draw = function() {
  var game = this.game;
  var thiz = this;

  this.viewBox.draw();
  this.ship.draw();
  this.smokeGenerator.draw();
  this.instrumentPanel.draw();
}

ViewBox = function(parentSvg, ship) {
  this.parentSvg = parentSvg;
  this.ship = ship;

  this.box = [];
  this.bg = null;

  this.bgColor = '#ADD8E6';

  this.update = function() {
    this.box[0] = Math.max(Math.min(this.box[0], this.ship.x - this.box[2] / 4), this.ship.x + this.box[2] / 4 - this.box[2]);
    this.box[1] = Math.min(-this.box[3] + 10, this.ship.y - this.box[3] / 2);

    let a = this.ship.gravity();
    this.bgColor = colorGenerator(a * 173, a * 216, a * 230);
  }

  this.draw = function() {
    this.parentSvg.setAttributeNS(null, "viewBox", this.box.join(" "));

    // Background
    this.bg.setAttributeNS(null, 'x', this.box[0]);
    this.bg.setAttributeNS(null, 'y', this.box[1]);
    this.bg.setAttributeNS(null, 'width', this.box[2]);
    this.bg.setAttributeNS(null, 'height', this.box[3]);

    this.bg.setAttributeNS(null, 'fill', this.bgColor);

  }

  this.initSVG = function(style) {
    this.box = [0, 0, 0, 0];
    this.resize();
    // background
    this.bg = document.createElementNS(svgNS, 'rect');
    this.bg.setAttributeNS(null, "id", "background");

    this.parentSvg.appendChild(this.bg);
  }

  this.resize = function() {
    if (window.innerWidth > 700) {
      this.box[2] = window.innerWidth;
      this.box[3] = window.innerHeight;

    } else {
      this.box[2] = window.innerWidth * 2;
      this.box[3] = window.innerHeight * 2;
    }
  }

  this.initSVG();
}

var jeu = new SVGView();