import axios from "axios";
import type { ApiScope } from "./apiBase";
import { getUploadUrl } from "./apiBase";
import { getCtrCd } from "./appSelectors";
import { getToken } from "./tokenStorage";

export async function uploadQuery(
  scope: ApiScope,
  file: any,
  filename: string,
  uploadfoldername: string,
  filenamelist?: string[],
  onUploadProgress?: (progressEvent: any) => void,
) {
  const formData = new FormData();
  formData.append("uploadedfile", file);
  formData.append("filename", filename);
  formData.append("uploadfoldername", uploadfoldername);
  formData.append("token_string", getToken(scope) ?? "");
  formData.append("CTR_CD", getCtrCd());
  if (filenamelist) formData.append("newfilenamelist", JSON.stringify(filenamelist));

  const response = await axios.post(getUploadUrl(), formData, {
    onUploadProgress,
  });

  return response;
}
