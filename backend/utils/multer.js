import multer from "multer";
import DatauriParser from "datauri/parser.js";

const storage = multer.memoryStorage();
//configureing multer to appload single file
export const multerUploads = multer({ storage }).array("image",3);

const parser = new DatauriParser();

export const dataUri = (req) => {
  const encodedFiles = [];
  req.files.forEach((cur) => {
    //converts buffer to base64
    let base64 = new Buffer.from(cur.buffer, "base64").toString("base64");
    //adding cloudinary supporting format to base64
    let base64CloudinaryFormat = `data:image/jpeg;base64,${base64}`;
    encodedFiles.push({ data: base64CloudinaryFormat, filename: cur.originalname });
  });
  return encodedFiles;
};


//configureing multer to upload multiple files
export const multerMultipleUploads = multer({ storage }).array("image", 3);

// converting buffer to base64
export const base64Converter = (req) => {
  const encodedFiles = [];
  req.files.forEach((cur) => {
    //converts buffer to base64
    let base64 = new Buffer.from(cur.buffer, "base64").toString("base64");
    //adding cloudinary supporting format to base64
    let base64CloudinaryFormat = `data:image/jpeg;base64,${base64}`;
    encodedFiles.push({ data: base64CloudinaryFormat, filename: cur.originalname });
  });
  return encodedFiles;
};


