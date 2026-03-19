const BASE_URL = "http://192.168.1.5:5000";
// example: http://192.168.1.10:5000

export const getFileUrl = (path) => {
  if (!path) return null;
  return `${BASE_URL}/${path}`;
};

export const getProofUrl = (path) => getFileUrl(path);
export const getComputationImageUrl = (path) => getFileUrl(path);
export const getReceiptPublicUrl = (path) => getFileUrl(path);