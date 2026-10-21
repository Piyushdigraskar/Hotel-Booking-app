import multer from "multer";

//Multer is a popular Node.js middleware primarily used for handling file uploads. It processes incoming HTML form submissions encoded as multipart/form-data
const upload = multer({storage: multer.diskStorage({})});
export default upload;

