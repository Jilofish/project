
export const getFileUrl = (path) => {
  if (!path) return null;
  return `/${path}`;
};
export const getProofUrl = (path) => getFileUrl(path);
export const getComputationImageUrl = (path) => getFileUrl(path);
export const getReceiptPublicUrl = (path) => getFileUrl(path);