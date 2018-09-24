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


Radar = function(parentSvg, viewBox, game) {
  this.parentSvg = parentSvg;
  this.viewBox = viewBox;
  this.totalH = game.h;
  this.totalW = game.w;
  this.ship = game.ship;
  this.home = game.home;
  this.mission = game.mission;

  this.svg = null;

  this.frame = null;
  this.frameX = 0;
  this.frameY = 0;

  this.homePt = null;
  this.homeX = 0;
  this.homeY = 0;

  this.missionPt = null;
  this.missionX = 0;
  this.missionY = 0;

  this.shipPt = null;
  this.shipX = 0;
  this.shipY = 0;

  this.update = function() {
    this.frameH = this.viewBox.box[3] / 2 - 10;
    let fact = (this.frameH) / this.totalH;
    this.frameW = this.totalW * fact;

    this.frameX = this.viewBox.box[0] + this.viewBox.box[2] - this.frameW - 10;
    this.frameY = this.viewBox.box[1] + this.viewBox.box[3] - this.frameH - 10;

    this.homeX = this.frameX + this.frameW / 2 + this.home.x * fact;
    this.homeY = this.frameY + this.frameH + this.home.y * fact;

    this.missionX = this.frameX + this.frameW / 2 + this.mission.x * fact;
    this.missionY = this.frameY + this.frameH + this.mission.y * fact;

    this.shipX = this.frameX + this.frameW / 2 + this.ship.x * fact;
    this.shipY = this.frameY + this.frameH + this.ship.y * fact;

  }

  this.draw = function() {
    // console.log(this.frameX, this.frameY);
    this.frame.setAttributeNS(null, 'x', this.frameX);
    this.frame.setAttributeNS(null, 'y', this.frameY);
    this.frame.setAttributeNS(null, 'width', this.frameW);
    this.frame.setAttributeNS(null, 'height', this.frameH);

    this.homePt.setAttributeNS(null, 'cx', this.homeX);
    this.homePt.setAttributeNS(null, 'cy', this.homeY);

    this.missionPt.setAttributeNS(null, 'cx', this.missionX);
    this.missionPt.setAttributeNS(null, 'cy', this.missionY);

    this.shipPt.setAttributeNS(null, 'cx', this.shipX);
    this.shipPt.setAttributeNS(null, 'cy', this.shipY);
  }

  this.initSVG = function() {
    this.svg = document.createElementNS(svgNS, 'g');
    this.svg.setAttributeNS(null, 'id', 'radar');

    this.frame = document.createElementNS(svgNS, 'rect');
    this.frame.setAttributeNS(null, 'fill', colorGenerator(255, 255, 255, 0.5));
    this.frame.setAttributeNS(null, 'stroke', colorGenerator(0, 0, 0));
    this.frame.setAttributeNS(null, 'stroke-width', 3);
    this.svg.appendChild(this.frame);

    this.homePt = document.createElementNS(svgNS, 'circle');
    this.homePt.setAttributeNS(null, 'r', 3);
    this.homePt.setAttributeNS(null, 'fill', colorGenerator(0, 255, 0));
    this.svg.appendChild(this.homePt);

    this.missionPt = document.createElementNS(svgNS, 'circle');
    this.missionPt.setAttributeNS(null, 'r', 3);
    this.missionPt.setAttributeNS(null, 'fill', colorGenerator(255, 0, 0));
    this.svg.appendChild(this.missionPt);

    this.shipPt = document.createElementNS(svgNS, 'circle');
    this.shipPt.setAttributeNS(null, 'r', 3);
    this.shipPt.setAttributeNS(null, 'fill', colorGenerator(255, 255, 0));
    this.svg.appendChild(this.shipPt);

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
    this.svgObjects.push(new Radar(this.svg, this.viewBox, this.game));

    this.parentSvg.appendChild(this.svg);
  }

  this.initSVG();
}