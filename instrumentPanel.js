listXYToPolylinePoints = function(listX, listY) {
  let res = "";
  for (let i = 0; i < listX.length; i++) {
    res += listX[i] + ',' + listY[i] + ' ';
  }
  return res;
}

Arrow = function(parentSvg, ship, target, rr, gg, bb) {
  this.parentSvg = parentSvg;
  this.ship = ship;
  this.target = target;
  this.rr = rr;
  this.gg = gg;
  this.bb = bb;
  this.alpha = 1;

  this.phase = 0;

  this.x1 = 0;
  this.y1 = 0;
  this.x2 = 0;
  this.y2 = 0;

  this.points = "";

  this.update = function() {
    let dx = this.target.x - this.ship.x;
    let dy = this.target.y - this.ship.y;
    // let n = (dx ** 2 + dy ** 2) ** 0.5;
    let n = Math.pow(dx * dx + dy * dy, 0.5);
    if (n > 0) {
      dx /= n;
      dy /= n;
    }

    let listx = [];
    let listy = [];


    if (n > 1) {
      this.phase += Math.max(20 - 10 * n / 1000, 0);
      this.alpha = Math.max(0, Math.min(1, (n - 100) / 200));

      n /= 100;
      n = Math.max(15, n);
      n = Math.min(100, n);
      this.x1 = this.ship.x + dx * 100;
      this.y1 = this.ship.y + dy * 100;
      this.x2 = this.ship.x + dx * 100 + dx * n;
      this.y2 = this.ship.y + dy * 100 + dy * n;

      let ampl = 15;

      this.phase = principalAngle(this.phase);

      let dl = ampl * Math.sin(this.phase * Math.PI / 180);
      this.x1 += dx * dl;
      this.y1 += dy * dl;
      this.x2 += dx * dl;
      this.y2 += dy * dl;
      // n = ((this.x1 - this.x2) ** 2 + (this.y1 - this.y2) ** 2) ** 0.5;
      n = Math.pow(Math.pow(this.x1 - this.x2, 2) + Math.pow(this.y1 - this.y2, 2), 0.5);

      let a = 5;

      let i = 0;
      listx.push(this.x1);
      listy.push(this.y1);

      i += 1;
      listx.push(listx[i - 1] - dy * a);
      listy.push(listy[i - 1] + dx * a);

      i += 1;
      listx.push(listx[i - 1] + dx * (n - 2 * a));
      listy.push(listy[i - 1] + dy * (n - 2 * a));

      i += 1;
      listx.push(listx[i - 1] - dy * a);
      listy.push(listy[i - 1] + dx * a);

      listx.push(this.x2);
      listy.push(this.y2);

      i += 2;
      listx.push(listx[i - 1] + dy * 2 * a - dx * 2 * a);
      listy.push(listy[i - 1] - dx * 2 * a - dy * 2 * a);

      i += 1;
      listx.push(listx[i - 1] - dy * a);
      listy.push(listy[i - 1] + dx * a);

      i += 1;
      listx.push(listx[i - 1] - dx * (n - 2 * a));
      listy.push(listy[i - 1] - dy * (n - 2 * a));

      listx.push(this.x1);
      listy.push(this.y1);
    }
    this.points = listXYToPolylinePoints(listx, listy);
  }

  this.draw = function() {
    // this.svg.setAttributeNS(null, 'x1', this.x1);
    // this.svg.setAttributeNS(null, 'y1', this.y1);
    // this.svg.setAttributeNS(null, 'x2', this.x2);
    // this.svg.setAttributeNS(null, 'y2', this.y2);

    this.svg.setAttributeNS(null, 'points', this.points);
    this.svg.setAttributeNS(null, "style", "fill:" + colorGenerator(this.rr, this.gg, this.bb, this.alpha));
  }


  this.initSVG = function() {
    this.svg = document.createElementNS(svgNS, 'polyline');
    // this.svg.setAttributeNS(null, "style", style);
    this.parentSvg.appendChild(this.svg);
  }

  this.initSVG();
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
    this.svgObjects.push(new Arrow(this.svg, this.game.ship, this.game.mission, 255, 0, 0));
    this.svgObjects.push(new Arrow(this.svg, this.game.ship, this.game.home, 0, 255, 0));
    this.svgObjects.push(new Radar(this.svg, this.viewBox, this.game));

    this.parentSvg.appendChild(this.svg);
  }

  this.initSVG();
}