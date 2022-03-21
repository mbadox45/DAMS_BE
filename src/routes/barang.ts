import { Router } from 'express';
import BarangController from '../controller/BarangController';


const router = Router();

router.get('/barang/all', BarangController.getAllBarang);
router.post('/barang/all', BarangController.createBarang);
router.post('/barang/update', BarangController.updateBarang);
router.post('/barang/delete', BarangController.deleteBarang);

export default router;