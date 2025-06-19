"use strict"
//SELECCIONAMOS DONDE ESCRIBIMOS LA NUEVA TAREA Y EL BOTON DE ENVIAR
const escribirTareaNueva = document.getElementById("escribir-nueva-tarea")
const botonAgregarTarea = document.getElementById("agregar-tarea")
// SELECCIONAMOS LA LISTA DONDE VAMOS A MOSTRAR LAS TAREAS
const listaTarea = document.querySelector(".lista-de-tareas")

const guardarTareasEnLocalStorage = (nombre, fecha, id) => {
    const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];

    let nuevaTarea = {
        id,
        nombre,
        fecha,
        completa: false
    };

    tareasGuardadas.push(nuevaTarea);
    localStorage.setItem("tareas", JSON.stringify(tareasGuardadas));
};


// Función que crea y devuelve un elemento HTML con la estructura de una tarea
const crearTarea = (nombre, fecha,id, completa = false ) => {
    // Crear elementos principales
    const tarea = document.createElement("div");                // Contenedor de la tarea
    tarea.dataset.id = id; // ✅ Esto permite luego saber qué tarea eliminar del localStorage
    const infoTarea = document.createElement("div");            // Contenedor para nombre y fecha
    const accionesTarea = document.createElement("div");        // Contenedor para los botones de acción

    // Crear contenido de la tarea
    const nombreTarea = document.createElement("p");            // Nombre o título de la tarea
    const fechaDeCreacion = document.createElement("p");        // Fecha y hora en que se creó la tarea

    // Crear botones de acción
    const editarTarea = document.createElement("button");       // Botón para editar
    
    const eliminarTarea = document.createElement("button");     // Botón para eliminar
    const marcarTarea = document.createElement("button");       // Botón para marcar como completada

    // Crear íconos dentro de los botones
    const editar = document.createElement("span");              // Ícono de editar
    const eliminar = document.createElement("span");            // Ícono de eliminar
    const marcar = document.createElement("span");              // Ícono de marcar

    // Construir la estructura HTML (agregar elementos hijos)
    tarea.append(infoTarea, accionesTarea);
    infoTarea.append(nombreTarea, fechaDeCreacion);
    accionesTarea.append(editarTarea, eliminarTarea, marcarTarea);
    editarTarea.appendChild(editar);
    eliminarTarea.appendChild(eliminar);
    marcarTarea.appendChild(marcar);

    // Agregar clases para aplicar estilos desde CSS
    tarea.classList.add("tareas");
    infoTarea.classList.add("info-tarea");
    accionesTarea.classList.add("acciones-tarea");
    nombreTarea.classList.add("nombre-tarea");
    fechaDeCreacion.classList.add("fecha-de-creacion");
    editarTarea.classList.add("editar-tarea");
    eliminarTarea.classList.add("eliminar-tarea");
    marcarTarea.classList.add("marcar-tarea");
    editar.classList.add("material-icons");
    eliminar.classList.add("material-icons");
    marcar.classList.add("material-symbols-outlined");

    // Establecer el contenido de texto en los elementos
    nombreTarea.textContent = nombre;                   // Mostrar el nombre de la tarea
    fechaDeCreacion.textContent = fecha;                // Mostrar la fecha de creación
    editar.textContent = "edit";                        // Icono "edit"

    //funcion para editar tareas
    editarTarea.addEventListener("click", () => {
    if (editar.textContent === "edit") {
        nombreTarea.dataset.original = nombreTarea.textContent;
        nombreTarea.setAttribute("contenteditable", "true");
        editar.textContent = "save";
        nombreTarea.focus(); // Para que el cursor aparezca de una
    } else if (nombreTarea.textContent.trim() !== "") {
        nombreTarea.setAttribute("contenteditable", "false");
        editar.textContent = "edit";

        //  Actualizar localStorage con el nuevo nombre
        const nuevoNombre = nombreTarea.textContent.trim();
        const idTarea = tarea.dataset.id;

        let tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];

        tareasGuardadas = tareasGuardadas.map(t => {
            if (t.id == idTarea) {
                t.nombre = nuevoNombre;
                t.fecha = new Date().toLocaleString("es-CO" , {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
                });
                }
                return t;
        });

        localStorage.setItem("tareas", JSON.stringify(tareasGuardadas));

    } else {
        // Si está vacío, vuelve al texto original
        nombreTarea.textContent = nombreTarea.dataset.original;
        nombreTarea.setAttribute("contenteditable", "false");
        editar.textContent = "edit";
    }
});


    eliminar.textContent = "delete";                    // Icono "delete"

    //funcion para eliminar 
    eliminarTarea.addEventListener("click", ()=>{
        let confirmar = confirm("Esta seguro de eliminar esta tarea")
        if (confirmar== true) {
            listaTarea.removeChild(tarea)
            
            // 2. Eliminar del localStorage
            const idAEliminar = tarea.dataset.id;
            let tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];

            tareasGuardadas = tareasGuardadas.filter((tarea) => tarea.id != idAEliminar);

            localStorage.setItem("tareas", JSON.stringify(tareasGuardadas));
        }
    })

    // funcion para marcar tareas como completas
    marcar.textContent = "check_box_outline_blank";     // Icono de checkbox vacío
    marcarTarea.addEventListener("click", () => {
    const idTarea = tarea.dataset.id;
    let tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];

    tareasGuardadas = tareasGuardadas.map(t => {
        if (t.id == idTarea) {
            t.completa = !t.completa; // cambia el valor actual (true ↔ false)
        }
        return t;
    });

    localStorage.setItem("tareas", JSON.stringify(tareasGuardadas));

    //  Relee el estado actualizado desde localStorage
    const tareaActualizada = tareasGuardadas.find(t => t.id == idTarea);
    if (tareaActualizada.completa) {
        tarea.classList.add("tarea-completa");
        marcar.textContent = "check_box";
    } else {
        tarea.classList.remove("tarea-completa");
        marcar.textContent = "check_box_outline_blank";
    }
});

    //  Si la tarea ya estaba completada, aplicar los estilos y el ícono correcto
    if (completa) {
        tarea.classList.add("tarea-completa");
        marcar.textContent = "check_box";
    } else {
        marcar.textContent = "check_box_outline_blank";
    }



    // Retornar la tarea completa para agregarla luego al DOM
    return tarea;
};


const agregarTareaAlDOM = ()=>{
    botonAgregarTarea.addEventListener("click", ()=>{
        if (escribirTareaNueva.value !== "") {
            const nombre = escribirTareaNueva.value
            const fecha = new Date().toLocaleString("es-CO" , {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
            });
            escribirTareaNueva.value = ""
            const id = Date.now()
            const nuevaTarea = crearTarea(nombre,fecha,id)
            listaTarea.appendChild(nuevaTarea)
            guardarTareasEnLocalStorage(nombre,fecha,id)
        }
    })

    escribirTareaNueva.addEventListener("keyup" , (e)=>{
        if (e.key == "Enter" && escribirTareaNueva.value !== "") {
            const nombre = escribirTareaNueva.value
            const fecha = new Date().toLocaleString("es-CO" , {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
            });
            escribirTareaNueva.value = ""
            const id = Date.now()
            const nuevaTarea = crearTarea(nombre,fecha,id)
            listaTarea.appendChild(nuevaTarea)
            guardarTareasEnLocalStorage(nombre,fecha,id)
        }
    })
}

agregarTareaAlDOM()

const cargarTareas = () => {
    const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];

    tareasGuardadas.forEach((tarea) => {
        const tareaDOM = crearTarea(tarea.nombre, tarea.fecha,tarea.id, tarea.completa);
        listaTarea.appendChild(tareaDOM);
    });
};

cargarTareas(); // ¡esto hace que se carguen al recargar la página!



