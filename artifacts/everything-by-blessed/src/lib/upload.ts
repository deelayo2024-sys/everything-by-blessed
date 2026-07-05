import { useRequestUploadUrl } from "@workspace/api-client-react";

export async function uploadFile(
  file: File,
  requestUploadUrl: ReturnType<typeof useRequestUploadUrl>["mutateAsync"]
): Promise<string> {
  const { uploadURL, objectPath } = await requestUploadUrl({
    data: {
      name: file.name,
      size: file.size,
      contentType: file.type,
    },
  });

  const res = await fetch(uploadURL, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to upload file to storage");
  }

  return `/api/storage${objectPath}`;
}
