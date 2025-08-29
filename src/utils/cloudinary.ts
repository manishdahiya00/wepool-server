import { v2 as cloudinary } from "cloudinary";
import { Config } from "../config";

cloudinary.config({
    cloud_name: Config.CLOUDINARY_CLOUD_NAME,
    api_key: Config.CLOUDINARY_API_KEY,
    api_secret: Config.CLOUDINARY_API_SECRET,
});

export const getPublicIdFromUrl = (url: string): string | null => {
    try {
        const parts = url.split("/");
        const fileWithExt = parts.pop(); // last part
        if (!fileWithExt) return null;
        const [publicId] = fileWithExt.split("."); // remove extension
        const folder = parts.slice(parts.indexOf("upload") + 1).join("/"); // keep folder
        return folder ? `${folder}/${publicId}` : publicId;
    } catch (err) {
        return null;
    }
};

export default cloudinary;
