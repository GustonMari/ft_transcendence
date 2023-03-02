
export class Ball {
	
	BallElem: any;
	vector: {x: number, y: number} = {x: 0, y: 0};
	velocity: number = 0.25;

	constructor(BallElem: any)
	{
		this.BallElem = BallElem;
		console.log('constructor =', this.BallElem);
	}
	
	/*
	getComputedStyle() is a built-in JavaScript function 
	that returns an object containing the computed style properties of an element.

	getComputedStyle(this.BallElem).getPropertyValue('--x') 
	returns the value of the --x custom CSS property that is set 
	on the this.BallElem element as a string. */

	get x() {
		//convert into a float
		return parseFloat(getComputedStyle(this.BallElem).getPropertyValue('--x'));
	}

	set x(value: number) {
	 if (this.BallElem === null)
	 {
		 return;
	 }
		this.BallElem.style.setProperty('--x', value.toString());
	}

	get y() {
		//convert into a float
		return parseFloat(getComputedStyle(this.BallElem).getPropertyValue('--y'));
	}

	set y(value: number) {
	 if (this.BallElem === null)
	 {
		console
		 return;
	 }
		this.BallElem.style.setProperty('--y', value.toString());
	}

	reset() {
		this.x = 50;
		this.y = 50;
		this.vector = { x: 0, y: 0};
		

		// make random direction, but not too much up or down
		while (Math.abs(this.vector.x) <= .2 || Math.abs(this.vector.x) >= .9)
		{
			//generate a random number between 0 and 2PI (360 degrees)
			const heading = Math.random() * 2 * Math.PI;
			this.vector = { x: Math.cos(heading), y: Math.sin(heading) };
		}
		//initial velocity
		this.velocity = .025;
	}

	update(delta: number) {
		// this.x = 5;
		// this.y = 18;
		console.log("delta = ", delta, " x = ", this.x, " y = ", this.y, " vectorX = ", this.vector.x, " vectorY = ", this.vector.y , " velocity = ", this.velocity, " ball = ", this.BallElem);
		this.x += this.vector.x * this.velocity * delta;
		this.y += this.vector.y * this.velocity * delta;
	}
}