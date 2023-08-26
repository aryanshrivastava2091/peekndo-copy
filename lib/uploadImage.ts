import { ID, storage } from "@/appwrite"



const uploadImage = async(file:File)=>{
    if (!file) return;

    const fileUploaded = await storage.createFile(
        "64e71dc002c8563f9442",
        ID.unique(),
        file
    );
    return fileUploaded;

}
export default uploadImage