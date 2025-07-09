import { Routes, Route, Navigate } from "react-router-dom"
import HomePannel from "../pages/HomePannel"
import Login from "../pages/Login"
import App from "../App"
import GestionInventario from "../pages/GestionInventario";
import GeneracionInformes from "../pages/GeneracionInformes";
import LoginComponent from "../components/login-component/LoginComponent";



function Rutas() {
    return (
        
            <Routes>
                <Route path="/dashboard" element={<App></App>}>
                    {/* aqui las rutas anidadas en el dashboard */}
                    <Route path="home-panel" element={<HomePannel></HomePannel>}></Route>
                    <Route path="gestion-inventario" element={<GestionInventario></GestionInventario>}></Route>
                    <Route path="generacion-informes" element={<GeneracionInformes></GeneracionInformes>}></Route>

                </Route>

                {/* rutas independientes del dashboard */}
                <Route path="/login" element={<Login></Login>}></Route>

                {/* redirecciones a ruta inexistente */}
                <Route path="*" element={<Navigate to="/login"></Navigate>}></Route>
            </Routes>
        
    )
}

export default Rutas;