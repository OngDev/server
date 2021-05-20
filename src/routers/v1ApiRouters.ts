import { Router } from "express";
import YoutubeChatRouter from "@modules/youtube-chat/routers"

const v1ApiRouter = Router();

v1ApiRouter.get("/", (_req: any, res: any) => {
    res.setStatus(200).json({
      success: "true",
      data: "Api v1",
    });
  });

v1ApiRouter.use("/live-chat", YoutubeChatRouter);

export default v1ApiRouter;