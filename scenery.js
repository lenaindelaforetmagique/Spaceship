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