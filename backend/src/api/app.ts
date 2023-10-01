import express from 'express';
import deployContractsRoute from './routes/deployContractsRoute';

const app = express();

app.use(express.json()); // for parsing application/json

// Define the route
app.use('/deploy', deployContractsRoute);

export default app;
