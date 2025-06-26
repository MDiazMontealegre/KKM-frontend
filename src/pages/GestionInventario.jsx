import ContentHeaderInventory from "../components/content-header-inventory/ContentHeaderInventory";
import DataTable from "react-data-table-component";
import StockAdding from "../components/stock-adding/StockAdding";
import { useState } from "react";
import Modal from "../components/modal/Modal";
import Swal from "sweetalert2";

// Importacion de sevicios que hacen peticiones al backend
import { getProducts, updateProduct, addProduct, changeProductStatus } from "../services/productService";
import { useEffect } from "react";

const GestionInventario = () => {

    //Estados
    const [showModal, setShowModal] = useState(false); //Estado del modal 

    // Estado para guardar la lista de Productos
    const [products, setProducts] = useState([]);

    //Para diferenciar si guardo o actualizo
    const [productoEditado, setProductoEditado] = useState([]);

    //NOTA Para evitar error de carga del modal al editar y guardar, definir método closeModal
    const closeModal = () => {
        setShowModal(false);
        setProductoEditado(null);
        setNewProduct({
            marca: "",
            nombre: "",
            talla: "",
            precio: "",
            numreferencia: "",
            proveedor: "",
            tipo: "",
            categoria_id: "",
            estado: true
        });
    };
    
    //Estado para el formilario de un nuevo producto
    const [newProduct, setNewProduct] = useState({
        marca: "",
        nombre: "",
        talla: "",
        precio: "",
        numreferencia: "",
        proveedor: "",
        tipo: "",
        categoria_id: "",
        estado: true
    });

    //Funcion para obtener los datos de los productos desde el API
    const fetchProducts = async () => {
        try {
            const res = await getProducts(); // Llama al servicio que hace fetch a /product/get-products/
            setProducts(res.data || []); // Guarda la lista en el estado, o un array vacío si falla
        } catch (error) {
            Swal.fire("Error", "no se pudieron cargar los productos", "error"); // Muestra alerta si falla
        }
    }

    // Se ejecuta una vez al cargar el componente (similar a componentDidMount)
    useEffect(() => {
        fetchProducts("https://kkm-backend.onrender.com/docs#/Product"); // Carga la lista de colaboradores desde la API
    }, []);

    //Configurar y rellenar columnas con los datos de la API
    const columns = [
        { name: "Marca", selector: row => row.marca, sortable: true },
        { name: "Nombre", selector: row => row.nombre, sortable: true },
        { name: "Talla", selector: row => row.talla, sortable: true },
        { name: "Precio", selector: row => row.precio, sortable: true },
        { name: "Num. Referencia", selector: row => row.numreferencia },
        { name: "Proveedor", selector: row => row.proveedor },
        { name: "Tipo", selector: row => row.tipo },
        { name: "Categoria_id", selector: row => row.categoria_id },
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

    //Manejador de cambios en los inputs del formulario
    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value })
    };

    //Manejador para envio de formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); //Previene recarga de pagina
        try {
            if (productoEditado) {
                const res = await updateProduct({ ...newProduct, id: productoEditado.id });
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        Swal.fire("Actualizado", data.message, "success");
                    } else {
                        Swal.fire("Sin cambios", data.message, "info");
                    }
                } else {
                    const dataError = await res.json();
                    Swal.fire("Error", dataError.message, "error");
                }
            } else {
                const res = await addProduct(newProduct);
                if (res.ok) {
                    const data = await res.json();
                    Swal.fire("Producto agregado", data.message, "success");
                } else {
                    const dataError = await res.json();
                    Swal.fire("Error", dataError.message, "error")
                }
            }

            setShowModal(false);
            setProductoEditado(null);
            setNewProduct({
                marca: "",
                nombre: "",
                talla: "",
                precio: "",
                numreferencia: "",
                proveedor: "",
                tipo: "",
                categoria_id: "",
                estado: true
            });
            fetchProducts(); //Actualizamos la tabla para ver los cambios reflejados
        } catch (error) {
            Swal.fire("Error", "Ocurrio un error inesperado", "error")
        }

    };

    const handleEdit = (product) => {
        setNewProduct({
            marca: product.marca,
            nombre: product.nombre,
            talla: product.talla,
            precio: product.precio,
            numreferencia: product.numreferencia,
            proveedor: product.proveedor,
            tipo: product.tipo,
            categoria_id: product.categoria_id,
            estado: product.estado,
        })
        setProductoEditado(product);
        setShowModal(true);
    };

    // Manejador para cambiar el estado del producto (activo/inactivo)
    const handleToggleEstado = async (product) => {
        const nuevoEstado = !product.estado;
        const estadoTexto = nuevoEstado ? "activar" : "inactivar";

        const result = await Swal.fire({
            title: `¿Estás seguro de que quieres ${estadoTexto} a ${product.nombre} ${product.numreferencia}?`,
            text: `Este producto será marcado como ${nuevoEstado ? "activo" : "inactivo"}.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Sí, ${estadoTexto}`,
            cancelButtonText: "Cancelar"
       });

       if (result.isConfirmed) {
            try {
                const res = await changeProductStatus(product.id, nuevoEstado);
                if (res.ok) {
                    Swal.fire("Actualizado", `El producto ha sido ${estadoTexto} correctamente.`, "success");
                    fetchProducts(); // Refresca la tabla
                } else {
                    Swal.fire("Error", "No se pudo actualizar el estado del producto.", "error");
                }
            } catch (error) {
                Swal.fire("Error", "Ocurrió un error inesperado.", "error");
            }
        } 
    };

    return (
        <>

            <div className="Welcome">
                <ContentHeaderInventory
                    title="Gestion de inventario "
                    paragraph="Aquí se encontrarán todos los Productos con todas sus características"></ContentHeaderInventory>
            </div>

            <div className="content-search">
                <StockAdding
                    textButton="Añadir producto"
                    onClick={() => {
                        setShowModal(true);
                    }}
                />
            </div>

            <div className="data-graphic">
                <DataTable
                    columns={columns}
                    data={products}
                    pagination
                    highlightOnHover
                ></DataTable>
            </div>

            <br></br>

            <Modal
                isOpen={showModal}
                //onClose={() => setShowModal(false)}
                onClose={closeModal}
                title={productoEditado ? "Editar Producto" : "Añadir Producto"}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Marca</label>
                        <input type="text" name="marca" value={newProduct.marca} onChange={handleChange}></input>
                    </div>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input type="text" name="nombre" value={newProduct.nombre} onChange={handleChange}></input>
                    </div>
                    <div className="form-group">
                        <label>Talla</label>
                        <input type="text" name="talla" value={newProduct.talla} onChange={handleChange}></input>
                    </div>
                    <div className="form-group">
                        <label>Precio</label>
                        <input type="text" name="precio" value={newProduct.precio} onChange={handleChange}></input>
                    </div>
                    <div className="form-group">
                        <label>Num. Referencia</label>
                        <input type="text" name="numreferencia" value={newProduct.numreferencia} onChange={handleChange}></input>
                    </div>
                    <div className="form-group">
                        <label>Proveedor</label>
                        <input type="text" name="proveedor" value={newProduct.proveedor} onChange={handleChange}></input>
                    </div>
                    <div className="form-group">
                        <label>Tipo</label>
                        <input type="text" name="tipo" value={newProduct.tipo} onChange={handleChange}></input>
                    </div>
                    <div className="form-group">
                        <label>Categoria ID</label>
                        <input type="text" name="categoria_id" value={newProduct.categoria_id} onChange={handleChange}></input>
                    </div>
                    <div className="form-group">
                        <label>Estado</label>
                        <select name="estado" value={newProduct.estado} onChange={handleChange}>
                            <option value={true}>Activo</option>
                            <option value={false}>Inactivo</option>
                        </select>
                    </div>

                    <button type="submit" className="submit-btn">
                        {productoEditado ? "Actualizar" : "Añadir"}
                    </button>
                </form>
            </Modal>

        </>
    );
};

export default GestionInventario; 