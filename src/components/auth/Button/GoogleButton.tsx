import { Icon } from "@iconify/react";


type GoogleButtonProps = {
  onClick: () => void;
  isLink?: boolean
  fromUser?: boolean
};

const GoogleButton = ({ onClick, isLink = false, fromUser = false }: GoogleButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center justify-center gap-3 rounded-md border border-input bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer`}
  >
    <Icon icon="fa-brands:google" width="22.88" height="24"  style={{color: '#000'}} />
    <span>{fromUser ? (isLink ? "Link your account" : "Unlink your account") : "Sign in with Google"}</span>
  </button>
);

export default GoogleButton;
