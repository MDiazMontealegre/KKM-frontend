import React from "react";

const GeneracionInformes = () => {
  const descargarReporte = async () => {
    try {
      const response = await fetch("https://kkm-backend.onrender.com/docs#/");
      if (!response.ok) throw new Error("Error al generar el reporte");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reporte_inventario.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al generar el reporte.");
    }
  };

  return (
    <div className="text-center p-10">
      <h1 className="text-2xl font-bold mb-4">Generación de Informes 📄</h1>
      <p className="mb-4">Haz clic en el botón para descargar el reporte del inventario actual.</p>
      <button
        onClick={descargarReporte}
        className="bg-red-800 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
      >
        Descargar reporte de inventario
      </button>
    </div>
  );
};

export default GeneracionInformes;