import { Router } from "express";
import { login, signup } from "../../controllers/User.js";
import { profile } from "node:console";

const router = Router();

router.post('/login', login);

router.post('/signup', signup);

router.get('/profile', profile);

export default router;