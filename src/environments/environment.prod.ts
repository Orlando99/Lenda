import { Logpriority } from "../app/models/loanmodel";

export const environment = {
  production: true,
  // apiUrl: 'http://localhost:61002/',
  // apiUrl: 'http://lendav1api.azurewebsites.net',
  apiUrl: 'http://lendav2api.azurewebsites.net',
  loankey: "currentselectedloan",
  loankey_copy: "rawcurrentselectedloan",
  logpriority: "logpriority",
  referencedatakey: "refdata",
  uid: "userid",
  loanidkey: "selectedloanId",
  collateralTables: "collateralTables",
  isDebugModeActive: true,
  localStorage: {
    userRole: 'userRole'
  },
  usersession:"sessionid",
  errorbase:"errors",
  exceptionStorageKey : "exceptions",
  modifiedbase:"changedvalues",
  syncRequiredItems: "syncRequiredItems"
};

