"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = (0, express_1.Router)();
router.get('/login', user_1.DisplayLogInPage);
router.post('/login', auth_1.default.authenticate('login', { successRedirect: '/survey/manage', failureRedirect: '/auth/login' }));
router.get('/register', user_1.DisplayRegisterPage);
router.post('/register', user_1.ProcessRegisterPage);
router.get('/logout', user_1.ProcessLogout);
exports.default = router;
//# sourceMappingURL=user.js.map