"use client";
import React from "react";
import { useDropzone } from "react-dropzone";
import { IconInbox } from "@tabler/icons-react";
import { uploadToS3 } from "@/lib/s3";

const FileUpload = () => {
  const { getRootProps, getInputProps } = useDropzone({
    // all accepted formats
    accept: { "application/pdf": [".pdf"] },
    // number of files which can be uploaded once
    maxFiles: 1,
    // what will happen after dropping or giving a file to that component
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles);

      // accessing [0] as the accepted file comes in an array format with actual file desc in [0] and prototype at [1]
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // if file size bigger than 10mb then don't upload!
        alert("File size is bigger than 10mb");
        return;
      }

      try {
        // uploading the file to S3 using uploadToS3 fn
        const data = await uploadToS3(file);
        console.log("data: ", data);
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        <>
          <IconInbox className="w-10 h-10 text-blue-500" />
          <p className="mt-2 text-sm text-slate-400">Drop PDF here</p>
        </>
      </div>
    </div>
  );
};

export default FileUpload;
