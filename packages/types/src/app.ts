export interface GalleryItem {
  id: string | number;
  url: string;
  title?: string;
  description?: string;
}

export interface Task {
  event: string;
  payload: any;
}

export interface Reason {
  value: string;
  comment: string;
}

export interface AccountApproval {
  user_id: string;
  email: string;
  phone_number: string;
}

export type AccountRejected = AccountApproval & {
  reasons: Reason[];
};
