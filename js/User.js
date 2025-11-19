

export class User {
	constructor(name, age) {
		this.name = name;
		this.age = age;
	}

	greet() {
		console.log(`Hello, I'm ${this.name}`);
	}
}
