
export class Ball {
	
	BallElem: any;
	vector: {x: number, y: number}/*  = {x: 0, y: 0} */;
	velocity: number = 0.25;

	constructor(BallElem: any)
	{
		this.vector = {x: 0.1, y: 0.1};
		this.BallElem = BallElem;
		this.reset();
		// console.log('constructor =', this.BallElem);
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

	//Get the position of the ball
	rect() {
		/* retourne un objet DOMRect fournissant des informations sur la taille d'un élément
		 et sa position relative par rapport à la zone d'affichage. */
		return this.BallElem.getBoundingClientRect();
	}

	reset() {
		this.x = 50;
		this.y = 50;
		this.vector = { x: 0, y: 0};
		
		// make random direction, but not too much up or down
		// while (1)
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
		this.x += this.vector.x * this.velocity * delta;
		this.y += this.vector.y * this.velocity * delta;
		const rect = this.rect();

		if (rect.top <= 0 || rect.bottom >= window.innerHeight) {
			console.log("outtttt")
			console.log("delta = ", delta, " x = ", this.x, " y = ", this.y, " vectorX = ", this.vector.x, " vectorY = ", this.vector.y , " velocity = ", this.velocity, " ball = ", this.BallElem);

			this.vector.y *= -1;
		}

		if (rect.left <= 0 || rect.right >= window.innerWidth) {
			console.log("outtttt")
			console.log("delta = ", delta, " x = ", this.x, " y = ", this.y, " vectorX = ", this.vector.x, " vectorY = ", this.vector.y , " velocity = ", this.velocity, " ball = ", this.BallElem);

			this.vector.x *= -1;
		}
		// if (rect.top < 0 || rect.bottom > window.innerHeight) {
		// 	console.log("outtttt")
		// 	this.vector.y *= -1;
		// }

		// console.log("delta = ", delta, " x = ", this.x, " y = ", this.y, " vectorX = ", this.vector.x, " vectorY = ", this.vector.y , " velocity = ", this.velocity, " ball = ", this.BallElem);
	}
}