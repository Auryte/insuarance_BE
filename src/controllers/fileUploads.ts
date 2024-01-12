import { Request, Response, NextFunction } from 'express';
import { uploadFromBuffer } from 'helpers/cloudinaryUploader';

const uploadLogo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.is(['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'])) {
      res.status(400).json({
        status: false,
        message: 'Logo must be an image of jpeg, jpg, png, svg or webp format.'
      });
      return;
    }
    const logoFolder = 'logo';
    const height = 720;
    const url = await uploadFromBuffer(req, logoFolder, height);
    res.status(200).json({ status: true, message: 'Logo successfully uploaded.', data: url });
  } catch (error) {
    next(error);
  }
};

export default { uploadLogo };
