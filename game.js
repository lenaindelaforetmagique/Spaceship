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

Spaceship = function(home, spaceLimit) {
  // console.log(x, y);
  this.x = home.x;
  this.y = home.y;
  this.spaceLimit = spaceLimit;
  this.dx = 0;
  this.dy = 0;
  this.theta = 0;
  this.dtheta = 0;
  this.landed = false;
  this.alive = true;

  this.gravity = function() {
    return Math.max(0, 1 - (this.y / this.spaceLimit) ** 2);
  }

  this.boostAction = function() {
    var dv = 1 / 2;
    this.dx += Math.sin(this.theta * Math.PI / 180) * dv;
    this.dy -= Math.cos(this.theta * Math.PI / 180) * dv;
  }

  this.rotateAction = function(dir) {
    var dv = 1; // / 100;
    this.dtheta += dir * dv;
  }

  this.update = function() {
    if (this.alive) {
      if (!this.landed) {
        this.dy += 0.2 * this.gravity();
      } else {

        // console.log("landed");
      }
      this.x += this.dx; // * dt;
      this.y += this.dy; // * dt;
      this.theta += this.dtheta; // * dt;
      this.theta = principalAngle(this.theta);

    } else {
      // console.log("mort");
    }
  }
};

Point = function(x, y) {
  this.x = x;
  this.y = y;
}


Game = function(w, h) {
  this.w = w;
  this.h = h;
  this.spaceLimit = -20 * h;
  this.land = 0 - 48;
  this.home = new Point(w / 2, this.land);
  this.mission = new Point((-5.5 + 11 * Math.random()) * this.w, this.spaceLimit * (1.05 + 0.1 * Math.random()));

  this.ship = new Spaceship(this.home, this.spaceLimit, this); //Math.floor(h / 2));


  // this.html = new SVGView(this);

  this.update = function() {
    this.ship.update();
    this.borderCheck();
    this.checkLanded();
  }

  this.checkLanded = function() {
    var res;

    var test1 = Math.abs(this.ship.y - this.land) < 2; // check altitude
    var test2 = Math.abs(this.ship.theta) < 10; // check verticality (tol =10°)
    var test3 = (this.ship.dy > 0) && (this.ship.dx ** 2 + this.ship.dy ** 2) < 20; // check velocity
    var test4 = Math.abs(this.ship.dtheta) < 1.1; // check rotational speed
    res = test1 && test2 && test3 && test4;

    this.ship.landed = res;
    // console.log(this.ship.dx ** 2 + this.ship.dy ** 2);
    // console.log(test1, test2, test3, test4);
    if (this.ship.landed) {
      this.ship.dx = 0;
      this.ship.dy = 0;
      this.ship.theta = 0;
      this.ship.dtheta = 0;
      this.ship.y = this.land;
    }

  }

  this.borderCheck = function() {

    if (this.ship.x < 0) {
      // this.ship.alive = false;
      // this.ship.x += this.w;
      // this.ship.dx *= -1;
    } else if (this.ship.x > this.w) {
      // this.ship.alive = false;
      // this.ship.x -= this.w;
      // this.ship.dx *= -1;
    }

    if (this.ship.y < 0) {
      // this.ship.alive = false;
      // this.ship.y += this.h;
      // this.ship.dy *= -1;
    } else if (this.ship.y > this.land + 4) {
      this.ship.alive = false;
      // this.ship.y -= this.h;
      // this.ship.dy *= -1;
    }
  }
};