import { Request, Response, Router } from "express";
import rateLimit from "express-rate-limit";
import { getGithubStats, getYoutubeStats } from "./service";

const statApiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
})
const statsRouter = Router()

statsRouter.get('/github', statApiRateLimiter, async (req: Request, res: Response) => {
    res.status(200).send(await getGithubStats());
});
statsRouter.get('/youtube', statApiRateLimiter, async (req: Request, res: Response) => {
    res.status(200).send(await getYoutubeStats());
});

export default statsRouter