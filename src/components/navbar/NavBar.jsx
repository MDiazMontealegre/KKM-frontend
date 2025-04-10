import { NavLink } from "react-router-dom";
import "./NavBar.css"
import InventoryManagement from "../stock-adding/StockAdding";
import ReportGeneration from "../report-generation/ReportGeneration";

const NavBar = () => {
    return (
        <>
            <nav>
                <div className="nav-logo">
                    <img src="KkmLogo" alt="logo-kkm" />
                </div>
                <ul className="nav-menu">
                    <li className="nav-item"><NavLink to="/dashboard/home-panel" className="item-intro">Panel de inicio</NavLink></li>
                    <li className="nav-item"><NavLink to="/dashboard/gestion-inventario" className="item-intro">Gestion de inventario</NavLink></li>
                    <li className="nav-item"><NavLink to="/dashboard/generacion-informes" className="item-intro">Generacion de informes</NavLink></li>
                      
                </ul>
                <div className="departments">

                </div>
            </nav>
        </>
    );
};

export default NavBar;