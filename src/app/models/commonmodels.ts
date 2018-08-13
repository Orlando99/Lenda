export class User {
	id: number;
	userName: string;
	password: string;
	role: Role;
}
export class errormodel{
    errorsection : string;
    cellid : string;
    details:string[];
    ToolTipText?:string;
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
