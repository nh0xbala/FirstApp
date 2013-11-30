function Map(context,canvas, onCompleted /* callback function */) {
	var backgroundImg = new Image();	
	
	var checkPoints = [{x: 480,y: 240},{x: 250,y: 40},{x: 30,y: 180},{x: 270,y: 300}];
	var rockPos = [150,70,310,80,110,210,270,220,210,340,20,270,405,200,360,160,70,160]; 
	var timer;
	this.rocks = [];	
	this.width = canvas.width;
	this.height = canvas.height;	
	this.imageData = null;
	var self = this;
	backgroundImg.onload = function(){
		// get the imagedata of background image
		if(self.imageData)
		{
			if(onCompleted);
				onCompleted();
			return;
		}
		context.drawImage(backgroundImg,0,0,self.width,self.height);
		self.imageData = context.getImageData(0,0,self.width,self.height);
		
		// create rocks
		for(var i=0;i<rockPos.length;i+=2)
		{
			canvas.width = canvas.width; // clear canvas
			self.rocks.push(new Rock(context,rockPos[i],rockPos[i+1]));
		}
				
		backgroundImg.src = "image/map1.png";	
	};
	
	backgroundImg.src = "image/map1-plain.png";	
	
	this.reset = function(){
		this.totalSeconds = 0;
		this.currentCheckPoint = 0;
		this.currentLap = 1;
	};
	
	this.showStartScreen = function(context,canvas,onCompleted){
		this.draw(context);
		var self = this;
		var img = new Image();
		clearInterval(timer);
		img.onload = function(){
			context.fillStyle = "rgba(0,0,0,0.6)";
			context.fillRect(0,0,canvas.width,canvas.height);
			context.fillStyle = "rgba(250,250,250,0.8)";
			context.fillRect(50,50,canvas.width-100,canvas.height-100);		
			context.drawImage(img,(canvas.width-img.width)/2,100,img.width,img.height);			
			context.font = "14px Arial";
			context.fillStyle = "black";
			context.fillText("Click anywhere to start",180,300);

			var onclick = function(){
				// START GAME
				if(onCompleted)
					onCompleted();
				
				timer = window.setInterval(function(){
					self.totalSeconds++;
				},1000);
				
				canvas.removeEventListener('click', onclick);
			};
			canvas.addEventListener("click", onclick);
		};
		img.src = "image/logo.png";
	};
	
	this.draw = function(context){
		context.drawImage(backgroundImg,0,0,this.width,this.height);
		context.fillStyle = "rgba(255,255,255,0.5)";
		context.fillRect(2,2,100,50);
		context.fillStyle = "black";
		context.fillText("Lap: "+this.currentLap,10,20);
		context.fillText("Time: "+this.getTotalTime(),10,40);
		// draw check points
		
		for(var i=0;i<checkPoints.length;i++)
		{
			if(i==this.currentCheckPoint)
				context.fillStyle = "orange";
			else
				context.fillStyle = "red";
			context.beginPath();
			context.arc(checkPoints[i].x, checkPoints[i].y, CHECKPOINT_SIZE/2, 0 , 2 * Math.PI, false);
			context.fill();
			context.fillStyle = "white";
			context.fillText(i,checkPoints[i].x,checkPoints[i].y);
		}
		
		// draw rocks
		for(var i=0;i<this.rocks.length;i++)
		{
			this.rocks[i].draw(context);
		}		
	};
	
	this.reachNextCheckPoint = function(x,y){
		var index = this.currentCheckPoint==checkPoints.length-1?0:this.currentCheckPoint+1;
		var p = checkPoints[index];
		var dx = x-p.x;
		var dy = y-p.y;
		var d = Math.sqrt(dx*dx+dy*dy);
		if(d<=CHECKPOINT_SIZE)
		{
			this.currentCheckPoint = index;
			return true;
		}
		return false;
	};
	
	// helper methods
	this.getTotalTime = function ()
	{		
		var hours = Math.floor(this.totalSeconds / (60 * 60));

		var divisor_for_minutes = this.totalSeconds % (60 * 60);
		var minutes = Math.floor(divisor_for_minutes / 60);

		var divisor_for_seconds = divisor_for_minutes % 60;
		var seconds = Math.ceil(divisor_for_seconds);
		
		return hours+"h:"+minutes+"m:"+seconds+"s";
	};
}