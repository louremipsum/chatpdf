"use client";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { IconInbox } from "@tabler/icons-react";
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { IconLoader2 } from "@tabler/icons-react";

const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    // all accepted formats
    accept: { "application/pdf": [".pdf"] },
    // number of files which can be uploaded once
    maxFiles: 1,
    // what will happen after dropping or giving a file to that component
    onDrop: async (acceptedFiles) => {
      // accessing [0] as the accepted file comes in an array format with actual file desc in [0] and prototype at [1]
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // if file size bigger than 10mb then don't upload!
        toast.error("File too large\nTry uploading smaller than 10mb");
        // alert("File size is bigger than 10mb");
        return;
      }

      try {
        setUploading(true);
        // uploading the file to S3 using uploadToS3 fn
        const data = await uploadToS3(file);
        if (!data?.file_key || !data.file_name) {
          toast.error("Something went wrong");
          // alert("something went wrong");
          return;
        }
        mutate(data, {
          onSuccess: (data) => {
            console.log(data);
            // toast.success(data.message);
          },
          onError: (err) => {
            toast.error("Error creating chat");
          },
        });
        console.log("data: ", data);
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
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
        {uploading || isLoading ? (
          <>
            <IconLoader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
              Spilling Tea to GPT...
            </p>
          </>
        ) : (
          <>
            <IconInbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
