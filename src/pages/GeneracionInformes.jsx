import React from "react";

const GeneracionInformes = () => {
  const descargarCSV = async (tipo) => {
    try {
      const url = tipo === "productos"
        ? "https://kkm-backend.onrender.com/docs#/Product/export_products_product_export_products_get"
        : "https://kkm-backend.onrender.com/docs#/User/export_users_user_export_users_get";

      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al generar el reporte");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${tipo}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al descargar el informe.");
    }
  };

  return (
    <div className="text-center p-10">
      <h1 className="text-2xl font-bold mb-6">📊 Generación de Informes</h1>
      <br></br>
      <div className="Welcome">
        <ContentHeader
            paragraph="Bienvenido al apartado de generacion de informes
            aqui podras descargar tanto el informe del stock disponible
            en la tienda, como el reporte de los usuarios registrados en ella"></ContentHeader>
      </div>
      <br></br>
      <button
        onClick={() => descargarCSV("productos")}
        className="bg-blue-700 text-white px-6 py-2 rounded-lg mr-4"
      >
        Descargar Informe de Productos
      </button>
      <button
        onClick={() => descargarCSV("usuarios")}
        className="bg-green-700 text-white px-6 py-2 rounded-lg"
      >
        Descargar Informe de Usuarios
      </button>
    </div>
  );
};

export default GeneracionInformes;