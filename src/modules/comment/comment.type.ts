export enum CommentStatus {
  APPROVED = "APPROVED",
  REJECT = "REJECT"
}

export interface Comment {
  id?: number;
  content: string;
  authorId: string;
  postId: number;
  parentId?: number | null;
  status: CommentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}