import "./LoginComponent.css"
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

const LoginComponent = ({ title, paragraph }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = formData;
    if (!name || !email || !password || !role) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("https://kkm-backend.onrender.com", {
        correo: formData.email,
        contrasena: formData.password
      });

      console.log("Login success:", response.data);
      // Redirigir al dashboard
      navigate("");
    } catch (error) {
      alert("Credenciales incorrectas");
      console.error("Login failed:", error);
    }
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
      remember: false,
    });
  };

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 shoe-pattern z-0"></div>
      <div className="relative w-full max-w-md z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-indigo-600 py-6 px-8 text-center">
            <div className="flex items-center justify-center mb-2">
              <i className="fas fa-shoe-prints text-white text-3xl mr-3"></i>
              <h1 className="text-2xl font-bold text-white">KK&M</h1>
            </div>
            <p className="text-indigo-100">{paragraph}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-user text-gray-400"></i>
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-highlight pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Pepito Perez"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-gray-400"></i>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-highlight pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="pepito@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-highlight pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-gray-400 hover:text-gray-600`}></i>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-briefcase text-gray-400"></i>
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="input-highlight pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
                  required
                >
                  <option value="" disabled>Selecciona tu rol</option>
                  <option value="manager">Empleado</option>
                  <option value="admin">Administrador</option>
                  <option value="sales">Gerente</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                checked={formData.remember}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Recordar usuario
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
            >
              Ingresar <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </form>

          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              ¿Nuevo en KK&M? <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Regístrate</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;