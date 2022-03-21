import { Router } from 'express';
import WBController from '../controller/WBController';


const router = Router();

// Weightbridge
router.get('/wb/truck_in', WBController.getAllByStatusTruck);
router.get('/wb/truck_all', WBController.getAllTruck);
router.get('/wb/truck_all/:id', WBController.getLoadByNotiket);
router.post('/wb/truck_in', WBController.postTruckIn);
router.post('/wb/truck_up', WBController.updateTruckIn);
router.post('/wb/reject', WBController.rejectTicket);
router.post('/wb/checkout', WBController.checkOutTruck);

export default router;