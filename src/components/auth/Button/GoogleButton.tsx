import { Icon } from "@iconify/react";


type GoogleButtonProps = {
  onClick: () => void;
};

const GoogleButton = ({ onClick }: GoogleButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center justify-center gap-3 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
  >
    <Icon icon="fa-brands:google" width="22.88" height="24"  style={{color: '#000'}} />
    <span>Sign in with Google</span>
  </button>
);

export default GoogleButton;
