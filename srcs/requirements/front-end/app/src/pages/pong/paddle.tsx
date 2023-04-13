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
		   this.PaddleElem.style.setProperty('--position', value);
	}

	get rect() {
		return this.PaddleElem.getBoundingClientRect();
	}
}