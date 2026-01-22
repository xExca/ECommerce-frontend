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
  providers?: Providers;
  role: "user" | "admin" | null;
}

export type Providers = Partial<
  Record<"google" | "facebook", ProviderInfo>
>;
export type ProviderInfo = {
  id: string;
  email: string;
}

export type SignUpPayload = {
  firstname: string,
  lastname: string,
  identifier: string,
}