import express from 'express';
import { deleteUser, getAllUsers, updateUser } from '../controller/adminController.js';
import { checkAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',checkAdmin,getAllUsers)
router.delete('/:id',checkAdmin,deleteUser)
router.put('/',checkAdmin,updateUser)

export default router;