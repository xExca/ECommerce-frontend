import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

const AdminLayout = () => {
  const { logout } = useAuth();
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Button onClick={logout}>LOGOUT</Button>
    </div>
  )
}

export default AdminLayout