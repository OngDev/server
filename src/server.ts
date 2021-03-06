import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { createServer } from "http";
import { Server } from "socket.io";
import v1ApiRouter from "./routers/v1ApiRouters"
import 'module-alias/register';
import cron from 'cron';

import { PORT } from './env';
import log from './logger';
import { fetchGithubStats, fetchYoutubeStats } from './modules/dashboard/service';

const { CronJob } = cron;
const job = new CronJob('* * * * *', async () => {
  log.info('Fetching all stats');
  await fetchYoutubeStats();
  await fetchGithubStats();
});

job.start();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});

app.use(helmet());
app.use(morgan('tiny'))
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => res.send('Express + TypeScript Server'));

app.use('/api/v1', v1ApiRouter)

httpServer.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at ${PORT}`);
});

export default io;