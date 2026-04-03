export interface Node {
  _id: string;
  name: string;
  parent?: string | null;
  children: Node[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNodePayload {
  name: string;
  parentId?: string;
}