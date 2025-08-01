"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.Role = void 0;
var Role;
(function (Role) {
    Role["AGENT"] = "AGENT";
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
})(Role || (exports.Role = Role = {}));
var Status;
(function (Status) {
    Status["ACTIVE"] = "ACTIVE";
    Status["SUSPENDED"] = "SUSPENDED";
    Status["BLOCKED"] = "BLOCKED";
})(Status || (exports.Status = Status = {}));
