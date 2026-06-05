import { Router } from "express";
import { login, profile, signup } from "../../controllers/user.js";

import { authMiddleware } from "../../middlewares/auth.js";

const router = Router();

router.post('/login', login);

router.post('/signup', signup);

router.get('/profile', authMiddleware, profile);

export default router;