import { supabase } from "@/lib/supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

export const getUserImageSrc = (imagePath: string | null) => {
  if (imagePath) {
    return getSupabaseFileUrl(imagePath);
  } else {
    return require("@/assets/images/defaultProfile.png");
    // return require("@/assets/images/default-profile.svg");
  }
};

export const getSupabaseFileUrl = (filePath: string): any => {
  if (filePath) {
    return {
      uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${filePath}`,
    };
  }
  return null;
};

export const downloadFile = async (url: string) => {
  try {
    const { uri } = await FileSystem.downloadAsync(url, getLocalFilePath(url));
    return uri;
  } catch (error) {
    console.log("downloadFile 오류", error);
  }
};

export const getLocalFilePath = (filePath: string) => {
  let fileName = filePath.split("/").pop();
  return `${FileSystem.documentDirectory}${fileName}`;
};

/**
 * Supabase Storage에 이미지 업로드
 * @param folderName 폴더 이름
 * @param fileUri 파일 경로
 * @param isImage 이미지 여부
 * @returns { success: boolean, data: string, msg: string }
 */
export const uploadImage = async (
  folderName: string,
  fileUri: string,
  isImage = true
) => {
  try {
    let fileName = getFilePath(folderName, isImage); // 파일 경로 생성

    // 파일 데이터를 base64로 변환 - 공식문서 참고
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    let imageData = decode(fileBase64); // base64를 디코드하여 이미지 데이터를 얻음

    let { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, imageData, {
        cacheControl: "3600", // 헤더에 캐시 제어 설정
        upsert: false, // 이미 존재하는 파일이면 덮어쓰지 않음 - 파일 업로드 시 오류 발생
        contentType: isImage ? "image/*" : "video/*", // 파일 타입 설정
      });

    if (error) throw error;
    console.log("file upload success: ", data?.path);
    return { success: true, data: data?.path, msg: "Success" };
  } catch (error) {
    console.log("file upload error: ", error);
    return { success: false, msg: "Could not upload media" };
  }
};

export const getFilePath = (folderName: string, isImage: boolean) => {
  // 확장자 구하기
  const extension = isImage ? ".png" : ".mp4";
  return `/${folderName}/${new Date().getTime()}${extension}`;
};

export const isLocalFile = (file: any) => {
  if (typeof file == "object") return true;
};

export const getFileType = (file: any) => {
  if (!file) return null;
  if (isLocalFile(file)) {
    return file.type;
  }

  // check image or video for remote file
  if (file.includes("postImage")) {
    return "Image";
  }
  return "Video";
};

export const getFileUri = (file: any) => {
  if (!file) return null;
  if (isLocalFile(file)) {
    return file.uri;
  }
  return getSupabaseFileUrl(file)?.uri;
};
