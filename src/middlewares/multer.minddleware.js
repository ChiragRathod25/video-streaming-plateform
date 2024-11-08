import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const {username}=req.body
    const uniqueSuffix = Date.now() + "-"  ;
    cb(null,username+file.originalname +"-"+ file.fieldname + "-" + uniqueSuffix);
    //   file.originalname - to save with original name
  },
});

export const upload = multer({ storage });
