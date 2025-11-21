export type AuthUser = {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: "user" | "admin";
}
