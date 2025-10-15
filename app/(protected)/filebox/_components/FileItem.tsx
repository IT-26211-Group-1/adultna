export interface FileItem {
  id: string;
  name: string;
  category: string;
  size: string;
  uploadDate: string;
  lastAccessed: string;
  type: "pdf" | "jpg" | "doc" | "png" | "docx";
  isSecure?: boolean;
}
