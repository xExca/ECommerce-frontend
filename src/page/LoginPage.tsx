import LoginForm from "@/components/auth/LoginForm"

const LoginPage = () => {
  return (
    <main className="flex-1 flex items-center justify-between px-60 w-full">
      <div className="w-[25vw] flex items-center justify-center p-10 flex-col">
        <h1 className='font-bold'>LOREM IPSUM</h1>
        <h1>INFO INFO</h1>
      </div>

      <LoginForm />
    </main>
  )
}

export default LoginPage