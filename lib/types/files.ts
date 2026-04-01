export interface UploadedFileResponse {
  public_id: string;
  url: string;
  secure_url: string;
  bytes?: number;
  format?: string;
  resource_type?: string;
  mimeType?: string;
  original_filename?: string;
}
