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