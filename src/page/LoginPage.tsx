import LoginForm from "@/components/auth/LoginForm";
import VerifyCodeForm from "@/components/auth/VerifyCodeForm";
import { useEffect, useState } from "react";

type Step = "form" | "otp";
const LoginPage = () => {
  const [step, setStep] = useState<Step>(() => {
    return (sessionStorage.getItem("login_step") as Step) || "form";
  });
  const [identifier, setIdentifier] = useState<string>(()=>{
    return sessionStorage.getItem("login_identifier") || "";
  });

  useEffect(() => {
    sessionStorage.setItem("login_step", step);
  }, [step]);

  useEffect(() => {
    if (identifier) {
      sessionStorage.setItem("login_identifier", identifier);
    }
  }, [identifier]);

  const resetLoginFlow = () => {
    sessionStorage.removeItem("login_step");
    sessionStorage.removeItem("login_identifier");
    setStep("form");
    setIdentifier("");
  };
  
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
            <VerifyCodeForm identifier={identifier} setVerifyCode={setStep} from="login" resetLoginFlow={resetLoginFlow}/> :
            <LoginForm identifier={identifier} setIdentifier={setIdentifier} setVerifyCode={setStep}/> 
          }
        </div>
      </section> 
    </main>
  );
};

export default LoginPage;
