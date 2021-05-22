import { Request, Response, Router } from "express";
import { getGithubStats, getYoutubeStats } from "./service";

const statsRouter = Router()

statsRouter.get('/github', async (req: Request, res: Response) => {
    res.status(200).send(await getGithubStats());
});
statsRouter.get('/youtube', async (req: Request, res: Response) => {
    res.status(200).send(await getYoutubeStats());
});

export default statsRouter