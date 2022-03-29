import { Router } from 'express';
import ContractController from '../controller/ContractController';


const router = Router();

router.get('/contract/all', ContractController.getAllContract);
router.get('/contract/all/:id_contract', ContractController.getIdContract);
router.post('/contract/all', ContractController.postContract);
router.post('/contract/update', ContractController.updateContract);
router.post('/contract/delete', ContractController.deleteContract);

export default router;