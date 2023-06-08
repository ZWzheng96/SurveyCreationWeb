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
exports.isLoggedIn = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const user_1 = __importDefault(require("../models/user"));
const LocalStrategy = passport_local_1.default.Strategy;
const strategyOptions = {
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
};
const loginFunction = (req, username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ username });
    if (!user) {
        return done(null, false, { message: "Error #1: User does not exist" });
    }
    ;
    if (!(yield user.isValidPassword(password))) {
        return done(null, false, { message: "Error #2: Password is not valid" });
    }
    ;
    return done(null, user);
});
const signupFunction = (req, username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, confirmPassword, firstName, lastName, email } = req.body;
        console.log(req.body);
        if (!username || !password || !confirmPassword || !email || !firstName || !lastName) {
            return done(null, false, { message: 'Error: Missing input data(s)' });
        }
        else if (password !== confirmPassword) {
            return done(null, false, { message: 'Error: Password confirmation failed' });
        }
        const query = {
            $or: [{ username: username }, { email: email }]
        };
        console.log(query);
        const user = yield user_1.default.findOne(query);
        if (user) {
            console.log(user);
            return done(null, false, { message: 'Error: User already exists' });
        }
        else {
            const userData = {
                username,
                password,
                email,
                displayName: firstName + " " + lastName
            };
            const newUser = new user_1.default(userData);
            yield newUser.save();
            return done(null, newUser);
        }
    }
    catch (err) {
        done(err);
    }
});
passport_1.default.use('login', new LocalStrategy(strategyOptions, loginFunction));
passport_1.default.use('signup', new LocalStrategy(strategyOptions, signupFunction));
const isLoggedIn = (req, res, done) => {
    if (!req.user) {
        console.log(' Redirecting: /auth/login ');
        return res.redirect('/auth/login');
    }
    done(null, req.user);
};
exports.isLoggedIn = isLoggedIn;
;
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((userId, done) => {
    user_1.default.findById(userId, function (err, user) {
        done(err, user);
    });
});
exports.default = passport_1.default;
//# sourceMappingURL=auth.js.map