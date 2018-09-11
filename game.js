principalAngle = function(angle) {
  // returns principal angle between [-180 ; 180] degrees
  var res = angle % 360;
  if (res > 180) {
    res -= 360;
  } else if (res < -180) {
    res += 360;
  }
  return res;
};

Spaceship = function(x, y) {
  console.log(x, y);
  this.x = x;
  this.y = y;
  this.dx = 0;
  this.dy = 0;
  this.theta = 0;
  this.dtheta = 0;
  this.landed = false;
  this.alive = true;

  this.boost = function() {
    var dv = 1;
    this.dx += Math.sin(this.theta * Math.PI / 180) * dv;
    this.dy -= Math.cos(this.theta * Math.PI / 180) * dv;
  }

  this.rotate = function(dir) {
    var dv = 1; // / 100;
    this.dtheta += dir * dv;
  }

  this.update = function(dt) {
    if (this.alive) {
      if (!this.landed) {
        this.dy += 0.05;
      } else {

        console.log("landed");
      }
      this.x += this.dx; // * dt;
      this.y += this.dy; // * dt;
      this.theta += this.dtheta; // * dt;
      this.theta = principalAngle(this.theta);

    } else {
      console.log("mort");
    }
  }
};


Game = function(w, h) {
  this.w = w;
  this.h = h;
  this.land = this.h - 48;
  this.ship = new Spaceship(Math.floor(w / 2), Math.floor(h / 2));

  // this.html = new SVGView(this);

  this.update = function(dt) {
    this.ship.update(dt);
    this.borderCheck();
    this.checkLanded();
  }

  this.checkLanded = function() {
    var res;

    var test1 = Math.abs(this.ship.y - this.land) < 2; // check altitude
    var test2 = Math.abs(this.ship.theta) < 10; // check verticality (tol =2°)
    var test3 = (this.ship.dx ** 2 + this.ship.dy ** 2) < 0.9; // check velocity
    var test4 = Math.abs(this.ship.dtheta) < 0.1; // check rotational speed
    res = test1 && test2 && test3 && test4;

    this.ship.landed = res;
    console.log(test1, test2, test3, test4);
    if (this.ship.landed) {
      this.ship.dx = 0;
      this.ship.dy = 0;
      this.ship.theta = 0;
      this.ship.y = this.land;
    }

  }

  this.borderCheck = function() {

    if (this.ship.x < 0) {
      // this.ship.alive = false;
      this.ship.x += this.w;
      // this.ship.dx *= -1;
    } else if (this.ship.x > this.w) {
      // this.ship.alive = false;
      this.ship.x -= this.w;
      // this.ship.dx *= -1;
    }

    if (this.ship.y < 0) {
      // this.ship.alive = false;
      // this.ship.y += this.h;
      // this.ship.dy *= -1;
    } else if (this.ship.y > this.h) {
      this.ship.alive = false;
      // this.ship.y -= this.h;
      // this.ship.dy *= -1;
    }
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