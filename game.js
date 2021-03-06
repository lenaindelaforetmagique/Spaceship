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
  this.home = home;
  this.x = home.x;
  this.y = home.y;
  this.spaceLimit = spaceLimit;
  this.dx = 0;
  this.dy = 0;
  this.dv = 0;
  this.theta = 0;
  this.dtheta = 0;
  this.landed = false;
  this.alive = true;

  this.gravity = function() {
    // return Math.max(0, 1 - (this.y / this.spaceLimit) ** 2);
    return Math.max(0, 1 - Math.pow(this.y / this.spaceLimit, 2));
  }

  this.boost = function() {
    if (this.dv < 1) {
      this.dv += 0.05; //1 / 2;
    }
    this.dx += Math.sin(this.theta * Math.PI / 180) * this.dv;
    this.dy -= Math.cos(this.theta * Math.PI / 180) * this.dv;
  }

  this.unboost = function() {
    this.dv = 0;
  }

  this.move = function(dir) {
    let intensity = dir * 0.15;
    this.dx += Math.sin(this.theta * Math.PI / 180) * intensity;
    this.dy -= Math.cos(this.theta * Math.PI / 180) * intensity;
  }

  this.rotate = function(dir) {
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

  this.restart = function() {
    this.x = this.home.x;
    this.y = this.home.y;
    this.dx = 0;
    this.dy = 0;
    this.dv = 0;
    this.theta = 0;
    this.dtheta = 0;
    this.landed = false;
    this.alive = true;
  }
};

Point = function(x, y) {
  this.x = x;
  this.y = y;
}


Game = function(w, h) {
  // w = total width of game
  // h = total height of game
  this.w = w;
  this.xmin = -w / 2;
  this.xmax = w / 2;

  this.h = h;
  this.ymin = -h;

  this.spaceLimit = -h / 2;
  this.land = 0 - 48;
  this.home = new Point(this.xmin + Math.random() * this.w, this.land);
  this.mission = new Point(this.xmin + Math.random() * this.w, this.ymin + Math.random() * h / 2);


  this.ship = new Spaceship(this.home, this.spaceLimit, this);

  this.restart = function() {
    this.ship.restart();
  }

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
    // var test3 = (this.ship.dy > 0) && (this.ship.dx ** 2 + this.ship.dy ** 2) < 20; // check velocity
    var test3 = (this.ship.dy > 0) && (Math.pow(this.ship.dx, 2) + Math.pow(this.ship.dy, 2)) < 20; // check velocity
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

    if (this.ship.x < this.xmin) {
      this.ship.x = this.xmin + (this.xmin - this.ship.x);
      this.ship.dx *= -0.2;
      // this.ship.theta *= -1;
      this.ship.dtheta *= -1;

    } else if (this.ship.x > this.xmax) {
      this.ship.x = this.xmax - (this.ship.x - this.xmax);
      this.ship.dx *= -0.2;
      // this.ship.theta *= -1;
      this.ship.dtheta *= -1;
    }

    if (this.ship.y < this.ymin) {
      this.ship.y = this.ymin + (this.ymin - this.ship.y);
      this.ship.dy *= -1 * 0.2;
      // this.ship.theta = 180 - this.ship.theta;
      this.ship.dtheta *= -1;

    } else if (this.ship.y > this.land + 4 && this.ship.y > 0) {
      this.ship.alive = false;
      // this.ship.y -= this.h;
      // this.ship.dy *= -1;
    }
  }
};