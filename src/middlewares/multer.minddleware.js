import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    let {username}=req.body || req.user?.username
    // console.log(req.user)
    // console.log(username)
    const uniqueSuffix = Date.now() + "-"  ;
    cb(null,username+"_"+file.originalname +"-"+ file.fieldname + "-" + uniqueSuffix);
    //   file.originalname - to save with original name
  },
});

export const upload = multer({ storage });
