import express from "express";
import { deleteFile, downloadFile, upload, uploadFile } from "../controllers/storage.controller.js";
import { getServerStatus } from "../utils/status.js";
import { checkApiKey } from "../middlewares/auth.middleware.js";

const imageRouter = express.Router();

imageRouter.get('/', getServerStatus);
imageRouter.get('/files', checkApiKey, downloadFile);
imageRouter.post('/files',checkApiKey, upload.single('file'), uploadFile);
imageRouter.delete('/files', checkApiKey, deleteFile);

export default imageRouter;