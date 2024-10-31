import express, { Request, Response, Application } from 'express';
import { PORT as port } from './utils/envConfig';

import branchRouter from './routes/branch.routes'

const PORT = Number(port) || 8000;

const app: Application = express();

app.use(express.json());

app.use("/branch", branchRouter);


app.listen(PORT, () => {
    console.log(`Server jalan di ${PORT}`)
})

export default app;


