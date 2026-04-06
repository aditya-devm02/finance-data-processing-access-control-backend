export interface AuthenticatedUserModel {
  id: string;
  email: string;
  role: "VIEWER" | "ANALYST" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
}

export interface LoginResponseModel {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "VIEWER" | "ANALYST" | "ADMIN";
    status: "ACTIVE" | "INACTIVE";
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  };
}
