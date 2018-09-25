// ==  BUILDINGS ==
buildingSVG = function(xmin, xmax) {
  let x = xmin + Math.random() * (xmax - xmin);
  let dx = Math.random() * 100 + 20;
  let dy = 6 * dx;
  let alpha = Math.random();

  let svgObj = document.createElementNS(svgNS, 'rect');
  svgObj.setAttribute('x', x);
  svgObj.setAttribute('y', -dy);
  svgObj.setAttribute('width', dx);
  svgObj.setAttribute('height', dy);

  svgObj.setAttribute('fill', colorGenerator(50, 50, 50, alpha));

  return svgObj;
}

buildingsGenerator = function(xmin, xmax, quantity) {
  let svgObj = document.createElementNS(svgNS, 'g');
  svgObj.setAttributeNS(null, "class", "buildings");
  for (let i = 0; i < quantity; i++) {
    svgObj.appendChild(buildingSVG(xmin, xmax));
  }
  return svgObj;
}

// == CLOUDS ==
cloudSVG = function(xmin, xmax, ymin, ymax, alphaMin, alphaMax) {
  let xbox = xmin + Math.random() * (xmax - xmin);
  let ybox = ymin + Math.random() * (ymax - ymin);
  let wbox = Math.random() * 200 + 100;
  let hbox = wbox * (0.5 + 0.25 * Math.random());
  let alpha = alphaMin + Math.random() * (alphaMax - alphaMin);

  let grp = document.createElementNS(svgNS, 'g');

  let col = 255; //Math.floor(Math.random() * 55 + 200);

  for (let i = 0; i < 20; i++) {
    let x = xbox + Math.random() * wbox;
    let y = ybox + Math.random() * hbox;
    let rx = Math.random() * wbox / 2;
    let ry = rx;

    let img = document.createElementNS(svgNS, 'ellipse');
    img.setAttribute('cx', x);
    img.setAttribute('cy', y);
    img.setAttribute('rx', rx);
    img.setAttribute('ry', ry);
    img.setAttribute('fill', colorGenerator(col, col, col, alpha));
    grp.appendChild(img);
  }
  return grp;
}

cloudsGenerator = function(xmin, xmax, ymin, ymax, alphaMin, alphaMax, quantity) {
  let svgObj = document.createElementNS(svgNS, 'g');
  // let cloudsL = [];
  svgObj.setAttributeNS(null, "class", "clouds");
  for (let i = 0; i < quantity; i++) {
    // cloudsL.unshift(cloudSVG(xmin, xmax, ymin, ymax, alphaMin, alphaMax));
    // svgObj.appendChild(cloudsL[0]);
    svgObj.appendChild(cloudSVG(xmin, xmax, ymin, ymax, alphaMin, alphaMax));
  }
  return svgObj;
}

// == STARS ==
starSVG = function(xmin, xmax, ymin, ymax) {
  let x = xmin + Math.random() * (xmax - xmin);
  let y = ymin + Math.random() * (ymax - ymin);
  let rx = Math.random() * 4 + 1;
  let ry = rx;

  let img = document.createElementNS(svgNS, 'ellipse');
  img.setAttribute('cx', x);
  img.setAttribute('cy', y);
  img.setAttribute('rx', rx);
  img.setAttribute('ry', ry);
  img.setAttribute('fill', colorGenerator(255, 255, 255, 1));
  return img;
}

starsGenerator = function(xmin, xmax, ymin, ymax, quantity) {
  let svgObj = document.createElementNS(svgNS, 'g');
  svgObj.setAttributeNS(null, "class", "stars");
  for (let i = 0; i < quantity; i++) {
    svgObj.appendChild(starSVG(xmin, xmax, ymin, ymax));
  }
  return svgObj;
}