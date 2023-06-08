"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessLogout = exports.ProcessRegisterPage = exports.ProcessLogInPage = exports.DisplayRegisterPage = exports.DisplayLogInPage = void 0;
const passport_1 = __importDefault(require("passport"));
const utils_1 = require("../utils");
function DisplayLogInPage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.render('index-sub', { title: 'Sign In', page: 'auth/login', messages: req.flash('loginMessage'), displayName: (0, utils_1.UserDisplayName)(req) });
        }
        return res.redirect('/survey/manage');
    });
}
exports.DisplayLogInPage = DisplayLogInPage;
function DisplayRegisterPage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.render('index-sub', { title: 'Register', page: 'auth/register', messages: '', displayName: (0, utils_1.UserDisplayName)(req) });
        }
        return res.redirect('/survey/manage');
    });
}
exports.DisplayRegisterPage = DisplayRegisterPage;
function ProcessLogInPage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        passport_1.default.authenticate('login', {
            successRedirect: '/survey/active',
            failureRedirect: '/auth/login'
        });
    });
}
exports.ProcessLogInPage = ProcessLogInPage;
function ProcessRegisterPage(req, res, next) {
    passport_1.default.authenticate('signup', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.render('index-sub', { title: 'Register', page: 'auth/register', messages: req.flash('registerMessage', 'User Already Exists'), displayName: (0, utils_1.UserDisplayName)(req) });
        }
        return res.redirect('/auth/login');
    })(req, res, next);
}
exports.ProcessRegisterPage = ProcessRegisterPage;
function ProcessLogout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return err;
        }
        res.redirect('/');
    });
}
exports.ProcessLogout = ProcessLogout;
//# sourceMappingURL=user.js.map