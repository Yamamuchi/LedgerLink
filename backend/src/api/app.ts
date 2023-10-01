import express from 'express';
import deployContractsRoute from './routes/deployContractsRoute';

const app = express();
const cors = require('cors');

app.use(express.json()); // for parsing application/json
app.use(cors());

// Define the route
app.use('/deploy', deployContractsRoute);

export default app;
