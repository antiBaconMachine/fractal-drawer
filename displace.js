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

	function divideMap(x, y, blockSize, tl, tr, br, bl, pointSize, range, roughness) {
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

			divideMap(x, y, newBlockSize, tl, tm, cn, lm, pointSize, newRange, roughness);
			divideMap(x+newBlockSize, y, newBlockSize, tm, tr, rm, cn, pointSize, newRange, roughness);
			divideMap(x+newBlockSize, y+newBlockSize, newBlockSize, cn, rm, br, bm, pointSize, newRange, roughness);
			divideMap(x, y+newBlockSize, newBlockSize, lm, cn, bm, bl, pointSize, newRange, roughness);


		} else {
			var p = (tl + tr + bl + br) / 4;
			ctx.fillStyle = getColour(p);
			ctx.fillRect(x,y,blockSize,blockSize);
		}
	}

	function getColour(c) {
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

	var self = {
		drawMap : function(pointSize, range, roughness) {
			if (!pointSize) pointSize = 4;
			if (!range) range = 4;
			if (!roughness) roughness = 0.4;
			xx = 0;
			
			var tl = Math.random();
			var tr = Math.random();
			var br = Math.random();
			var bl = Math.random();
			divideMap(0,0,canvas.width,tl,tr,br,bl,pointSize,range,roughness);
		},
		
		plotCurve : function(mod) {
			self.clearCanvas();
			if (!mod) {
				mod = function(n){return n}; 
			}
			var cHeight = canvas.height;
			var vals = [];
			var max = mod(100);
			var fac =  1 / max;
			ctx.fillStyle = "#111";
			for (var i = 100; i >=0; i--) {
				n = mod(i) * fac;
				vals[i] = n;
				ctx.fillRect(i, cHeight-1-(n*100) ,1,1);
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