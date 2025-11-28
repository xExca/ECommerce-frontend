import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"


const AuthLayout = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(()=> {
    if (!isLoading && user) {
      window.location.href = "/dashboard";
    }
  },[user, isLoading, navigate]);

  if(isLoading) return null;

  return (
     <div className="min-h-screen w-screen bg-white flex flex-col">
      <nav className="w-full shadow-md">
        <div className="max-w-7xl mx-auto text-gray-600 px-6">
          <ul className="flex items-center justify-between py-4">
            <li className='font-bold'>E commerce Title</li>
          </ul>
        </div>
      </nav>

      <Outlet />

    </div>
  )
}

export default AuthLayout