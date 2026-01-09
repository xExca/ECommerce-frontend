import { Navigate, Route, Routes } from "react-router-dom"

// Layouts
import AuthLayout from "@/layout/AuthLayout"
import AdminLayout from "@/layout/AdminLayout"

// Pages
import LoginPage from "@/page/LoginPage"
import DashboardPage from "@/page/DashboardPage"

//Components
import { PrivateRoute } from "./PrivateRoutes"
import SignUpPage from "@/page/SignUpPage"
import UserPage from "@/page/UserPage"

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />}></Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/signup" element={<SignUpPage />}/>
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<AdminLayout/>}>
            <Route path="/dashboard" element={<DashboardPage />}/>
            <Route path="/user" element={<UserPage />} />
          </Route> 
        </Route>
      </Routes>
  )
}

export default AppRoutes