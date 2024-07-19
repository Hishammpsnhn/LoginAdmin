import express from 'express';
import { deleteUser, getAllUsers, updateUser,getUser, searchUsers,createUser } from '../controller/adminController.js';
import { checkAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',checkAdmin,getAllUsers)
router.get('/user/:id',checkAdmin,getUser)

router.get('/search', searchUsers);
router.delete('/:id',checkAdmin,deleteUser)
router.post('/createUser',checkAdmin,createUser)
router.post('/:id',checkAdmin,updateUser)

export default router;