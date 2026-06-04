import { Router } from "express";
import { createPost, deletePost, getPosts } from "../../controllers/post.js";
import { upload } from "../../config/cloudinary.js";
import { authMiddleware } from "../../middlewares/auth.js";

const router = Router();

router.post('/', upload.single('file'), authMiddleware, createPost);

router.get('/', authMiddleware, getPosts)
router.delete('/:postId', authMiddleware, deletePost);

export default router;