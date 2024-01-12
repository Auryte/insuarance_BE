import { Router } from 'express';
import imageController from '../controllers/fileUploads';

const imageRouter = Router();

imageRouter.post('/upload', imageController.uploadLogo);

export default imageRouter;
