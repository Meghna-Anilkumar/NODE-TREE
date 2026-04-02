export interface CreateNodeDTO {
  name: string;
  parentId?: string;
}

export interface NodeResponseDTO {
  _id: string;
  name: string;
  parent: string | null;
  children: string[];       
  createdAt: Date;
  updatedAt: Date;
}

export interface NodeTreeDTO {
  _id: string;
  name: string;
  parent: string | null;
  children: NodeTreeDTO[];  
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}