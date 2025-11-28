export type AuthUser = {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: "user" | "admin";
}

export type SignUpPayload = {
  firstname: string,
  lastname: string,
  email: string,
  phone: string
}