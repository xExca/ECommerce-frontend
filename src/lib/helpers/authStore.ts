let accessToken: string | null = null;
let onLogout: (() => void) | null = null;
let onTokenChange: ((token: string | null) => void) | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (onTokenChange) onTokenChange(token);
};

export const getAccessToken = () => accessToken;

export const registerLogout = (logoutFn: () => void) => {
  onLogout = logoutFn;
};

export const triggerLogout = () => {
  if (onLogout) onLogout();
};

export const registerTokenListener = (
  listener: (token: string | null) => void
) => {
  onTokenChange = listener;
};
