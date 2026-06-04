import { Router } from "express";
import UserRoutes from './v1/user.js';
import PostRoutes from './v1/post.js'



const router = Router();

router.use('/user', UserRoutes)
router.use('/post',  PostRoutes)

export default router;