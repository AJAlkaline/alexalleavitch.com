
WebFontConfig = {
	google: {
    families: ['Alegreya Sans SC:700,900']
  },
	active: function() {
		var params = {
			bgcolor: '#1c1c1c',
			guide: {
				canvas: null,
				offsetX: 0,
				offsetY: 0,
				rendwidth: 500,
				rendheight: 100,
				drawFunc: function(guide) { 
					guide.ctx.font = '900 43px Alegreya Sans SC';
			    guide.ctx.strokeStyle = 'rgb(0,0,0)';

			    guide.ctx.fillStyle = '#efefef';
			    guide.ctx.lineWidth = 6;
			    
			    guide.ctx.strokeText('Alex', Math.floor(guide.canvas.width/2 - 
			    		Math.min(guide.ctx.measureText('Alex').width/2, guide.canvas.width/2-2)), 
			    		46, guide.canvas.width-4);
			    guide.ctx.fillText('Alex', Math.floor(guide.canvas.width/2 - 
			    		Math.min(guide.ctx.measureText('Alex').width/2, guide.canvas.width/2-2)), 
			   			46, guide.canvas.width-4);
			    guide.ctx.strokeText('Alleavitch', Math.floor(guide.canvas.width/2 - 
			    		Math.min(guide.ctx.measureText('Alleavitch').width/2, guide.canvas.width/2-2)), 
			   			76, guide.canvas.width-4);
			    guide.ctx.fillText('Alleavitch', Math.floor(guide.canvas.width/2 - 
			    		Math.min(guide.ctx.measureText('Alleavitch').width/2, guide.canvas.width/2-2)), 
			    		76, guide.canvas.width-4);
			    
			    

			    guide.offsetX = Math.floor(guide.canvas.width/2 - 500/2);
				}
			}
		}

    window.labyrinthsJS('labyrinths', params);
	}
}

WebFont.load(WebFontConfig);