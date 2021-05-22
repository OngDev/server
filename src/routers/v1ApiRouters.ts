import { Request, Response, Router } from "express";
import YoutubeChatRouter from "../modules/youtube-chat/routers"
import StatsRouter from "../modules/dashboard/routers"

const v1ApiRouter = Router();

v1ApiRouter.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      success: "true",
      data: "Api v1",
    });
  });

v1ApiRouter.use("/live-chat", YoutubeChatRouter);
v1ApiRouter.use("/stats", StatsRouter);

export default v1ApiRouter;