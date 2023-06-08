import { Router } from "express";
import { DisplayLogInPage, DisplayRegisterPage, ProcessLogout, ProcessRegisterPage } from "../controllers/user";
import passport from "../middlewares/auth";

const router = Router();

// LogIn Page: DISPLAY 
router.get('/login', DisplayLogInPage);

// LogIn Page: PROCESS
router.post('/login', passport.authenticate('login', {successRedirect: '/survey/manage', failureRedirect: '/auth/login'}));

// Register Page: DISPLAY
router.get('/register', DisplayRegisterPage);

// Register Page: PROCESS
router.post('/register', ProcessRegisterPage);

// Logout 
router.get('/logout', ProcessLogout);

export default router;