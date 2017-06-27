
'use strict';
/* --- vendor --- */

// Converts a #ffffff hex string into an [r,g,b] array
var h2r = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
};

// Inverse of the above
var r2h = function(rgb) {
    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
};

// Interpolates two [r,g,b] colors and returns an [r,g,b] of the result
// Taken from the awesome ROT.js roguelike dev library at
// https://github.com/ondras/rot.js
var _interpolateColor = function(color1, color2, factor) {
  if (arguments.length < 3) { factor = 0.5; }
  var result = color1.slice();
  for (var i=0;i<3;i++) {
    result[i] = Math.round(result[i] + factor*(color2[i]-color1[i]));
  }
  return result;
};

var rgb2hsl = function(color) {
  var r = color[0]/255;
  var g = color[1]/255;
  var b = color[2]/255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
    switch(max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
};

var hsl2rgb = function(color) {
  var l = color[2];

  if (color[1] == 0) {
    l = Math.round(l*255);
    return [l, l, l];
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var s = color[1];
    var q = (l < 0.5 ? l * (1 + s) : l + s - l * s);
    var p = 2 * l - q;
    var r = hue2rgb(p, q, color[0] + 1/3);
    var g = hue2rgb(p, q, color[0]);
    var b = hue2rgb(p, q, color[0] - 1/3);
    return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
  }
};

var _interpolateHSL = function(color1, color2, factor) {
  if (arguments.length < 3) { factor = 0.5; }
  var hsl1 = rgb2hsl(color1);
  var hsl2 = rgb2hsl(color2);
  for (var i=0;i<3;i++) {
    hsl1[i] += factor*(hsl2[i]-hsl1[i]);
  }
  return hsl2rgb(hsl1);
};


/* -----------------------------------------------
/* Author : Alex Alleavitch
/* MIT license: http://opensource.org/licenses/MIT
/* Demo / Generator : alexalleavitch.com/labyrinths.js
/* GitHub : github.com/AJAlkaline/Labyrinths.js
/* How to use? : Check the GitHub README
/* v0.1.0
/* ----------------------------------------------- */

/*var lJS = function(tag_id, params) {

    this.lJS = {

    }

	var lJS = this.lJS;*/

	var canvas = document.getElementById("labyrinths");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "white";
	ctx.strokeStyle = "#000000";
  ctx.fillRect(0,0, canvas.width, canvas.height);

	var mouseX = canvas.width/2;
	var mouseY = canvas.width/2;
	//ctx.fillRect(0,0,150,75);

	var snakesize = 2;
	var startingsnakes = Math.floor(20*(canvas.width/1600)*(canvas.height/770)*2);
	var dieoff = false;
	var dieoffrate = 500;
	var maxsnakes = 9000;
	var topsnakes = 0;

	ctx.lineWidth = snakesize;

	var grid = new Array();

	for(var i=0; i<canvas.width/snakesize; i++) {
		grid[i]= new Array();
		for(var j=0; j<canvas.height/snakesize; j++) {
			grid[i][j] = -1;
		}
	}

  var AlegreyaBlack = new FontFace('AlegreyaBlack', 'url(fonts/AlegreyaSansSC-Black.ttf)');

  var guidecanvas = document.createElement('canvas');
  var gctx = guidecanvas.getContext("2d");

  AlegreyaBlack.load().then(function(font){

    // with canvas, if this is ommited won't work
    document.fonts.add(font);

    /* Guide Canvas Test Code */
    
    //guidecanvas.className = lJS_guidecanvas_class;
    guidecanvas.width = grid.length;
    guidecanvas.height = grid[0].length;
    
    gctx.font = "43px AlegreyaBlack";
    gctx.strokeStyle = "rgb(0,0,0)";

    gctx.fillStyle = "#0f0f0f";
    gctx.lineWidth = 4;
    gctx.strokeText("Alex", guidecanvas.width/2 - gctx.measureText("Alex").width/2, 
                  46);
    gctx.fillText("Alex", guidecanvas.width/2 - gctx.measureText("Alex").width/2, 
                  46);
    gctx.strokeText("Alleavitch", guidecanvas.width/2 - gctx.measureText("Alleavitch").width/2, 
                  76);
    gctx.fillText("Alleavitch", guidecanvas.width/2 - gctx.measureText("Alleavitch").width/2, 
                  76);
    console.log(guidecanvas.height/8);
    

    // ---- Name background fill ----
    /*
    console.log(canvas.height/8);
    ctx.font = "86px AlegreyaBlack";
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 5;
    ctx.strokeText("Alex", canvas.width/2 - ctx.measureText("Alex").width/2, 
                  92);
    ctx.fillText("Alex", canvas.width/2 - ctx.measureText("Alex").width/2, 
                  92);
    ctx.strokeText("Alleavitch", canvas.width/2 - ctx.measureText("Alleavitch").width/2, 
                  152);
    ctx.fillText("Alleavitch", canvas.width/2 - ctx.measureText("Alleavitch").width/2, 
                  152);
    */
    

    for(var i=0;i<grid.length;i++) {

      for(var j=0;j<grid[i].length;j++) {
        var imgdata = gctx.getImageData(i,j,1,1);
        if(imgdata.data[0] == 0 && imgdata.data[1] == 0 && imgdata.data[2] == 0 && imgdata.data[3] == 255) {
          grid[i][j] = -2;
          //console.log(i, j, imgdata.data[0], imgdata.data[1], imgdata.data[2]);
        }
      }
    }

    //document.getElementsByTagName("body")[0].style.visibility = 'visible';

    for(var h=0; h<snakewindows.length;h++) {
      snakewindows[h].updateSnakeWindow();
    }
    makeSnakes(startingsnakes);

    window.requestAnimFrame(newFrame);
  });

	var snakes = [];
  var colormod = 1;
  if(window.width < 700) {
    colormod = window.width/700;
  }

	var snake = function(id, position) {
		topsnakes = snakes.length;
		this.id = id;
		this.points = [];
		this.points.push(position);
    grid[this.points[0].x][this.points[0].y] = this.id;
		this.deathCount = 1000;
		this.vel = Math.floor(Math.random()*4);
    this.snakesize = snakesize;
		this.rcolormod = 1 - 0.25*Math.random();
		this.gcolormod = 1 - 0.25*Math.random();
		this.bcolormod = 1 - 0.25*Math.random();
    this.colordefined = false;
    this.imgdata = gctx.getImageData(this.points[0].x, this.points[0].y, 1, 1);
    if(this.imgdata.data[3] == 255) {
      this.colordefined = true;
    }
		this.getColor = function() {
			if(!this.colordefined)
				return 'rgb(' + Math.floor(255*(this.points[0].y*snakesize/(canvas.height)) + 100*this.rcolormod/colormod) + 
					', ' + Math.floor(colormod*255*(this.points[0].x*snakesize/(canvas.width)) + 100*this.gcolormod/colormod) +
					', ' + Math.floor(colormod*255 - 255*(this.points[0].x*snakesize/canvas.width) + 100*this.bcolormod/colormod) + ')';

			else {
				return 'rgb(' + this.imgdata.data[0] + ', ' + this.imgdata.data[1] + ', '	+ this.imgdata.data[2] + ')';	
			}
		}
	}


	var snakeWindow = function(width, height, mousefollow, circle, blurry) {
		this.x = 0;
		this.y = 0;
		this.width = width;
		this.height = height;
		this.mousefollow = mousefollow;
		this.circle = circle; // if the window is a circle, it'll treat width as the diameter
		this.blurry = blurry; // blurry edges makes the window a little less strict
		this.updateSnakeWindow = function() {
			if(this.mousefollow) {
				this.x = Math.floor(mouseX - this.width/2);
				if(!circle) {
					this.y = Math.floor(mouseY - this.height/2);
				}
				else {
					this.y = Math.floor(mouseY - this.width/2);
				}
			}
		}
	}

	var windowRadius = Math.max(Math.floor(canvas.width/3),350);
	var snakewindows = [];
	snakewindows.push(new snakeWindow(500,500, true, true, true));
	snakewindows.push(new snakeWindow(500,500, false, true, true));
	snakewindows[1].x = Math.floor(canvas.width/2) - snakewindows[1].width/2;
	snakewindows[1].y = - snakewindows[1].width/2;

	var makeSnakes = function(numsnakes){
		for(var i=0; i<numsnakes; i++) {
			for(var l=0; l<100; l++) {
        if(makeSnake()) {
          l=100;
        }
      }
		}
	}

	var makeSnake = function() {
		var randwindow = Math.floor(Math.random()*snakewindows.length);
		var snakewindow = snakewindows[randwindow];

		var tpos = {x:0,y:0};
		if(!snakewindow.circle) {
			tpos = {x:Math.floor(snakewindow.x/snakesize + Math.random()*snakewindow.width/snakesize), 
			y:Math.floor(snakewindow.y/snakesize + Math.random()*snakewindow.height/snakesize)};
		}
		else {
			tpos = {x:Math.floor(snakewindow.x/snakesize + Math.random()*snakewindow.width/snakesize), 
			y:Math.floor(snakewindow.y/snakesize + Math.random()*snakewindow.width/snakesize)};
		}
		if(checkPoint(tpos, -1)) {
			snakes.push(new snake(snakes.length, tpos));
			return true;
		}
		else {
			return false;
		}
	}

	var updateSnakes = function() {
		if(snakes.length < maxsnakes) {
			makeSnakes(1);
		}

		for(var i=0; i<snakes.length; i++) {
			while(snakes[i].deathCount > 0) {
				var cpoint = {};
				cpoint.x = snakes[i].points[snakes[i].points.length-1].x;
				cpoint.y = snakes[i].points[snakes[i].points.length-1].y;
				var rand = Math.random()*30;
				if(rand < 0.25) {
					cpoint.x += 1;
					snakes[i].vel = 0;
				}
				else if(rand < 0.5) {
					cpoint.x -= 1;
					snakes[i].vel = 1;
				}
				else if(rand < 0.75) {
					cpoint.y += 1;
					snakes[i].vel = 2;
				}
				else if(rand < 1) {
					cpoint.y -= 1;
					snakes[i].vel = 3;
				}
				else {
					switch(snakes[i].vel) {
						case 0: cpoint.x += 1;
						break;
						case 1: cpoint.x -= 1;
						break;
						case 2: cpoint.y += 1;
						break;
						case 3: cpoint.y -= 1;
						break;
					}
				}

				if(checkPoint(cpoint, snakes[i])) {
					if(snakes[i].points.length < 2 ||
						(cpoint.x != snakes[i].points[snakes[i].points.length-2].x != 
						snakes[i].points[snakes[i].points.length-1].x ||
					   cpoint.y != snakes[i].points[snakes[i].points.length-2].y !=
					   snakes[i].points[snakes[i].points.length-1].y)) {
						snakes[i].points.push(cpoint);
					}
					else {
						snakes[i].points[snakes[i].points.length-1] = cpoint;
					}
					grid[cpoint.x][cpoint.y] = snakes[i].id;
					break;
				}
				else {
					snakes[i].deathCount--;
				}
			}
			/* Branching snakes */
			if (snakes[i].deathCount > 0 && snakes[i].points.length > 3 && Math.random() < 0.0025
				&& snakes.length < maxsnakes) {
				var tpos = snakes[i].points[snakes[i].points.length-1];
				snakes.push(new snake(snakes[i].id, tpos));
				snakes[snakes.length-1].points.unshift(snakes[i].points[snakes[i].points.length-2]);
				snakes[snakes.length-1].points.unshift(snakes[i].points[snakes[i].points.length-3]);
			}
			/* Die and have baby */
			if (snakes[i].deathCount < 1 && snakes[i].deathCount > -1 && (!dieoff || snakes.length < maxsnakes)) {
				makeSnakes(1);
				snakes[i].deathCount--;
			}
			/* Hang around for a bit after dead */
			if (snakes[i].deathCount < 0 && snakes[i].deathCount >= -dieoffrate*snakes[i].points.length*.1) {
				snakes[i].deathCount--;
			}
			/* Start to disappear */
			if (dieoff && 
				snakes[i].deathCount < -dieoffrate*snakes[i].points.length*.1 && snakes[i].points.length > 0) {
				var rpos = snakes[i].points.shift();
				grid[rpos.x][rpos.y] = -1;
			}
			/* All gone */
			if (snakes[i].points.length < 1 && snakes[i].deathCount < 0) {
				snakes.splice(i, 1);
			}
		}

	}

	var checkWindow = function(point, snwindow) {
		if(snwindow.circle) {
			if(( Math.pow((point.x - (snwindow.x+snwindow.width/2)/snakesize), 2) +
				Math.pow((point.y - (snwindow.y+snwindow.width/2)/snakesize), 2)
				>= Math.pow(snwindow.width/2/snakesize, 2)) &&
				(!snwindow.blurry || Math.random() > 0.2)) { 
				return false;
			}
		}
		else {
			if(( point.x > (snwindow.x + snwindow.width)/snakesize || 
				point.y > (snwindow.y + snwindow.height)/snakesize ||
				point.x < snwindow.x/snakesize || point.y < snwindow.y/snakesize) &&
				(!snwindow.blurry || Math.random() > 0.2)) {
				return false;
			}
		}

		return true;
	}

	var checkPoint = function(point, sn) {
			var pointinwindow = false;
			for(var h=0; h<snakewindows.length; h++) {
				if(checkWindow(point, snakewindows[h])) {
					pointinwindow = true;
				}
			}
			if(!pointinwindow) {
				return false;
			}

			for(var k=-1; k<2; k++) {
				for(var r=-1; r<2; r++) {
					if(grid.length-1 < point.x+k || point.x+k < 0 ||
						grid[0].length-1 < point.y+r || point.y+r < 0) {
						return false;
					}
					else if (grid[point.x+k][point.y+r] != -1) {
						if(sn.id != -1 && grid[point.x+k][point.y+r] == sn.id) {
							var lastpoint = sn.points[sn.points.length-1];
							var slastpoint = sn.points[sn.points.length-2];
							if((lastpoint.x == point.x+k && lastpoint.y == point.y+r) ||
								(slastpoint != null && slastpoint.x == point.x+k && slastpoint.y == point.y+r)) {

							}
							else return false;
						}
						else return false;
					}
				}
			}

			return true;
		}


	var drawSnakes = function() {
		if(dieoff) {
			ctx.clearRect(0,0, canvas.width, canvas.height);
		}
		for(var i=0; i<snakes.length; i++) {
			if(snakes[i].points.length > 0 && (dieoff || snakes[i].deathCount > -1)) {
				ctx.beginPath();
				ctx.strokeStyle = snakes[i].getColor();
        ctx.lineWidth = snakes[i].snakesize;
				ctx.moveTo(snakes[i].points[0].x*snakesize, snakes[i].points[0].y*snakesize);
			
				for(var j=1; j<snakes[i].points.length; j++) {
					if(j == snakes[i].points.length-1 || 
						(snakes[i].points[j-1].x != snakes[i].points[j+1].x &&
						snakes[i].points[j-1].y != snakes[i].points[j+1].y))
					ctx.lineTo(snakes[i].points[j].x*snakesize, snakes[i].points[j].y*snakesize);
				}

				ctx.stroke();
			}
		}
	}

	var newFrame = function() {
		updateSnakes();
		drawSnakes();
		for(var h=0; h<snakewindows.length;h++) {
			snakewindows[h].updateSnakeWindow();
		}
    
		window.requestAnimFrame(newFrame);
	}

	var trackTouch = function(e){
		mouseX = e.touches[0].clientX;
		mouseY = e.touches[0].clientY;
	}

	window.addEventListener('mousemove', function(e){
		mouseX = e.clientX;
		mouseY = e.clientY;
	});
	window.addEventListener('touchstart', trackTouch);
	window.addEventListener('touchmove', trackTouch);

	window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
          window.setTimeout(callback, 1000 / 60);
        };
    })();

    window.cancelRequestAnimFrame = ( function() {
      return window.cancelAnimationFrame         ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame    ||
        window.oCancelRequestAnimationFrame      ||
        window.msCancelRequestAnimationFrame     ||
        clearTimeout
    } )();



//}

/* --- Global Functions --- */

Object.deepExtend = function(destination, source) {
  for (var property in source) {
    if (source[property] && source[property].constructor &&
     source[property].constructor === Object) {
      destination[property] = destination[property] || {};
      arguments.callee(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
};
