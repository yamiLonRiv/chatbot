
//Variable que guarda la respuesta del chatbot
var chat = "";

//variables que sirven para verificar si el usuario quiere una cita
var necesitaCita = false;
var necesitaCita2 = "";

//variables para guardar los datos del usuario
var nombre = "";
var apellidos = "";
var cedula = "";
var eps = "";
var url = "";

//variables para verificar si el usuario quiere hacer una consulta
var necesitaConsultar = false;
var idDeConsulta = "";
var contConsulta = 0;

//variable para verificar cuantos datos ha ingresado el usuario
var contDatos = 0;

//Datos para asignar cita
var nombreMedico = "";
var Fecha = "";

var datosPacienteCita = "";
var nombrePaciente ="";
var apellidoPaciente ="";
var idPaciente ="";
var arregloDatos = [];


//constante que ayuda a conectar a la base de datos
const db = firebase.firestore();

//Constante que guarda el id de botón de envío de datos en el chat
const taskForm = document.getElementById("task-form2");

//variable de conexión a la base de datos para almacenar un usuario
const saveUser = (Name, LastName, ID, Entity, URL) =>
  db.collection('usuarios').doc().set({
    Name,
    LastName,
    ID,
    Entity,
    URL,
  });

  //Variable de conexión a la base de datos para asignar una cita
const saveAppointment = (Name, LastName, ID, Medico, Fecha) =>
  db.collection('citas').doc().set({
    Name,
    LastName,
    ID,
    Medico,
    Fecha
  });



//consultas de pacientes, doctores y fechas, para mostrarlos posteriormente en las opciones de los 
//select para las citas
const getUsers = () => db.collection("usuarios").get();
const getDoctors = () => db.collection("medicos").get();
const getFechas = () => db.collection("medicos").where("nombre", "==", "Dr. Juan Pablo Rodríguez Gallego").get();

//Evento del botón del chat, aqui se incluyen otrasfuncionalidades
//explicadas adentro
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("as");

 
  console.log("fin");
  //procesar palabra

  //Guarda la variable donde se envian o reciben mensajes dentro del chat
  const texto = document.getElementById("message");
  console.log(texto.value);
  //procesarTexto(texto.value);


  //Se llama a los métodos que crean mensajes de usuario y chtbot
  createMensajeUser("user", texto.value, "17/12/2021");
  createMensajeSystem("system", procesarTexto(texto.value), "17/12/2021");




});


//Carga los datos de la base de datos en los select
//como pacientes, medicos y fechas
async function cargarDatos() {
  const querySnapshot = await getUsers();
  querySnapshot.forEach(doc => {
    console.log(doc.data())
    addNamePatient(doc.data())
  });

//obtiene los medicos de la base de datos
  const queryDoctors = await getDoctors();
  queryDoctors.forEach(doc => {
    console.log(doc.data())
    addNameDoctor(doc.data())
  });

  //obtiene las fechas de la base de datos
  const queryFechas = await getFechas();
  queryFechas.forEach(doc => {
    console.log(doc.data())
    addFechasMedico(doc.data())
  });
}

//Trae las citas que hay registradas en la base de datos
async function consultarCita(idPaciente){
  const getCita = () => db.collection("citas").where("ID", "==", idPaciente).get();
  const querycita =  await getCita();
  querycita.forEach(doc => {
    console.log(doc);
    mostrarCita(doc.data());
  });
}

//Imprime las citas en la consola
function mostrarCita(objetoCita){
  console.log(objetoCita)
}


//Agrega los nombres de los pacientes a el select correspondientes
function addNamePatient(objetoPatient) {
  NamePatient
  var padre = document.getElementById("NamePatient");
  var option1 = document.createElement("option");
  //option1.setAttribute("class", "direct-chat-name float-left");
  option1.textContent = objetoPatient.Name+" "+objetoPatient.LastName+" " + objetoPatient.ID;

  padre.appendChild(option1);

}

//pone los nombres de los doctores en el select correspondiente
function addNameDoctor(objetoDoctor) {
  NameDoctor
  var padre = document.getElementById("NameDoctor");
  var option1 = document.createElement("option");
  //option1.setAttribute("class", "direct-chat-name float-left");
  option1.textContent = objetoDoctor.nombre;
  padre.appendChild(option1);

}

//pone las fechas de los médicos en el select
function addFechasMedico(objetoFecha) {
  FechasMedico
  var padre = document.getElementById("FechasMedico");
  //option1.setAttribute("class", "direct-chat-name float-left");
  opciones = []
  objetoFecha.fechas.forEach(fecha => {
    console.log("Fechas medico...");
    const date = fecha.toDate().toDateString()
    var opcionn = document.createElement("option");
    opcionn.textContent = date
    opciones.push(opcionn)
    console.log(date);
  });
  opciones.forEach(opcion => {
    console.log(opcion.textContent)
    padre.appendChild(opcion);
  });
  //padre.appendChild(option1);

}




//Aqui se encuentra la funcionalidad que procesa el texto enviado entre el chatbot y el paciente
function procesarTexto(texto) {
  syncDelay(110);
  if (texto.toUpperCase() == "HOLA") {
    chat = "Hola, si desea pedir una cita escriba: cita sino escriba: consulta";
    return chat;
  } else if (texto.toUpperCase() == "CITA") {
    necesitaCita = true;
    chat = "Es necesario que responda unas preguntas, escriba ok para continuar";
    necesitaCita2 = "ok";
    necesitaCita = true;
    return chat;
  }
  if (necesitaCita) {
    // return procesarDatosUsuario(texto);
    if (this.nombre == "" & !this.nombreEsta) {
      chat = "¿cuál es su nombre?";
      nombreEsta = true;
      this.contDatos = 1;
      return chat;
    }

    else if (this.contDatos == 1) {
      this.nombre = texto;
      if (this.apellidos == "") {
        chat = "¿Cuál es su apellido?"
        this.nombre = texto;
        this.contDatos = 2;
        console.log(this.nombre);
        return chat;
      }
    }

    else if (this.contDatos == 2) {
      this.apellidos = texto;
      this.contDatos = 3;
      console.log(this.apellidos);
      chat = "¿Cuál es su número de cédula?"
      return chat;
    }

    else if (this.contDatos == 3) {
      this.cedula = texto;
      this.contDatos = 4;
      console.log(this.cedula);
      chat = "¿Cuál es su entidad de eps?"
      return chat;
    }

    else if (this.contDatos == 4) {
      this.eps = texto;
      this.contDatos = 5;
      console.log(this.eps);
      chat = "Escriba y envíe la URL de su remisión"
      return chat;
    }

    else if (this.contDatos == 5) {
      this.url = texto;
      this.contDatos = 6;
      console.log(this.eps);
      chat = "Muchas gracias por enviar los datos, será añadido a una lista de espera"
      console.log("nombre: " + nombre + "\n"
        + "apellidos: " + apellidos + "\n"
        + "ID: " + cedula + "\n"
        + "eps: " + eps + "\n"
        + "url: " + url)
      saveUser(nombre, apellidos, cedula, eps, url);
      return chat;
    }


  }
  else if (texto.toUpperCase() == "CONSULTA") {
    chat = "Escriba ok Para continuar";
    this.necesitaConsultar = true;
    return chat
  }
  if(necesitaConsultar){
    if(idDeConsulta == ""){
      chat = "Ingrese su número de cedula";
      contConsulta = 1;
      return chat;
    }
    if(contConsulta==1){
      this.idDeConsulta = texto;
      console.log(idDeConsulta);
      contConsulta = 2; 
    }
  }
  

  else {
    return "No te entiendo";
  }
  console.log(texto);
}

//simula un retraso en el envio de mensajes
function syncDelay(milliseconds) {
  var start = new Date().getTime();
  var end = 0;
  while (end - start < milliseconds) {
    end = new Date().getTime();
  }
}

/**
 * permite la maquetacion en el chat para el mensaje enviado por parte del sistema
 * @param {*} name
 * @param {*} mensaje
 */

function createMensajeSystem(name, mensaje, fecha) {
  //capturamos el div principal
  var padre = document.getElementsByClassName("direct-chat-messages");

  var div = document.createElement("div"); //creamos el div
  div.setAttribute("class", "direct-chat-msg");
  //creamos el titulo
  var div2 = document.createElement("div");
  div2.setAttribute("class", "direct-chat-infos clearfix");

  var span1 = document.createElement("span");
  span1.setAttribute("class", "direct-chat-name float-left");
  div2.textContent = name;
  var span2 = document.createElement("span");
  span2.setAttribute("class", "direct-chat-timestamp float-right");
  span2.textContent = fecha;
  div2.appendChild(span1);
  div2.appendChild(span2);

  var div3 = document.createElement("div");
  div3.textContent = mensaje;
  div3.setAttribute("class", "direct-chat-text");

  //agregamos el titulo y el parrafo al div creado
  div.appendChild(div2);
  div.appendChild(div3);

  //añadimos todo al div seleccionado, en este caso el primer div que contenga la clase div2
  padre[0].appendChild(div);
}

/**
 * permite la maquetacion en el chat para el mensaje enviado por parte del usuario
 * @param {*} name
 * @param {*} mensaje
 */

function createMensajeUser(name, mensaje, fecha) {
  //capturamos el div principal
  var padre = document.getElementsByClassName("direct-chat-messages");

  var div = document.createElement("div"); //creamos el div

  div.setAttribute("class", "direct-chat-msg right");
  //creamos el titulo
  var div2 = document.createElement("div");
  div2.setAttribute("class", "direct-chat-infos clearfix");

  var span1 = document.createElement("span");
  span1.setAttribute("class", "direct-chat-name float-right");
  span1.textContent = name;
  var span2 = document.createElement("span");
  span2.setAttribute("class", "direct-chat-timestamp float-left");
  span2.textContent = fecha;
  div2.appendChild(span1);
  div2.appendChild(span2);

  var div3 = document.createElement("div");
  div3.textContent = mensaje;
  div3.setAttribute("class", "direct-chat-text");

  //agregamos el titulo y el parrafo al div creado
  div.appendChild(div2);
  div.appendChild(div3);

  //añadimos todo al div seleccionado, en este caso el primer div que contenga la clase div2
  padre[0].appendChild(div);
}

cargarDatos();


//Permite asignar citas a los pacientes
function asignarCita(){
  console.log("evento");
  var idpaciente = document.getElementById("NamePatient");
  var paciente = idpaciente.options[idpaciente.selectedIndex].textContent;

  arregloDatos = paciente.split(" ");
  console.log(paciente);

  console.log(arregloDatos[0]);
  this.nombrePaciente = arregloDatos[0];
  this.apellidoPaciente = arregloDatos[1];
  this.idPaciente = arregloDatos[2];

  var idmedico = document.getElementById("NameDoctor");
  var medico = idmedico.options[idmedico.selectedIndex].textContent;

  console.log(medico);

  this.nombreMedico = medico;

  var idfecha = document.getElementById("FechasMedico");
  var fechac = idfecha.options[idfecha.selectedIndex].textContent;

  console.log(fechac);

  this.Fecha = fechac;

   saveAppointment(this.nombrePaciente, this.nombrePaciente, this.idPaciente, this.nombreMedico, this.Fecha);
   consultarCita(idPaciente);
}
