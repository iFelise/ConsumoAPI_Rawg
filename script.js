// 1. Configuración inicial
const API_KEY = '58b08a28213749389ddadde0c1a847fe'; 
const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=30`;

const cardsContainer = document.getElementById('cards-container');
const paginationContainer = document.getElementById('pagination');
const loader = document.getElementById('loader');

// Variables para control de paginación
let videojuegos = [];
let paginaActual = 1;
const tarjetasPorPagina = 10;

// 2. Función para obtener y cargar los videojuegos desde la API
async function obtenerVideojuegos() {
  try {
    loader.style.display = 'block'; // Mostrar loader
    const respuesta = await fetch(API_URL); // Solicitud a la API
    const datos = await respuesta.json();   // Convertir respuesta a JSON
    videojuegos = datos.results;            // Guardar los juegos
    loader.style.display = 'none';          // Ocultar loader

    mostrarPagina(paginaActual);            // Mostrar primera página
    crearControlesPaginacion();             // Crear botones de paginación
  } catch (error) {
    loader.textContent = 'Error al cargar los videojuegos.';
    console.error('Error al obtener los videojuegos:', error);
  }
}

// 3. Mostrar una página específica
function mostrarPagina(pagina) {
  cardsContainer.innerHTML = ''; // Limpiar tarjetas anteriores

  const inicio = (pagina - 1) * tarjetasPorPagina;
  const fin = inicio + tarjetasPorPagina;
  const juegosPagina = videojuegos.slice(inicio, fin);

  juegosPagina.forEach(juego => {
    const card = document.createElement('div');
    card.classList.add('card');

    // Construcción dinámica de la tarjeta
    card.innerHTML = `
      <img src="${juego.background_image}" alt="${juego.name}">
      <div class="card-content">
        <h3>${juego.name}</h3>
        <p><strong>Lanzamiento:</strong> ${formatearFecha(juego.released)}</p>
        <p><strong>Actualizado:</strong> ${formatearFecha(juego.updated)}</p>
        <p><strong>Plataformas:</strong> ${juego.platforms.map(p => p.platform.name).join(', ')}</p>
        <p><strong>Tiendas:</strong> ${
          juego.stores
            ? juego.stores.map(s => 
              `<a href="https://${s.store.domain}" target="_blank">${s.store.name}</a>`
            ).join(' ')
            : 'No disponible'
        }</p>
      </div>
    `;
    cardsContainer.appendChild(card);
  });
}

// 4. Crear botones de paginación según cantidad de juegos
function crearControlesPaginacion() {
  paginationContainer.innerHTML = '';
  const totalPaginas = Math.ceil(videojuegos.length / tarjetasPorPagina);

  for (let i = 1; i <= totalPaginas; i++) {
    const boton = document.createElement('button');
    boton.textContent = i;
    if (i === paginaActual) boton.disabled = true;

    boton.addEventListener('click', () => {
      paginaActual = i;
      mostrarPagina(paginaActual);
      crearControlesPaginacion();
    });

    paginationContainer.appendChild(boton);
  }
}

// 5. Formatear fechas al estilo español
function formatearFecha(fecha) {
  if (!fecha) return 'Desconocida';
  const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

// 6. Iniciar al cargar la página
obtenerVideojuegos();
