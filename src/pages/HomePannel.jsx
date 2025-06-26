import ContentHeader from "../components/content-header/ContentHeader";
import DataTable from "react-data-table-component";
import StockAdding from "../components/stock-adding/StockAdding";
import { useState } from "react";
import Modal from "../components/modal/Modal";
import Swal from "sweetalert2";

// Importacion de sevicios que hacen peticiones al backend
import { getUsers, createUser, updateUser, changeUserStatus } from "../services/userService";
import { getRoles } from "../services/rolService";

import { useEffect } from "react";

const HomePannel = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false); //Estado del modal 
    const [newUser, setNewUser] = useState({
        nombre: "",
        correo: "",
        contrasena: "",
        rol: "",
        estado: true
    })
    const [roles, setRoles] = useState([])
    

    //Para diferenciar si guardo o actualizo
    const [usuarioEditado, setUsuarioEditado] = useState([]);

    //Funcion para obtener los datos de los productos desde el API
    const fetchUsers = async () => {
        try {
            const res = await getUsers();
            if (res.success) {
                setUsers(res.data);
            }
        } catch (error) {
            Swal.fire("Error", "no se pudieron cargar los usuarios", "error");
        }
    }

    const fetchRoles = async () => {
        try {
            const res = await getRoles();
            console.log(res);

            if (res.success) {
                setRoles(res.data);
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo cargar la información de los roles", "error")
        }
    }

    useEffect(() => {
        fetchUsers("https://kkm-backend.onrender.com/docs#/User");
        fetchRoles("https://kkm-backend.onrender.com/docs#/Rol");
    }, []);

    //Configurar y rellenar columnas con los datos de la API
    const columns = [
        { name: "Nombre", selector: row => row.nombreu, sortable: true },
        { name: "Correo", selector: row => row.correo, sortable: true },
        { name: "Contraseña", selector: row => row.contrasena},
        { name: "Rol", selector: row => row.nombre, sortable: true},
        {
            name: "Estado",
            selector: row => {
            console.log("Valor de estado:", row.estado, "Tipo:", typeof row.estado);

            // Evaluación segura para true, "true", o 1
            const esActivo = row.estado === true || row.estado === "true" || row.estado === 1;

            return (
                <span className={`badge ${esActivo ? "badge-green" : "badge-red"}`}>
                    {esActivo ? "Activo" : "Inactivo"}
                </span>
            );
            }
        },
        {
            name: "Acciones",
            cell: row => (
                <div className="action-buttons">
                    <span
                        className="material-symbols-outlined"
                        title="Editar"
                        style={{ marginRight: "10px", cursor: "pointer" }}
                        onClick={() => handleEdit(row)}
                        >edit_square
                    </span>
                    <span
                        className="material-symbols-outlined icon-btn"
                        title="Cambiar estado"
                        style={{
                            cursor: "pointer",
                            color: row.estado ? "green" : "gray",
                            fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48"
                        }}
                        onClick={() => handleToggleEstado(row)}
                        >
                        {row.estado ? "toggle_on" : "toggle_off"}
                    </span>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }               
    ];

    const closeModal = () => {
        setShowModal(false); // Cierre el modal
        setNewBolsillo({
            nombre: "",
            correo: "",
            contrasena: "",
            rol: "",
            estado: true
        })
    };

    //Manejador de cambios en los inputs del formulario
    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value })
    }

    //Manejador para envio de formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); //Previene recarga de pagina
        try {
            if (usuarioEditado) {
                const res = await updateUser({ ...newUser, id: usuarioEditado.id });
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        Swal.fire("Actualizado", data.message, "success");
                    }else{
                        Swal.fire("Sin cambios", data.message, "info");
                    }
                }else{
                    const dataError= await res.json();
                    Swal.fire("Error", dataError.message, "error");
                }
            }else{
                const res= await createUser(newUser);
                if(res.ok){
                    const data= await res.json();
                    Swal.fire("Usuario agregado", data.message, "success");
                }else{
                    const dataError= await res.json();
                    Swal.fire("Error", dataError.message, "error")
                }
            }

            setShowModal(false);
            setUsuarioEditado(null);
            setNewUser({
                nombre: "",
                correo: "",
                contrasena: "",
                rol: "",
                estado: true
            });
            fetchUsers(); //Actualizamos la tabla para ver los cambios reflejados
        }catch(error){
            Swal.fire("Error", "Ocurrio un error inesperado", "error")
        }

    };

    const handleEdit = (user) =>{
        setNewUser ({
        nombre: user.nombreu,
        correo: user.correo,
        contrasena: user.contrasena,
        rol: user.nombre,
        estado: user.estado,
        })
        setUsuarioEditado(user);
        setShowModal(true);
    };

    // Manejador para cambiar el estado del producto (activo/inactivo)
        const handleToggleEstado = async (user) => {
            const nuevoEstado = !user.estado;
            const estadoTexto = nuevoEstado ? "activar" : "inactivar";
    
            const result = await Swal.fire({
                title: `¿Estás seguro de que quieres ${estadoTexto} a ${user.nombreu} ${user.nombre}?`,
                text: `Este usuario será marcado como ${nuevoEstado ? "activo" : "inactivo"}.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: `Sí, ${estadoTexto}`,
                cancelButtonText: "Cancelar"
           });
    
           if (result.isConfirmed) {
                try {
                    const res = await changeUserStatus(user.id, nuevoEstado);
                    if (res.ok) {
                        Swal.fire("Actualizado", `El usuario ha sido ${estadoTexto} correctamente.`, "success");
                        fetchUsers(); // Refresca la tabla
                    } else {
                        Swal.fire("Error", "No se pudo actualizar el estado del usuario.", "error");
                    }
                } catch (error) {
                    Swal.fire("Error", "Ocurrió un error inesperado.", "error");
                }
            } 
        };

    //Aqui hacia arriba manejo de servicios

    return (
        <>
            <div className="Welcome">
                <ContentHeader
                    title="Bienvenido "
                    paragraph="Bienvenido a KK&M, tu solución integral para la gestión de inventarios de calzado.
                Nuestro sistema te ayuda a llevar un control preciso de existencias, optimizar el stock, 
                generar informes y mejorar la eficiencia de tu negocio.
                Simplifica la administración de tus productos con tecnología confiable y fácil de usar.
                ¡Haz que tu inventario trabaje para ti!"></ContentHeader>
            </div>

            <br></br>

            <div className="content-search">
                <StockAdding
                    textButton="Añadir usuario"
                    onClick={() => {
                        setShowModal(true);
                    }}
                />
            </div>

            <div className="data-graphic">
                <DataTable
                    columns={columns}
                    data={users}
                    pagination
                    highlightOnHover
                ></DataTable>
            </div>

            <br></br>

            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={usuarioEditado ? "Editar Usuario" : "Crear Usuario"}>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre:</label>
                        <input type="text" name="nombre" value={newUser.nombre} onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label>Correo:</label>
                        <input type="text" name="correo" value={newUser.correo} onChange={handleChange}required/>
                    </div>
                    <div className="form-group">
                        <label>Contraseña:</label>
                        <input type="text" name="contrasena" value={newUser.contrasena} onChange={handleChange}required/>
                    </div>
                    <div className="form-group">
                        <label>Rol:</label>
                        <select name="rol" value={newUser.rol} onChange={handleChange} required>
                            
                            <option value="">Seleccione un rol</option>
                            {roles.map((rol) => {
                                return (

                                    <option key={rol.id} value={rol.id}>
                                        {rol.nombre}
                                    </option>

                                );
                            })};
                        </select> 
                    </div>
                    <div className="form-group">
                        <label>Estado:</label>
                        <select name="estado" value={newUser.estado} onChange={handleChange} required>
                            <option value={true}>Activo</option>
                            <option value={false}>Inactivo</option>
                        </select>
                    </div>
                    
                    <button type="submit" className="submit-btn">
                    {usuarioEditado ? "Actualizar" : "Añadir"}
                    </button>
                </form>
            </Modal>

        </>
    );
};

export default HomePannel;