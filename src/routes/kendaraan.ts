import { Router } from 'express';
import KendaraanController from '../controller/KendaraanController';


const router = Router();

// Kendaraan
router.get('/kendaraan/all', KendaraanController.getAllKendaraan);
router.get('/kendaraan/all/:id', KendaraanController.getByIdKendaraan);
router.post('/kendaraan/all', KendaraanController.postKendaraan);
router.post('/kendaraan/update', KendaraanController.editKendaraan);
router.post('/kendaraan/delete', KendaraanController.deleteKendaraan);
router.get('/kendaraan/view', KendaraanController.getViewKendaraan);

// Angkutan
router.get('/angkutan/all', KendaraanController.getAllAngkutan);
router.post('/angkutan/all', KendaraanController.postAngkutan);
router.post('/angkutan/update', KendaraanController.editAngkutan);
router.post('/angkutan/delete', KendaraanController.deleteAngkutan);
router.get('/angkutan/all/:id_kendaraan', KendaraanController.getByIdAngkutan);

export default router;