import { Router } from 'express';
import LogController from '../controller/LogController';


const router = Router();

// Weightbridge
router.get('/log/all/:no_tiket', LogController.getLog);
router.get('/log/activity/:user_id', LogController.getLogByName);
// router.post('/wb/truck_in', WBController.postTruckIn);

export default router;