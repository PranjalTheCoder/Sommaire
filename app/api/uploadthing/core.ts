import { currentUser } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";

import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "32MB" } })
    .middleware(async ({ req }) => {
      //get user Information from the request
      const user = await currentUser();

      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload Completed for user id", metadata.userId);
      // console.log("File URL", file.url);
      //save the file url to the database
      // console.log("File URL", file.url);
      return {
        userId: metadata.userId,
        fileUrl: file.url,
        fileName: file.name,
      };
      // return { fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
