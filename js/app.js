// Variables relacionadas al juego
const juego = {
    aciertos: 0,
    palabraSeleccionada: "",
    letrasAdivinadas: [],
    maxOportunidades: 6,
};

// Variables relacionadas al tema seleccionado
const tema = {
    selectedTheme: "",
    temas: [],
};

// Variables relacionadas al jugador
const jugador = {
    playerName: "",
};

// Variables relacionadas a elementos del DOM
const elementosDOM = {
    contNameUser: document.querySelector(".contNameUser"),
    btnMain: document.querySelector(".btnMain"),
    nombreJugador: document.querySelector(".nombreJugador"),
    themeButtons: document.querySelectorAll(".theme-button"),
    selecTheme: document.querySelector(".selecTheme"),
    contThemeSelect: document.querySelector("#contThemeSelect"),
    contJugar: document.querySelector(".jugar"),
    smileImage: document.getElementById("smileMain"),
};

elementosDOM.contNameUser.style.display = 'flex';
elementosDOM.smileImage.style.display = 'flex';

Toastify({
    text: "Mi GitHub!",
    duration: 10000,
    destination: "https://github.com/matiasoviedo10",
    newWindow: true,
    gravity: "top",
    position: 'left',
    style: {
        background: "linear-gradient(to right, #000, #000)",
        }
    }).showToast();

// Función para cargar el nombre de usuario
function cargarNombreUsuario() {
    elementosDOM.btnMain.addEventListener("click", function () {
        const playerNameInput = document.getElementById("player-name");
        jugador.playerName = playerNameInput.value;

        // Guardar el nombre en el localStorage
        const storedNames = JSON.parse(localStorage.getItem("playerNames")) || [];
        storedNames.push(jugador.playerName);
        localStorage.setItem("playerNames", JSON.stringify(storedNames));

        // Ocultar el contenedor actual al avanzar
        elementosDOM.contNameUser.style.display = "none";

        elementosDOM.nombreJugador.textContent = jugador.playerName;

        // Mostrar el contenedor de selección de temas
        elementosDOM.contThemeSelect.style.display = "flex";

        setTimeout(function() {
            Toastify({
                text: "Escoge bien!",
                gravity: "top ",
                position: 'center',
                style: {
                    background: '#DCFF02',
                    color: '#000'
                }
                }).showToast();
            }, 500);
    });
}

// Función para cargar temas desde un archivo JSON
async function cargarTemas() { 
    try {
        const response = await fetch('./js/temas.json');
        const temasData = await response.json();

        tema.temas = temasData.temas;

        elementosDOM.themeButtons.forEach(button => {
            button.addEventListener("click", () => handleThemeButtonClick(button));
        });
    } catch (error) {
        console.error('Error al cargar los temas:', error);
    }
}

// Función para manejar el clic en un tema
function handleThemeButtonClick(button) {
    tema.selectedTheme = button.getAttribute("data-tema");
    elementosDOM.selecTheme.textContent = tema.selectedTheme;

    // Obtener el tema seleccionado por su ID desde temasData
    const selectedThemeData = tema.temas.find(theme => theme.id === tema.selectedTheme);

    // Verificar si se encontró el tema
    if (!selectedThemeData) {
        console.error("Tema no encontrado");
        return;
    }

    Toastify({
        text: "A jugar " + jugador.playerName + "!",
        className: "info",
        duration: 5000,
        style: {
        background: "linear-gradient(to right, #DCFF02, #DCFF02)",
        color: "#C58FFF"
        }
        }).showToast();

    // Obtener las palabras del tema seleccionado
    const palabrasTema = selectedThemeData.palabras;

    // Verificar si hay palabras en el tema
    if (!palabrasTema || palabrasTema.length === 0) {
        console.error("El tema no contiene palabras");
        return;
    }

    // Elegir una palabra aleatoria del tema
    const randomIndex = Math.floor(Math.random() * palabrasTema.length);
    juego.palabraSeleccionada = palabrasTema[randomIndex].palabra;

    // Avanzar al siguiente contenedor
    elementosDOM.contThemeSelect.style.display = "none";
    elementosDOM.smileImage.style.display = "none";
    elementosDOM.contJugar.style.display = "flex";

    // Insertar la palabra en el DOM
    insertarPalabraEnDOM(juego.palabraSeleccionada);

    // Iniciar el juego
    iniciarJuego();
}

// Función para insertar la palabra en el DOM
function insertarPalabraEnDOM(palabra) {
        // Dividir la palabra en letras individuales
        letras = palabra.split('');

        contenedorLetras = document.querySelectorAll('.butonLetras');

        // Asignar cada letra a su contenedor correspondiente
        letras.forEach((letra, index) => {
            if (contenedorLetras[index]) {
                contenedorLetras[index].querySelector('.h').textContent = letra;
            }
        });

        contenedorLetras.forEach(contenedor => {
            contenedor.querySelector('.h').textContent = '*';
        });

        // Ocultar contenedores de palabra oculta sobrantes
        contenedorLetras.forEach((contenedor, index) => {
            if (index >= letras.length) {
                contenedor.style.display = 'none';
            }
        });
}

// Función para iniciar el juego
function iniciarJuego() {
        maxOportunidades = 6        ;

        contbutones = document.querySelectorAll('.buttonLetras');

        // Obtener las letras únicas de la palabra oculta
        letrasUnicas = [...new Set(letras)];
        
        // Función para seleccionar letra del abcd
        contbutones.forEach(contbuton => {
            contbuton.addEventListener('click', function () {

            // Verificar si el contenedor ya ha sido seleccionado
            if (this.classList.contains('disabled')) {
                return;
            }                
                // Obtener el texto dentro del elemento .contbuton
                const contbutonText = this.querySelector('.contbuton').textContent;

                // Verificar si la letra está en la palabra oculta
                const esCorrecta = letras.includes(contbutonText);

                // evitar clics adicionales
                this.classList.add('disabled');

                    if (esCorrecta) {
                    for (let i = 0; i < letras.length; i++) {
                        if (letras[i] === contbutonText) {
                            contenedorLetras[i].querySelector('.h').textContent = contbutonText;
                        }
                    }
                    juego.letrasAdivinadas.push(contbutonText);    

                    // Mostrar los elementos de acierto
                    const h3victoria = document.querySelector('.h3victoria');
                    const buttonAciertos = document.querySelector('.buttonAciertos');
                    h3victoria.style.display = 'block';
                    const estilosActuales = window.getComputedStyle(buttonAciertos);
                    // Verificar si el elemento ya tiene una propiedad 'display' definida
                    if (estilosActuales.getPropertyValue('display') !== 'none') {
                        // Conservar otros estilos y solo cambiar 'display' si ya está definido
                        buttonAciertos.style.display = 'flex';
                    } else {
                        // Si 'display' no estaba definido previamente, establecerlo en 'flex'
                        buttonAciertos.style.display = 'flex';
                    }                    

                    // Temporizador para ocultar los elementos
                    setTimeout(function () {
                        h3victoria.style.display = 'none';
                        buttonAciertos.style.display = 'none';
                    }, 3000); 

                    // Incrementar el contador de aciertos
                    juego.aciertos++;
                    
                    if (juego.letrasAdivinadas.length === letrasUnicas.length) {
                        reset();
                        const correcto = document.querySelector('.correcto');
                        correcto.style.display = 'flex'
                        reiniciarJuego();
                    }
                    } else {
                    // Elementos h3derrota y alertAciertos
                    const h3derrota = document.querySelector('.h3derrota');
                    const alertAciertos = document.querySelector('.alertAciertos');

                    h3derrota.style.display = 'block';
                    alertAciertos.style.display = 'flex';

                    // Temporizador para ocultar los elementos
                    setTimeout(function () {
                        h3derrota.style.display = 'none';
                        alertAciertos.style.display = 'none';
                    }, 3000); 

                    // Reducir el número de oportunidades
                    juego.maxOportunidades--;

                    mostrarSiguienteParteDelCuerpo()
                    
                    // Actualizar el contador de oportunidades en el DOM
                    let h3intentos = document.querySelector('.h3intentos');
                    h3intentos.textContent = `Oportunidades restantes: ${juego.maxOportunidades}`;

                    // Verificar si se han agotado las oportunidades
                    if (juego.maxOportunidades === 0) {
                        reset();
                        const incorrecto = document.querySelector('.incorrecto');
                        incorrecto.style.display = 'flex'
                        reiniciarJuego();
                    }
                }

            });
        });
}

// Función para mostrar la siguiente parte del cuerpo
function mostrarSiguienteParteDelCuerpo() {
    const partesDelCuerpoClases = [".piernaizq", ".piernader", ".brazoder", ".brazoizq", ".cuerpo", ".cabeza", ];
    let oportunidades = 6;
    if (oportunidades > juego.maxOportunidades) {
     // Obtien  e la clase de la siguiente parte del cuerpo a mostrar.
    const claseParteDelCuerpo = partesDelCuerpoClases[juego.maxOportunidades];
     // Obtiene el elemento DOM de la parte del cuerpo.
    const elementoParteDelCuerpo = document.querySelector(claseParteDelCuerpo);

     // Muestra el elemento DOM.
    elementoParteDelCuerpo.style.display = "block";

     // Incrementa el contador de aciertos.
    oportunidades--;
    }
}

// Función para reiniciar el juego
function reiniciarJuego() {
    const reinicioButton = document.querySelector('.reinicio');

    // Manejador de eventos de clic
    reinicioButton.addEventListener('click', function () {

    // Recargar la página
    location.reload();
    });
}

// Función para resetear el juego
function reset() {
    const contjugar = document.querySelector('.contJugar');
    contjugar.style.display = 'none'
    const comentarios = document.querySelector('.comentarios');
    comentarios.style.display = 'none'
    const cont2 = document.querySelector('.cont2');
    cont2.style.display = 'none'
    const cont1 = document.querySelector('.cont1');
    cont1.style.justifyContent = 'center'
    const datosPuntos = document.querySelector('.datosPuntos');
    datosPuntos.textContent =  `Puntos: ${juego.aciertos * 100}`;

    const jugardenuevo = document.querySelector('.jugardenuevo');
    jugardenuevo.style.display = 'flex';
}


// Iniciar el juego
cargarNombreUsuario();
cargarTemas();

