import ContentHeaderInventory from "../components/content-header-inventory/ContentHeaderInventory";
import DataTable from "react-data-table-component";
import StockAdding from "../components/stock-adding/StockAdding";
import { useState } from "react";
import Modal from "../components/modal/Modal";
import Swal from "sweetalert2";

// Importacion de sevicios que hacen peticiones al backend
import { getProducts, updateStock, addProduct } from "../services/productService";
import { useEffect } from "react";

const GestionInventario = () => {

    //Estados
        const [showModal, setShowModal] = useState(false); //Estado del modal 
    
        // Estado para guardar la lista de Productos
        const [products, setProducts] = useState([]);
    
        //Para diferenciar si guardo o actualizo
        const [productoEditado, setProductoEditado] = useState([]);
    
        //Estado para el formilario de un nuevo producto
        const [newProduct, setNewProduct] = useState({
            marca: "",
            nombre: "",
            talla: "",
            precio: "",
            numreferencia: "",
            proveedor: "",
            stock: "",
            estado: 1
        })
    
        //Funcion para obtener los datos de los productos desde el API
        const fetchProducts = async () => {
            try {
                const res = await getProducts();
                setProducts(res.data || []);
            } catch (error) {
                Swal.fire("Error", "no se pudieron cargar los productos", "error");
            }
        }
    
        useEffect(() => {
            fetchProducts();
        }, []);
    
        //Configurar y rellenar columnas con los datos de la API
        const columns = [
            { name: "Marca", selector: row => row.marca, sortable: true },
            { name: "Nombre", selector: row => row.nombre, sortable: true },
            { name: "Talla", selector: row => row.talla, sortable: true },
            { name: "Precio", selector: row => row.precio, sortable: true },
            { name: "Num. Referencia", selector: row => row.numreferencia },
            { name: "Proveedor", selector: row => row.proveedor },
            { name: "Stock", selector: row => row.stock },
            {
                name: "Estado", selector: row => (
                    <span className={`badge ${row.estado === 1 ? "badge-green" : "badge-red"}`}>
                        {row.estado === 1 ? "Activo" : "Inactivo"}
                    </span>
                )
            },
            {
                name: "Acciones",
                cell: row => (
                    <span 
                        className="material-symbols-outlined"
                        title="Editar"
                        style={{marginRight: "10px", cursor: "pointer" }}
                        onClick={() => handleEdit(row)}
                    >edit_square</span>
                ),
                ignoreRowClick: true,
                allowOverflow: true,
                button: true,
            }
                    
        ];
    
        //Manejador de cambios en los inputs del formulario
        const handleChange = (e) => {
            setNewProduct({ ...newProduct, [e.target.name]: e.target.value })
        }
    
        //Manejador para envio de formulario
        const handleSubmit = async (e) => {
            e.preventDefault(); //Previene recarga de pagina
            try {
                if (productoEditado) {
                    const res = await updateStock({ ...newProduct, id: productoEditado.id });
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
                    const res= await addProduct(newProduct);
                    if(res.ok){
                        const data= await res.json();
                        Swal.fire("Producto agregado", data.message, "success");
                    }else{
                        const dataError= await res.json();
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
                    stock: "",
                    estado: 1
                });
                fetchProducts(); //Actualizamos la tabla para ver los cambios reflejados
            }catch(error){
                Swal.fire("Error", "Ocurrio un error inesperado", "error")
            }
    
        };
    
        const handleEdit = (product) =>{
            setNewProduct ({
            marca: product.marca,
            nombre: product.nombre,
            talla: product.talla,
            precio: product.precio,
            numreferencia: product.numreferencia,
            proveedor: product.proveedor,
            stock: product.stock,
            estado: product.estado,
            })
            setProductoEditado(product);
            setShowModal(true);
        };

    return (
        <>
            
            <div className="Welcome">
                <ContentHeaderInventory
                    title="Gestion de inventario "
                    paragraph="Aqui se encontraran todos los Productos con todas sus caracteristicas"></ContentHeaderInventory>
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
                onClose={() => setShowModal(false)}
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
                        <label>Stock</label>
                        <input type="text" name="stock" value={newProduct.stock} onChange={handleChange}></input>
                    </div>
                    <div className="form-group">
                        <label>Estado</label>
                        <select name="estado" value={newProduct.estado} onChange={handleChange}>
                            <option value={1}>Activo</option>
                            <option value={0}>Inactivo</option>
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