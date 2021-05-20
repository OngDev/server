import { Request, Response, Router } from "express";
import { archiveMessage, getAuthors, getMessages, initialize, stopFetching } from "./service";
import { MessageTypeEnum } from "./types";

const youtubeRouter = Router()

youtubeRouter.get('/messages', async (req: Request, res: Response) => {
    const {type} = req.query;
    res.send(await getMessages(type?.toString() || MessageTypeEnum.TEXT));
});
youtubeRouter.get('/authors', async (req: Request, res: Response) => {
    res.send(getAuthors());
});
youtubeRouter.get('/init', async (req: Request, res: Response) => {
    res.send(await initialize());
})
youtubeRouter.get('/stop', (req: Request, res: Response) => {
    stopFetching();
    res.status(200).end();
})
youtubeRouter.get('/messages/:id/archive', async (req: Request, res: Response) => {
    const {id} = req.params;
    const isArchived = await archiveMessage(id);
    res.status(200).send(isArchived);
});

export default youtubeRouter