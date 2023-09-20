import AWS from "aws-sdk";

export async function uploadToS3(file: File) {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      },
      region: "ap-south-1",
    });

    // making a unique(by date.now fn) file key for each file
    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

    // what would actually be uploaded to S3
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: file,
    };

    // Promise to actually upload(putObject) to S3 along with a progress emitter for frontend
    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        // for making a progress bar to show in UI of upload progress
        console.log(
          "uploading to s3...",
          parseInt(((evt.loaded * 100) / evt.total).toString() + "%")
        );
      })
      .promise();

    // uploading the file to S3
    await upload.then((data) => {
      // this part runs after uploaded so we can change state in UI or redirect to next page from here
      console.log("successfully uploaded to S3!: " + file_key);
    });

    return Promise.resolve({
      file_key,
      file_name: file.name,
    });
  } catch (error) {
    console.log(error);
  }
}

export function getS3Url(file_key: string) {
  // get url of that file in S3 Bucket to show it in UI while chatting
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`;
  return url;
}
