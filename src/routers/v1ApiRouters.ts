import { Router } from "express";
import YoutubeChatRouter from "../modules/youtube-chat/routers"

const v1ApiRouter = Router();

v1ApiRouter.get("/", (req: any, res: any) => {
    res.status(200).json({
      success: "true",
      data: "Api v1",
    });
  });

v1ApiRouter.use("/live-chat", YoutubeChatRouter);

export default v1ApiRouter;