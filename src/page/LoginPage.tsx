import LoginForm from "@/components/auth/LoginForm";
import VerifyCodeForm from "@/components/auth/VerifyCodeForm";
import { useState } from "react";

const LoginPage = () => {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [identifier, setIdentifier] = useState('');
  return (
    <main className="flex-1 flex flex-col md:flex-row">
      {/* HERO / TEXT */}
      <section className="flex-1 flex items-center justify-center px-6 pt-8 pb-4 md:pb-8">
        <div className="text-center md:text-left max-w-md space-y-2">
          <p className="text-3xl md:text-4xl font-extrabold tracking-tight">
            LOREM IPSUM
          </p>
          <p className="text-3xl md:text-4lg text-gray-500">INFO INFO</p>
        </div>
      </section>

      {/* LOGIN PANEL */}
      <section className="w-full md:border-t-0 md:max-w-2xl lg:max-w-2xl md:flex md:items-center">
        <div className="w-full max-w-md mx-auto md:px-8 md:py-8">
          {step === 'otp' ? 
            <VerifyCodeForm identifier={identifier} setVerifyCode={setStep} from="login"/> :
            <LoginForm identifier={identifier} setIdentifier={setIdentifier} setVerifyCode={setStep}/> 
          }
        </div>
      </section> 
    </main>
  );
};

export default LoginPage;
