import ContentHeader from "../components/content-header/ContentHeader";
import DataTable from "react-data-table-component";
import StockAdding from "../components/stock-adding/StockAdding";
import { useState } from "react";
import Modal from "../components/modal/Modal";
import Swal from "sweetalert2";

// Importacion de sevicios que hacen peticiones al backend
import { getProducts, updateStock, addProduct } from "../services/productService";
import { useEffect } from "react";

const HomePannel = () => {

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
                const res = await addProduct(newProduct);
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

    //Aqui hacia arriba manejo de servicios

    return (
        <>
            <div className="Welcome">
                <ContentHeader
                    title="Bienvenido "
                    paragraph="Bienvenido a KK&M, tu solución integral para la gestión de inventarios de calzado.
                Nuestro sistema te ayuda a llevar un control preciso de existencias, optimizar el stock,
                manejar la contabilidad, generar informes y mejorar la eficiencia de tu negocio.
                Simplifica la administración de tus productos con tecnología confiable y fácil de usar.
                ¡Haz que tu inventario trabaje para ti!"></ContentHeader>
            </div>

            <br></br>

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
                title={"Añadir producto"}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Marca</label>
                        <input type="text" name="marca" value={newProduct.marca} onChange={handleChange}></input>
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
                        <select name="stock" value={newProduct.stock} onChange={handleChange}>
                            <option value={1}>Activo</option>
                            <option value={0}>Inactivo</option>
                        </select>
                    </div>
                    <button type="submit">Añadir</button>
                </form>
            </Modal>

            <div className="inventory-data">
                <h4>Aqui valor total de inventario</h4>
                <h4>Aqui productos mas vendidos</h4>
                <h4>Aqui productos con bajo stock</h4>
            </div>

        </>
    );
};

export default HomePannel; 