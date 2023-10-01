import { Router } from 'express';
import { deploySmartContracts } from '../controllers/deployContractsController';

const deployContractsRoute = Router();

deployContractsRoute.post('/deploy', deploySmartContracts);  // Use POST to receive the contract source code

export default deployContractsRoute;
