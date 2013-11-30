function Rock(context,x,y){	
	var img = new Image();
	img.src = "image/rock.png";
	this.size = Math.floor(Math.random()*40+20);
	this.left = x;
	this.top = y;
	this.right = this.left+this.size;
	this.bottom = this.top+this.size;
	
	// get image data
	context.drawImage(img,this.left,this.top,this.size,this.size);
	this.imageData = context.getImageData(this.left,this.top,this.size,this.size);

	this.draw = function(context){
		context.drawImage(img,this.left,this.top,this.size,this.size);
	}
	
	// check if a point is inside this rock
	this.contains = function(x,y){
		x -= this.left;
		y -= this.top;
		if(x < 0 || x > this.size || y < 0 || y > this.size)
			return false;
		var index = Math.floor((x+y*this.size))*4+3;
		return this.imageData.data[index]!=0;
	}
}