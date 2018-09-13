var svgNS = "http://www.w3.org/2000/svg";

removeDOMChildren = function(dom) {
  //removes all children of dom
  while (dom.firstChild) {
    dom.removeChild(dom.firstChild);
  };
};

smokeItem = function(xShip) {
  this.x = (Math.random() * 200 - 100) + xShip;
  this.y = 0;
  this.dx = Math.max(-15, Math.min(15, 100 / (this.x - xShip)));
  this.dy = 0 * -Math.random() * 10;
  this.r = 0;
  this.a = 1;

  this.update = function() {
    this.dx *= 0.92;
    this.dy *= 0.9;
    this.x += this.dx;
    this.y += this.dy;
    this.r += 1;
    this.a -= 0.0125;
  }

  this.svgGen = function() {
    let svgObj = document.createElementNS(svgNS, 'ellipse');
    svgObj.setAttribute('cx', this.x);
    svgObj.setAttribute('cy', this.y);
    svgObj.setAttribute('rx', this.r);
    svgObj.setAttribute('ry', this.r);
    svgObj.setAttribute('fill', 'rgb(255, 255, 255,' + this.a + ')');
    return svgObj;
  }
}

smokeGenerator = function(yStart, ship, smokeLayer) {
  this.yStart = yStart; // start smoke generation if ship is below
  this.ship = ship; // shipView
  this.smokeItems = [];
  this.smokeLayer = smokeLayer;

  this.update = function() {
    // smoke items deletion
    while (this.smokeItems.length > 0 && this.smokeItems[0].a < 0) {
      // deletes first smokeItem
      this.smokeItems.shift();
    };

    // smoke items creation
    if (this.ship.ship.y > this.yStart && this.ship.BoostOn) {
      for (let i = 0; i < 3 * (this.yStart - this.ship.ship.y) / this.yStart; i++) {
        let xSmoke = this.ship.ship.x + Math.tan(Math.PI * this.ship.ship.theta / 180) * this.ship.ship.y
        this.smokeItems.push(new smokeItem(xSmoke));
      }
    };

    // smoke items update
    this.smokeItems.forEach(function(item) {
      item.update();
    });
  }

  this.draw = function() {
    // cleaning all DOM childrens
    removeDOMChildren(this.smokeLayer);

    // drawing
    this.smokeItems.forEach(function(item) {
      this.smokeLayer.appendChild(item.svgGen());
    });
  }
}


buildingSVG = function(xmin, xmax) {
  let x = xmin + Math.random() * (xmax - xmin);
  let dx = Math.random() * 100 + 20;
  let dy = 6 * dx;

  let svgObj = document.createElementNS(svgNS, 'rect');
  svgObj.setAttribute('x', x);
  svgObj.setAttribute('y', -dy);
  svgObj.setAttribute('width', dx);
  svgObj.setAttribute('height', dy);
  let alpha = Math.random();
  svgObj.setAttribute('fill', 'rgb(50, 50, 50,' + alpha + ')');
  // let alpha = Math.floor(256 * Math.random());
  // svgObj.setAttribute('fill', 'rgb(' + alpha + ',' + alpha + ',' + alpha + ')');
  return svgObj;
}

cloudSVG = function(xmin, xmax, ymin, ymax) {
  let x = xmin + Math.random() * (xmax - xmin);
  let y = ymin + Math.random() * (ymax - ymin);
  let rx = Math.random() * 300;
  let ry = rx * (0.5 + 0.25 * Math.random());
  let alpha = 0.5; //Math.random();

  let img = document.createElementNS(svgNS, 'ellipse');
  img.setAttribute('cx', x);
  img.setAttribute('cy', y);
  img.setAttribute('rx', rx);
  img.setAttribute('ry', ry);
  img.setAttribute('fill', 'rgb(255, 255, 255,' + alpha + ')');
  return img;
}

starSVG = function(xmin, xmax, ymin, ymax) {
  let x = xmin + Math.random() * (xmax - xmin);
  let y = ymin + Math.random() * (ymax - ymin);
  let rx = Math.random() * 4 + 1;
  let ry = rx;
  let alpha = 1; //Math.random();

  let img = document.createElementNS(svgNS, 'ellipse');
  img.setAttribute('cx', x);
  img.setAttribute('cy', y);
  img.setAttribute('rx', rx);
  img.setAttribute('ry', ry);
  img.setAttribute('fill', 'rgb(255, 255, 255,' + alpha + ')');
  return img;
}


ShipView = function(ship) {
  // declarations
  this.ship = ship;
  this.BoostOn = false;
  this.LRotateOn = false;
  this.RRotateOn = false;
  this.LRotateOnP = false;
  this.RRotateOnP = false;
  this.svg = null;
  this.lastUpdate = Date.now();

  this.pic = null; // normal
  this.picB = null; // boost
  this.picL = null; // L rotate
  this.picR = null; // R rotate

  this.createView = function() {
    this.svg = document.createElementNS(svgNS, 'g');
    this.svg.setAttributeNS(null, "id", "ship");

    let attr = "xlink:href";
    let attrNS = "http://www.w3.org/1999/xlink"

    this.pic = document.createElementNS(svgNS, 'image');
    this.pic.setAttributeNS(null, "id", "shipView");
    this.pic.setAttributeNS(null, "x", -54 / 2);
    this.pic.setAttributeNS(null, "y", -130 / 2);
    this.pic.setAttributeNS(null, "width", 54);
    this.pic.setAttributeNS(null, "height", 130);
    this.pic.setAttributeNS(attrNS, attr, 'spaceship.png');
    this.svg.appendChild(this.pic);

    this.picB = document.createElementNS(svgNS, 'image');
    this.picB.setAttributeNS(null, "id", "shipViewB");
    this.picB.setAttributeNS(null, "x", -54 / 2);
    this.picB.setAttributeNS(null, "y", -130 / 2);
    this.picB.setAttributeNS(null, "width", 0);
    this.picB.setAttributeNS(null, "height", 130);
    this.picB.setAttributeNS(attrNS, attr, 'spaceship_B.png');
    this.svg.appendChild(this.picB);

    this.picL = document.createElementNS(svgNS, 'image');
    this.picL.setAttributeNS(null, "id", "shipViewB");
    this.picL.setAttributeNS(null, "x", -54 / 2);
    this.picL.setAttributeNS(null, "y", -130 / 2);
    this.picL.setAttributeNS(null, "width", 0);
    this.picL.setAttributeNS(null, "height", 130);
    this.picL.setAttributeNS(attrNS, attr, 'spaceship_L.png');
    this.svg.appendChild(this.picL);

    this.picR = document.createElementNS(svgNS, 'image');
    this.picR.setAttributeNS(null, "id", "shipViewB");
    this.picR.setAttributeNS(null, "x", -54 / 2);
    this.picR.setAttributeNS(null, "y", -130 / 2);
    this.picR.setAttributeNS(null, "width", 0);
    this.picR.setAttributeNS(null, "height", 130);
    this.picR.setAttributeNS(attrNS, attr, 'spaceship_R.png');
    this.svg.appendChild(this.picR);

  }

  this.update = function() {
    if (this.BoostOn) {
      this.ship.boostAction();
    };

    if (this.LRotateOn) {
      this.ship.rotateAction(-1);
      this.LRotateOnP = true;
      this.LRotateOn = false;
    }

    if (this.RRotateOn) {
      this.ship.rotateAction(1);
      this.RRotateOn = false;
      this.RRotateOnP = true;
    }
  }

  this.draw = function() {

    let attr = "xlink:href";
    let attrNS = "http://www.w3.org/1999/xlink"

    var vis = document.getElementById("shipView");

    if (this.BoostOn) {
      this.picB.setAttributeNS(null, "width", 54);
    } else {
      this.picB.setAttributeNS(null, "width", 0);
    }
    if (this.LRotateOnP) {
      this.picL.setAttributeNS(null, "width", 54);
    } else {
      this.picL.setAttributeNS(null, "width", 0);
    }

    if (this.RRotateOnP) {
      this.picR.setAttributeNS(null, "width", 54);
    } else {
      this.picR.setAttributeNS(null, "width", 0);
    }

    this.LRotateOnP = false;
    this.RRotateOnP = false;
    let transformation = "translate(" + this.ship.x + "," + this.ship.y + "), " +
      "rotate(" + this.ship.theta + ")";

    this.svg.setAttributeNS(null, 'transform', transformation);
  }

  // Init actions
  this.createView();
}


SVGView = function() {
  this.w = window.innerWidth;
  this.h = window.innerHeight;

  this.game = new Game(this.w, this.h);

  // components of universe view
  this.svg = null;
  this.buildings = [];
  this.cloudsBack = [];
  this.stars = [];
  this.ship = new ShipView(this.game.ship);
  this.smokeGenerator = null;
  this.cloudsFront = [];
  this.viewBox = [];
  this.createUniverse();

  this.lastUpdate = Date.now();

  this.setupInput();
  this.setupUpdate();
};

SVGView.prototype.createUniverse = function() {
  var thiz = this;
  var svgObj = null;

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

  // ground
  svgObj = document.createElementNS(svgNS, 'rect');
  svgObj.setAttributeNS(null, "id", "horizon");
  svgObj.setAttributeNS(null, 'x', -thiz.w * 6);
  svgObj.setAttributeNS(null, 'y', 0);
  svgObj.setAttributeNS(null, 'width', thiz.w * 12);
  svgObj.setAttributeNS(null, 'height', thiz.h);
  svgObj.setAttributeNS(null, 'fill', '#000000');
  thiz.svg.appendChild(svgObj);

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
    this.game.update();
    this.ship.update();
    this.smokeGenerator.update();

    // draw
    this.draw();
  }

};


SVGView.prototype.draw = function() {
  var game = this.game;
  var thiz = this;

  // adjust viewBox
  thiz.viewBox[0] = Math.max(Math.min(thiz.viewBox[0], game.ship.x - this.w / 4), game.ship.x + this.w / 4 - this.w);
  thiz.viewBox[1] = Math.min(-thiz.h + 10, game.ship.y - thiz.h / 2);
  thiz.svg.setAttributeNS(null, "viewBox", thiz.viewBox.join(" "));

  // Background
  var bg = document.getElementById("background");
  bg.setAttributeNS(null, 'x', thiz.viewBox[0]);
  bg.setAttributeNS(null, 'y', thiz.viewBox[1]);
  let a = thiz.ship.ship.gravity();
  let col = 'rgb(' + a * 173 + ',' + a * 216 + ',' + a * 230 + ')';
  bg.setAttributeNS(null, 'fill', col);


  this.ship.draw();
  this.smokeGenerator.draw();
}


var jeu = new SVGView();