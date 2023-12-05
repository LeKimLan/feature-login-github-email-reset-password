import { BrowserRouter, Route, Routes } from "react-router-dom"
import LazyFn from './lazy/Lazy'
import Home from "../pages/home/Home"
export default function RouteIndex() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>}>
                <Route path="about" element={<>About</>}></Route>
                <Route path="test" element={<>Test</>}></Route>
            </Route>
            <Route path="/admin" element={<>Admin</>}></Route>
            <Route path="/authen" element={LazyFn(() => import("@pages/authen/Authen.jsx"))()}></Route>
            <Route path="/reset-password" element={LazyFn(() => import("@pages/authen/pages/ResetPassword.jsx"))()}></Route>
            <Route path="/email-confirm" element={LazyFn(() => import("@pages/authen/pages/EmailConfirm.jsx"))()}></Route>
            <Route path="/set-ip" element={LazyFn(() => import("@pages/authen/pages/SetIp.jsx"))()}></Route>
        </Routes>
    </BrowserRouter>
  )
}
