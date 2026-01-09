export type AuthUser = {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  picture: {
    croppedUrl: string;
    originalUrl: string;
  };
  role: "user" | "admin" | null;
}

export type SignUpPayload = {
  firstname: string,
  lastname: string,
  email: string,
  phone: string
}