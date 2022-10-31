import "./App.css";
import { useState, useEffect } from "react";
import axios from "./api";
import Swal from "sweetalert2";

function App() {
  const [form, setForm] = useState({
    nombre: "",
    usuario: "",
  });
  const [users, setUsers] = useState([]);

  const onInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const request = await axios.post("/users/getUsers");
      setUsers(request.data);
    } catch (e) {
      Swal.fire({
        icon: "error",
        text: "Hubo un error al momento de realizar la solicitud",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/users/${id}`, {});
      getUsers();
      Swal.fire({
        icon: "success",
        text: "Usuario eliminado correctamente",
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        text: "Hubo un error eliminando al usuario",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.nombre.trim() && form.usuario.trim()) {
        if (form.updateId) {
          await axios.put(`/users/${form.updateId}`, {
            nombre: form.nombre,
            usuario: form.usuario,
          });
          getUsers();
          Swal.fire({
            icon: "success",
            text: "Usuario actualizado correctamente",
          });
          setForm({ usuario: "", nombre: "" });
        } else {
          await axios.post("/users/", form);
          getUsers();
          Swal.fire({
            icon: "success",
            text: "Usuario creado correctamente",
          });
          setForm({ usuario: "", nombre: "" });
        }
      } else {
        Swal.fire({
          icon: "error",
          text: "Debe llenar ambos campos para poder crear o editar un usuario",
        });
      }
    } catch (e) {
      Swal.fire({
        icon: "error",
        text: "Hubo un error creando al usuario",
      });
    }
  };

  const handleUpdateClick = (data) => {
    setForm({ updateId: data.id, nombre: data.nombre, usuario: data.usuario });
  };

  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={form.nombre}
                  onChange={onInputChange}
                />
              </div>
              <div className="form-group">
                <label>Usuario</label>
                <input
                  type="text"
                  className="form-control"
                  name="usuario"
                  value={form.usuario}
                  onChange={onInputChange}
                />
              </div>
              <br />
              <button className="btn btn-primary">{form.updateId ? "Editar":"Crear"} usuario</button>
            </form>
          </div>
          <div className="col-md-6">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Editar</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  <>
                    {users.map((row, index) => (
                      <tr key={`row${index}`}>
                        <td>{row.nombre}</td>
                        <td>{row.usuario}</td>
                        <td>
                          <button
                            className="btn btn-warning"
                            onClick={() => {
                              handleUpdateClick(row);
                            }}
                          >
                            Editar
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              handleDelete(row.id);
                            }}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr colSpan={2}>
                    <td>No hay ningún usuario</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
