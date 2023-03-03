export class Paddle {
	PaddleElem: any;
	
	constructor(PaddleElem: any) {
		this.PaddleElem = PaddleElem;
	}

	get position() {
		return parseFloat(getComputedStyle(this.PaddleElem).getPropertyValue('--position'));

	}

	set position(value: number) {
		if (this.PaddleElem === null)
		{
			return;
		}
		// console.log("position =", value);
		   this.PaddleElem.style.setProperty('--position', value);
	}
}