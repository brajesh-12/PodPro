import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 5 * 1024 * 1024, // 5mb limit
  },
  // fileFilter: (req, file, cb) => {
  //   if(file.mimetype.startsWith('image/')) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error('Only image are allowed!'), false);
  //   }
  // }
});

export default upload;