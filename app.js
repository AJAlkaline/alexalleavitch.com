var guidecanvas = document.createElement('canvas');

var setbgcolor = '#1c1c1c';

document.body.style.backgroundColor = setbgcolor;

var AlegreyaBlack = new FontFace('AlegreyaBlack', 'url(fonts/AlegreyaSansSC-Black.ttf)');
// load font first so it can be used for drawing on the guide canvas
AlegreyaBlack.load().then(function(font){
  	
    document.fonts.add(font);

    /* labyrinths.js params */

		var params = {
			bgcolor: setbgcolor,
			guide: {
				canvas: guidecanvas,
				offsetX: 0,
				offsetY: 0,
				rendwidth: 500,
				rendheight: 200,
				drawFunc: function(guide) { 
					guide.ctx.font = "43px AlegreyaBlack";
			    guide.ctx.strokeStyle = "rgb(0,0,0)";

			    //guide.ctx.fillStyle = "#0f0f0f";
			    guide.ctx.fillStyle = "#efefef";
			    guide.ctx.lineWidth = 6;
			    
			    
			    guide.ctx.strokeText("Alex", Math.floor(guide.canvas.width/2 - 
			    		Math.min(guide.ctx.measureText("Alex").width/2, guide.canvas.width/2-2)), 
			    		46, guide.canvas.width-4);
			    guide.ctx.fillText("Alex", Math.floor(guide.canvas.width/2 - 
			    		Math.min(guide.ctx.measureText("Alex").width/2, guide.canvas.width/2-2)), 
			   			46, guide.canvas.width-4);
			    guide.ctx.strokeText("Alleavitch", Math.floor(guide.canvas.width/2 - 
			    		Math.min(guide.ctx.measureText("Alleavitch").width/2, guide.canvas.width/2-2)), 
			   			76, guide.canvas.width-4);
			    guide.ctx.fillText("Alleavitch", Math.floor(guide.canvas.width/2 - 
			    		Math.min(guide.ctx.measureText("Alleavitch").width/2, guide.canvas.width/2-2)), 
			    		76, guide.canvas.width-4);
			    
			    

			    guide.offsetX = Math.floor(guide.canvas.width/2 - 500/2);
				}
			}
		}

    window.labyrinthsJS("labyrinths", params);
});