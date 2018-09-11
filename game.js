Spaceship = function(x, y) {
  console.log(x, y);
  this.x = x;
  this.y = y;
  this.dx = 0;
  this.dy = 0;
  this.theta = 0;
  this.dtheta = 0;

  this.boost = function() {
    var dv = 1;
    this.dx += Math.cos(this.theta * Math.PI / 180) * dv;
    this.dy += Math.sin(this.theta * Math.PI / 180) * dv;
  }

  this.rotate = function(dir) {
    var dv = 1; // / 100;
    this.dtheta += dir * dv;
  }

  this.update = function(dt) {
    this.dy += 0.05;
    this.x += this.dx; // * dt;
    this.y += this.dy; // * dt;
    this.theta += this.dtheta; // * dt;
  }
};


Game = function(w, h) {
  this.w = w;
  this.h = h;

  this.ship = new Spaceship(Math.floor(w / 2), Math.floor(h / 2));

  // this.html = new SVGView(this);

  this.update = function(dt) {
    this.ship.update(dt);
    if (this.ship.x < 0) {
      this.ship.x += this.w;
      // this.ship.dx *= -1;
    } else if (this.ship.x > this.w) {
      this.ship.x -= this.w;
      // this.ship.dx *= -1;
    }

    if (this.ship.y < 0) {
      this.ship.y += this.h;
      // this.ship.dy *= -1;
    } else if (this.ship.y > this.h) {
      this.ship.y -= this.h;
      // this.ship.dy *= -1;
    }

    // this.ship.x = this.ship.x % this.w;
    // this.ship.y = this.ship.y % this.h;

  }

  this.spaceAction = function() {
    this.ship.boost();
  }
  this.rightAction = function() {
    this.ship.rotate(1);
  }
  this.leftAction = function() {
    this.ship.rotate(-1);
  }
};