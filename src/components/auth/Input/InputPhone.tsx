import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

type PhoneFieldProps = {
  value: string;
  onChange: (phone: string) => void;
  required?: boolean;
};

export default function InputPhone({ value, onChange, required }: PhoneFieldProps) {
  return (
    <PhoneInput
      defaultCountry="ph"
      value={value}
      onChange={onChange}
      placeholder="Enter your phone number"
      required={required}
      
      className="
        w-full
        border border-input rounded-md
        bg-transparent
        px-1.5
        h-10.5
        [--react-international-phone-height:45px]
        [--react-international-phone-border-radius:.50rem]
        [--react-international-phone-border-color:rgb(226,232,240)]
      "
      inputClassName="
        !w-full
        !h-10
        !border-0
        !bg-transparent
        !text-base md:!text-sm
        !px-3 !py-2
        focus:!outline-none
      "
      countrySelectorStyleProps={{
        className: "!border-0 !mr-0",
        buttonClassName: `
          !h-full
          !border-0
          !rounded-none
          !bg-transparent
          !px-3
        `,
        flagClassName: "!rounded-none",
        dropdownArrowClassName: "!ml-4",
      }}
      
    />
  );
}
