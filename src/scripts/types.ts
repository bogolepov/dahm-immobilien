export interface IAddress {
	str: string;
	number: string | number;
	plz: string | number;
	city: string;
	distr?: string;
}

export interface IObjectInfo {
	address: IAddress;
	person: string[];
	photo: string[];
	type: string;
	google: string;
}

export interface IFromTo {
	von: string;
	bis: string;
	list?: string[];
}
export interface IFromToDays extends IFromTo {
	list: string[];
}
export interface IOfficeTime {
	days: IFromToDays;
	time: IFromTo;
}
export interface IPerson {
	sid: string;
	name: string;
	lastname: string;
	email: string;
	telephone: string;
	office_time: IOfficeTime;
	stelle?: string;
}
