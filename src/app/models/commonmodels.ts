export class User {
	id: number;
	userName: string;
	password: string;
	role: Role;
}
export class errormodel{
    tab : string;
    cellid : string;
	details:string[];
	chevron:string; 
	ToolTipText?:string;
	level:validationlevel;
}

export enum validationlevel{
	level1,
	level2
}
export class ExceptionModel{
    section : string;
    message : string;
	level : number;
	questionId : number;
}
export enum Role {
	user = 1,
	admin = 2
}

export const Users: User[] = [
	{ 
		id: 1,
		userName: 'Admin',
		password: 'Admin',
		role: Role.admin
	},{ 
		id: 2,
		userName: 'Tarjeet',
		password: 'Tarjeet',
		role: Role.user
	},{ 
		id: 3,
		userName: 'Suresh',		
		password: 'Suresh',				
		role: Role.user
	},{ 
		id: 4,
		userName: 'Sanket',
		password: 'Sanket',		
		role: Role.user
	},{ 
		id: 5,
		userName: 'Sandeep',
		password: 'Sandeep',			
		role: Role.user
	},{ 
		id: 6,
		userName: 'Alyssa',
		password: 'Alyssa',				
		role: Role.user
	}
];	


export const Chevronkeys = {
	InsurancePolices: "InsPolicies",
	
  };