document.addEventListener("DOMContentLoaded", leerApi);
const url = "http://localhost:3000/Aprendices";
function leerApi() {
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
    });
}

function mostrarTabla() {
    const url = "http://localhost:3000/Aprendices";
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const contenedor = document.getElementById("tablaAprendices");
        contenedor.innerHTML = "";
        const tabla = document.createElement("table");
        tabla.className = "table table-bordered table-striped table-hover";

       
        const thead = document.createElement("thead");
        thead.className = "table-dark";
        thead.innerHTML = `
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>¿Está matriculado?</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        `;
        tabla.appendChild(thead);

        const tbody = document.createElement("tbody");

        data.forEach(element => {
          const fila = document.createElement("tr");

          const matriculaTexto = element.estaMatriculado ? "Sí" : "No";

          fila.innerHTML = `
            <td>${element.id}</td>
            <td>${element.nombre}</td>
            <td>${element.apellido}</td>
            <td>${matriculaTexto}</td>
            <td>${element.email}</td>
            <td>
                <button class="btn btn-primary btn-sm me-2" onclick="abrirEditar(${element.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarAprendiz(${element.id})">Eliminar</button>
            </td>
          `;

          tbody.appendChild(fila);
        });

        tabla.appendChild(tbody);
        contenedor.appendChild(tabla);
      });
  }
  


  document.activeElement.blur();
  const form = document.getElementById("formAprendiz");
  const modal = new bootstrap.Modal(document.getElementById("modalAprendiz"));
  modal.hide();

function abrirCrear() {
  document.getElementById("modalAprendizLabel").textContent = "Crear Aprendiz";
  form.reset();
  document.getElementById("idAprendiz").value = "";
}

function abrirEditar(id) {
  fetch(`${url}/${id}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("modalAprendizLabel").textContent = "Editar Aprendiz";
      document.getElementById("idAprendiz").value = data.id;
      document.getElementById("nombre").value = data.nombre;
      document.getElementById("apellido").value = data.apellido;
      document.getElementById("email").value = data.email;
      document.getElementById("estaMatriculado").checked = data.estaMatriculado;
      modal.show();
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = document.getElementById("idAprendiz").value;
  document.getElementById("idAprendiz").value;

  const aprendiz = {
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    email: document.getElementById("email").value,
    estaMatriculado: document.getElementById("estaMatriculado").checked
  };

  if (id) {
    fetch(`${url}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(aprendiz)
    })
    .then(() => {
      modal.hide();
      mostrarTabla();
      Swal.fire("Actualizado", "Aprendiz actualizado correctamente", "success");
    });
  } else {
    fetch(url)
  .then(res => res.json())
  .then(aprendices => {
    // Calcular el siguiente ID como el máximo + 1
    const maxId = aprendices.reduce((max, a) => Math.max(max, parseInt(a.id)), 0);
    const nuevoAprendiz = {
      id: (maxId + 1).toString(),
      nombre: document.getElementById("nombre").value,
      apellido: document.getElementById("apellido").value,
      email: document.getElementById("email").value,
      estaMatriculado: document.getElementById("estaMatriculado").checked
    };
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevoAprendiz)
    });
  })
    .then(() => {
      modal.hide();
      mostrarTabla();
      Swal.fire("Creado", "Aprendiz creado correctamente", "success");
    });
  }
});



function eliminarAprendiz(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "¡No podrás revertir esta acción!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`${url}/${id}`, {
        method: "DELETE"
      })
      .then(() => {
        mostrarTabla();
        Swal.fire("Eliminado", "Aprendiz eliminado correctamente", "success");
      });
    }
  });
}
