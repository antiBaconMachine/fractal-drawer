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

	function divideMap(x, y, blockSize, tl, tr, br, bl, pointSize, range, roughness, curve, getColour) {
		xx++;
		if (blockSize > pointSize) {

			var newRange = range * roughness;
			var newBlockSize = blockSize /2;
			var cn = randomDisplacement([tl,tr,bl,br], range, curve);
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

			divideMap(x, y, newBlockSize, tl, tm, cn, lm, pointSize, newRange, roughness, curve, getColour);
			divideMap(x+newBlockSize, y, newBlockSize, tm, tr, rm, cn, pointSize, newRange, roughness, curve, getColour);
			divideMap(x+newBlockSize, y+newBlockSize, newBlockSize, cn, rm, br, bm, pointSize, newRange, roughness, curve, getColour);
			divideMap(x, y+newBlockSize, newBlockSize, lm, cn, bm, bl, pointSize, newRange, roughness, curve, getColour);


		} else {
			var p = (tl + tr + bl + br) / 4;
			ctx.fillStyle = getColour(p, curve);
			ctx.fillRect(x,y,blockSize,blockSize);
		}
	}

	function randomDisplacement(vals, range, curve) {
		var len = vals.length;
		var n = 0;
		for (var i=0; i<len; i++) {
			n+=vals[i];
		}
		n = curve(n / len + Math.random() * range -(range/2));
		if (n > 1) {
			n = 1;
		} else if (n < 0) {
			n = 0;
		}
		return n;
	}

	var self = {
		
		drawMap : function(pointSize, range, roughness, curve, getColour) {
			if (!pointSize) pointSize = 4;
			if (!range) range = 4;
			if (!roughness) roughness = 0.4;
			getColour = getColour || colourMapper.plasma;
			xx = 0;
			if (!curve) {
				curve = function(n){return n}; 
			}
			maxCurve = 1 / curve(1);
			
			var tl = Math.random();
			var tr = Math.random();
			var br = Math.random();
			var bl = Math.random();

			divideMap(0,0,canvas.width,tl,tr,br,bl,pointSize,range,roughness, curve, getColour);
			maxCurve = null;
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
				n = mod(i/100);// * fac;
				vals[i] = n;
				ctx.fillRect(i*4, cHeight-1-(n*400) ,4,4);
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

var colourMapper = {
	
	plasma : function(c) {
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
	},
	
	binaryLand : function(c) {
		if (c < 0.2) {
			return "#236B8E";
		} else {
			return "#458B00";
		}
	}
}

var curve = {
    exponential : function(n) {
                n=n*10;
                var x;
                var BASE=2;
                var MAX=5;
                var maxLog = Math.pow(BASE,MAX);
                if (n<=MAX){
                    x= Math.pow(BASE,n);
                } else {
                    x= maxLog - Math.pow(BASE,MAX-(n-MAX)) + maxLog;
                }
                return x/(maxLog*2);
         }
}
