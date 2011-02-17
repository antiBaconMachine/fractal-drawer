/* Simple midpoint displacement fractal drawing implementation with canvas
 * Credit due to http://www.ic.sunysb.edu/Stu/jseyster/plasma/
 * and http://www.gameprogrammer.com/fractal.html
 *
 * @author Ollie Edwards	<oliver.s.edwards@gmail.com>
 * @version 0.1
 * @date 02/02/2011
 */ 

var Cell = function(canvasId) {

 var canvas = document.getElementById(canvasId);
 var ctx = canvas.getContext("2d");
 var xx = 0;
 var maxCurve;
 var distributionLog;

 function iterateMap(blockSize, pointSize, range, roughness, curve) {
  var seed = Math.random();
  var dim = blockSize/pointSize;
  var grid = initGrid(dim, seed, seed, seed, seed);
  var len = grid.length;
  var i,j,ost,mid;

  while (pointSize < blockSize) {
   i=0;
   j=0;
   while (i<dim) {
        //diamond - find the midpoint
	ost = i + blockSize-1
	mid = i+ (blockSize-1);
	grid[i+mid][i+mid] = randomDisplacement([grid[i][i], grid[i][ost], grid[ost][i], grid[ost][ost]],range);
	i=i+blockSize;
   }

   i=0;
   j=0;
   while (i<dim) {
       //square find 4 new points to make squares
	ost = (blockSize-1) /2;
	mid = i+ (blockSize-1);

        //1 point on each diamond may be out of range, in which case wrap round and take from the other side
	
        tl = grid[i][i];
        cen = grid[i+mid][i+mid];
        ml = grid[(i-ost < 0 ? len -ost : i-ost)][i+mid];
        bl = grid[i][i+blockSize];

        tr = grid[i][i+blockSize];
        tc = grid[i+ost][(i-ost) < 0 ? len-ost : i-ost];


        grid[i][i+mid] = randomDisplacement([top,left,bottom,right], range);

	i=i+blockSize;
   }

   blockSize = Math.floor(blockSize/2);
   range = range * roughness;
  }
  return grid;
  
 }

 function initGrid(dim, tl, tr, bl, br) {
  var grid = [];
  for (var i=0; i < dim; i++) {
   grid[i]=[];
   for (var j=0; j < dim; j++) {
	grid[i][j] = null;
   }
  }
  dim--;
  grid[0][0]	= tl;
  grid[dim][0] = tr;
  grid[0][dim] = bl;
  grid[dim][dim] = br;

  return grid;
 }

 function divideMap(x, y, blockSize, tl, tr, br, bl, pointSize, range, roughness, curve) {
  xx++;
  if (blockSize > pointSize) {

   var newRange = range * roughness;
   var newBlockSize = blockSize /2;
   var cn = randomDisplacement([tl,tr,bl,br], range);
   if (cn > 1) cn = 1;
   if (cn < 0) cn = 0;

   /*var sRange = 0;
			var tm = randomDisplacement([tl, tr], sRange);
			var rm = randomDisplacement([tr, br], sRange);
			var bm = randomDisplacement([br, bl], sRange);
			var lm = randomDisplacement([tl, bl], sRange);*/

   var tm = (tl + tr) / 2;
   var rm = (tr + br) / 2;
   var bm = (br + bl) / 2;
   var lm = (tl + bl) / 2;

   divideMap(x, y, newBlockSize, tl, tm, cn, lm, pointSize, newRange, roughness, curve);
   divideMap(x+newBlockSize, y, newBlockSize, tm, tr, rm, cn, pointSize, newRange, roughness, curve);
   divideMap(x+newBlockSize, y+newBlockSize, newBlockSize, cn, rm, br, bm, pointSize, newRange, roughness, curve);
   divideMap(x, y+newBlockSize, newBlockSize, lm, cn, bm, bl, pointSize, newRange, roughness, curve);


  } else {
   var p = curve((tl + tr + bl + br) / 4) * maxCurve;
   if (distributionLog) {
	distributionLog[Math.floor(p*10)]++;
   }
   ctx.fillStyle = getColour(p, curve);
   ctx.fillRect(x,y,blockSize,blockSize);
  }
 }

 function getColour(c, curve) {
  //Colour mapping algorythm 'borrowed ' from http://www.ic.sunysb.edu/Stu/jseyster/plasma/
  red = 0;
  green = 0;
  blue = 0;

  if (c < 0.5)
  {
   red = c * 2;
  }
  else
  {
   red = (1.0 - c) * 2;
  }

  if (c >= 0.3 && c < 0.8)
  {
   green = (c - 0.3) * 2;
  }
  else if (c < 0.3)
  {
   green = (0.3 - c) * 2;
  }
  else
  {
   green = (1.3 - c) * 2;
  }

  if (c >= 0.5)
  {
   blue = (c - 0.5) * 2;
  }
  else
  {
   blue = (0.5 - c) * 2;
  }

  return "rgb(" + Math.round(red*256) + "," + Math.round(green*256) + "," + Math.round(blue*256) + ")";
 }

 function randomDisplacement(vals, range) {
  var len = vals.length;
  var n = 0;
  for (var i=0; i<len; i++) {
   n+=vals[i];
  }
  n = n / len + Math.random() * range -(range/2);
  if (n > 1) {
   n = 1;
  } else if (n < 0) {
   n = 0;
  }
  return n;
 }

 function initDistributionLog(booLog) {
  if (booLog) {
   distributionLog = [];
   for (var i=9; i>=0; i--) {
	distributionLog[i]=0;
   }
  }
 }

 function processDistribution(booLog, total) {
  if (booLog) {
   for (var i=0; i<10; i++) {
	var no = distributionLog[i];
	console.info("%i: %i values (%i%)", i, no, (no/total)*100);
   }
  }
  distributionLog = null;
 }
		
 var self = {
  drawMap : function(pointSize, range, roughness, curve, booLog) {
   if (!pointSize) pointSize = 4;
   if (!range) range = 4;
   if (!roughness) roughness = 0.4;
   xx = 0;
   if (!curve) {
	curve = function(n){return n};
   }
   maxCurve = 1 / curve(1);
   initDistributionLog(booLog);
			
   var tl = Math.random();
   var tr = Math.random();
   var br = Math.random();
   var bl = Math.random();
   iterateMap(initGrid(canvas.width / pointSize,tl,tr,br,bl),0,0,canvas.width,pointSize,range,roughness, curve);
   maxCurve = null;
   processDistribution(booLog, xx);
  },

  iteratePoints : function() {
   //blockSize, pointSize, range, roughness, curve
   console.info(iterateMap(5,1,0.5,0.5));
  },

  plotCurve : function(mod) {
   self.clearCanvas();
   if (!mod) {
	mod = function(n){return n};
   }
   var cHeight = canvas.height;
   var vals = [];
   var max = mod(1);
   var fac =  1 / max;
   ctx.fillStyle = "#111";
   for (var i = 100; i >=0; i--) {
	n = mod(i/100) * fac;
	vals[i] = n;
	ctx.fillRect(i*4, cHeight-1-(n*400) ,1,1);
   }
   console.info(vals);
  },

  clearCanvas : function() {
   canvas.height = 512;
   canvas.width = 512;
  }

 };
 return self;
};