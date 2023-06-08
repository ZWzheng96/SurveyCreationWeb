import express from 'express';
import { DisplayHomePage } from '../controllers';
const router = express.Router();

// Get Home Page  
router.get('/', DisplayHomePage);

// Get Home Page (/home)
router.get('/home', DisplayHomePage);

export default router;
