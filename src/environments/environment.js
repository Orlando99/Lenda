"use strict";
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    production: false,
    //apiUrl: 'http://lendav2api.azurewebsites.net/',
    //apiUrl: 'http://lendav3api.azurewebsites.net/',
    apiUrl: 'http://localhost:61002/',
    loankey: "currentselectedloan",
    loankey_copy: "rawcurrentselectedloan",
    logpriority: "logpriority",
    croppriceskey: "cropprices"
};
//# sourceMappingURL=environment.js.map