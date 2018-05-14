import { firestore } from "firebase/app";

export class User {

	uid: string;
	name: string;
	email: string;
	lastname: string;
	password: string;
	confirm: string;
	gender: string;
	yob: number;
	handicap: number;
	hand: string;
	tees: string;
	clubs: Club[];
	friends: Friend[];
	locale: string;
	fullname: string
	picture: string;


	constructor() {
		this.clubs = [
			{ type: "D", c_number: "", dist_from: 210, dist_to: 230, isCarried: true },
			{ type: "W", c_number: "3", dist_from: 190, dist_to: 210, isCarried: true },
			{ type: "W", c_number: "4", dist_from: 180, dist_to: 200, isCarried: false },
			{ type: "W", c_number: "5", dist_from: 170, dist_to: 190, isCarried: true },
			{ type: "W", c_number: "6", dist_from: 160, dist_to: 180, isCarried: false },
			{ type: "W", c_number: "7", dist_from: 150, dist_to: 170, isCarried: false },
			{ type: "H", c_number: "3", dist_from: 160, dist_to: 170, isCarried: true },
			{ type: "H", c_number: "4", dist_from: 150, dist_to: 160, isCarried: false },
			{ type: "H", c_number: "5", dist_from: 140, dist_to: 150, isCarried: false },
			{ type: "I", c_number: "2", dist_from: 160, dist_to: 180, isCarried: true },
			{ type: "I", c_number: "3", dist_from: 150, dist_to: 170, isCarried: true },
			{ type: "I", c_number: "4", dist_from: 140, dist_to: 160, isCarried: true },
			{ type: "I", c_number: "5", dist_from: 130, dist_to: 150, isCarried: true },
			{ type: "I", c_number: "6", dist_from: 120, dist_to: 140, isCarried: true },
			{ type: "I", c_number: "7", dist_from: 110, dist_to: 130, isCarried: true },
			{ type: "I", c_number: "8", dist_from: 100, dist_to: 120, isCarried: true },
			{ type: "I", c_number: "9", dist_from: 90, dist_to: 110, isCarried: true },
			{ type: "J", c_number: "", dist_from: 10, dist_to: 90, isCarried: true },
			{ type: "S", c_number: "50º", dist_from: 10, dist_to: 70, isCarried: false },
			{ type: "S", c_number: "52º", dist_from: 10, dist_to: 70, isCarried: false },
			{ type: "S", c_number: "54º", dist_from: 10, dist_to: 70, isCarried: false },
			{ type: "S", c_number: "56º", dist_from: 10, dist_to: 70, isCarried: true },
			{ type: "S", c_number: "58º", dist_from: 10, dist_to: 70, isCarried: false },
			{ type: "S", c_number: "60º", dist_from: 10, dist_to: 70, isCarried: false },
			{ type: "S", c_number: "62º", dist_from: 10, dist_to: 70, isCarried: false },
			{ type: "P", c_number: "", dist_from: 0, dist_to: 20, isCarried: true }
		]
	}
}

export class Club {
	type: string;
	c_number: string;
	dist_from: number;
	dist_to: number;
	isCarried: boolean;

	constructor() { }
}

export class Friend {
	uid: string;
	isAccepted: boolean;

	constructor() { }
}

export class Course {
	name: string;
	slope_MB: number;
	slope_MY: number;
	slope_MBl: number;
	slope_MR: number;
	slope_FY: number;
	slope_FBl: number;
	slope_FR: number;
	
	sss_MB: number;
	sss_MY: number;
	sss_MBl: number;
	sss_MR: number;
	sss_FY: number;
	sss_FBl: number;
	sss_FR: number;

	courseId: string;
	holeNumber: number;
	holes: any[];

	constructor() {
		this.holeNumber=18;
		this.holes = [];
		for (let index = 0; index < 18; index++) {
			this.holes.push({ num: index + 1, handicap: null, holeId: "" });

		}
		console.log(this.holes);

	}
}
export class Hole {
	gfar: firestore.GeoPoint;
	gmid: firestore.GeoPoint;
	gnear: firestore.GeoPoint;
	hole: firestore.GeoPoint;
	holeId: string;
	par: number;
	num: number;

	constructor() { }
}

export class Game {
	club: string;
	course: string;
	formula: string;
	participants: string[];
	teamA: string[];
	teamB: string[];
	date: Date;
	currentHoleNumber: number;
	currentHole: string;
	isOpen: boolean;
	courseComplete: Course;

	constructor() {
		this.participants = [];
		this.date = new Date();
		this.currentHoleNumber = 1;
		this.isOpen = true;
	}
}

export class Facility {
	name: string;
	address: string;
	tel: string;
	web: string;
	position: firestore.GeoPoint;
	clubId: string;

	constructor(lat, long) {
		this.position = new firestore.GeoPoint(lat, long);
	}
}