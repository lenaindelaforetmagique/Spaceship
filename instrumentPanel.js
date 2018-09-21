Arrow = function(parentSvg, ship, target, style) {
  this.parentSvg = parentSvg;
  this.ship = ship;
  this.target = target;

  this.x1 = 0;
  this.y1 = 0;
  this.x2 = 0;
  this.y2 = 0;

  this.update = function() {
    let dx = this.target.x - this.ship.x;
    let dy = this.target.y - this.ship.y;
    let n = (dx ** 2 + dy ** 2) ** 0.5;
    if (n > 0) {
      dx /= n;
      dy /= n;
    }
    n = Math.max(0, n - 200);

    this.x1 = this.ship.x + dx * 100;
    this.y1 = this.ship.y + dy * 100;
    this.x2 = this.ship.x + dx * 100 + dx * n / 250;
    this.y2 = this.ship.y + dy * 100 + dy * n / 250;

  }

  this.draw = function() {
    this.svg.setAttributeNS(null, 'x1', this.x1);
    this.svg.setAttributeNS(null, 'y1', this.y1);
    this.svg.setAttributeNS(null, 'x2', this.x2);
    this.svg.setAttributeNS(null, 'y2', this.y2);
  }

  this.initSVG = function(style) {
    this.svg = document.createElementNS(svgNS, 'line');
    this.svg.setAttributeNS(null, "style", style);
    this.parentSvg.appendChild(this.svg);
  }

  this.initSVG(style);
}


Altimeter = function(parentSvg, viewBox, game) {
  this.parentSvg = parentSvg;
  this.viewBox = viewBox;
  this.totalH = game.h;
  this.ship = game.ship;

  this.x1 = 0;
  this.x2 = 0;
  this.y1 = 0;
  this.y2 = 0;

  this.svg = null;

  this.update = function() {
    this.x1 = this.viewBox.box[0];
    this.x2 = this.x1 + 100;
    this.y1 = (1 + this.ship.y / this.totalH) * this.viewBox.box[3] + this.viewBox.box[1];
    this.y2 = this.y1;
  }

  this.draw = function() {
    this.svg.setAttributeNS(null, 'x1', this.x1);
    this.svg.setAttributeNS(null, 'x2', this.x2);
    this.svg.setAttributeNS(null, 'y1', this.y1);
    this.svg.setAttributeNS(null, 'y2', this.y2);
  }

  this.initSVG = function() {
    this.svg = document.createElementNS(svgNS, 'line');
    this.svg.setAttributeNS(null, "style", "stroke:rgb(0,0,255);stroke-width:5");
    this.parentSvg.appendChild(this.svg);
  }

  this.initSVG();

}

InstrumentPanel = function(parentSvg, viewBox, game) {
  this.game = game;
  this.parentSvg = parentSvg;
  this.viewBox = viewBox;
  this.svg = null;

  this.svgObjects = [];


  this.update = function() {
    this.svgObjects.forEach(function(item) {
      item.update();
    });
  }

  this.draw = function() {
    this.svgObjects.forEach(function(item) {
      item.draw();
    });
  }

  this.initSVG = function() {
    this.svg = document.createElementNS(svgNS, 'g');
    this.svg.setAttributeNS(null, 'id', 'instrument panel');

    // mission arrows
    this.svgObjects.push(new Arrow(this.svg, this.game.ship, this.game.mission, "stroke:rgb(255,0,0);stroke-width:5"));
    this.svgObjects.push(new Arrow(this.svg, this.game.ship, this.game.home, "stroke:rgb(0,255,0);stroke-width:5"));
    this.svgObjects.push(new Altimeter(this.svg, this.viewBox, this.game));

    this.parentSvg.appendChild(this.svg);
  }

  this.initSVG();
}