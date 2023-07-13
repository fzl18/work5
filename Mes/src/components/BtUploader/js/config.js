export const ACCEPT_CONFIG = {
  image: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
  video: ['.mp4', '.rmvb', '.mkv', '.wmv', '.flv'],
  document: [
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.pdf',
    '.txt',
    '.tif',
    '.tiff',
  ],
}
// const baseApi = process.env.VUE_APP_URL
const baseApi = ''
export const UPLOADER_API = {
  simpleUploadURL: baseApi + '/filebase/api/index/resource',
  simpleMergeURL: baseApi + '/filebase/api/index/merge',
  simpleDownloadURL: baseApi + '/filebase/api/index/download',
  simpleListURL: baseApi + '/filebase/api/fileRecord/page',
  simplePreviewURL: baseApi + '/#/fileBase/preview?id=',
}
