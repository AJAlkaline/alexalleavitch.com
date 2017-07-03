var AlegreyaBlack = new FontFace('AlegreyaBlack', 'url(fonts/AlegreyaSansSC-Black.ttf)');

var guidecanvas = document.createElement('canvas');

AlegreyaBlack.load().then(function(font){
  	
    document.fonts.add(font);

    /* Guide lJS.canvas Test Code */

		var params = {
			guide: {
				canvas: guidecanvas,
				offsetX: 0,
				offsetY: 0,
				rendwidth: 0,
				rendheight: 0,
				drawFunc: function(guide) {
					guide.ctx.font = "43px AlegreyaBlack";
			    guide.ctx.strokeStyle = "rgb(0,0,0)";

			    guide.ctx.fillStyle = "#0f0f0f";
			    guide.ctx.lineWidth = 4;
			    guide.ctx.strokeText("Alex", guide.canvas.width/2 - 
			    		guide.ctx.measureText("Alex").width/2, 46);
			    guide.ctx.fillText("Alex", guide.canvas.width/2 - 
			    		guide.ctx.measureText("Alex").width/2, 46);
			    guide.ctx.strokeText("Alleavitch", guide.canvas.width/2 - 
			    		guide.ctx.measureText("Alleavitch").width/2, 76);
			    guide.ctx.fillText("Alleavitch", guide.canvas.width/2 - 
			    		guide.ctx.measureText("Alleavitch").width/2, 76);

			    guide.offsetX = Math.floor(guide.canvas.width/2 - 400/2);
			    guide.offsetY = 0;
			    guide.rendwidth = 400;
			    guide.rendheight = 200;
				}
			}
		}

    window.labyrinthsJS("labyrinths", params);
});