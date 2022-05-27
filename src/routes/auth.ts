import { Router } from 'express';
import AuthController from '../controller/AuthController';
import { checkJwt } from '../middlewares/checkJwt';
import { checkMiddle } from '../middlewares/checkMiddleware';


const router = Router();

router.post('/signin', AuthController.authSession);
router.post('/all', AuthController.postUser);
router.get('/all', [checkJwt], AuthController.getAllUser);
router.post('/logout', AuthController.logout);
router.get('/all/:email', AuthController.getByEmail);
router.get('/search/:search', AuthController.getWhereUser);
// router.get('/search/:search', PostController.searchPost);
// router.put('/post/:id', PostController.updatePost)
router.patch('/post/:id', AuthController.updateUser)
router.delete('/post/:id', AuthController.deleteUser)

export default router;