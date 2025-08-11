export type Attachment = {
  file_name: string;
  url: string;
};
export type Notice = {
  id: string;
  title: string;
  content: string;
  date_published: string;
  valid_from?: string;
  valid_to?: string;
  priority?: string;
  category?: string;
  created_by?: string;
  updated_at?: string;
};

export type NoticeFormData = {
  title: string;
  content: string;
  date_published: string;
};
