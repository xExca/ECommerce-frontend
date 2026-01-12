import { useState } from "react";
import InputPhone from "./InputPhone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginIdentifierMode = "email" | "phone";

const IdentifierInput = ({
  value,
  onChange,
  setIdentifier
}: {
  value: string;
  onChange: (v: string) => void;
  setIdentifier: React.Dispatch<React.SetStateAction<string>>
}) => {
  const [mode, setMode] = useState<LoginIdentifierMode>("email");

  const handleToggle = () => {
    setMode((prev) => (prev === "email" ? "phone" : "email"));
    onChange("");
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-sm">
        <Label className="font-semibold">
          {mode === "email" ? "Email Address" : "Phone number"}
        </Label>

        <button
          type="button"
          onClick={handleToggle}
          className="text-xs text-blue-500 hover:underline cursor-pointer"
        >
          {mode === "email" ? "Use Phone" : "Use Email"}
        </button>
      </div>

      {mode === "email" ? (
        <Input type="text" id="email" className='py-5.5' placeholder="email@example.com"  
            onChange={(e) => setIdentifier(e.target.value)}
          />
      ) : (
        <InputPhone value={value} onChange={onChange} />
      )}
    </div>
  );
};

export default IdentifierInput;
