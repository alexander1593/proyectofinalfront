import { useState } from 'react'

function App() {

  // =========================================
  // ESTADO DE LA PÁGINA
  // =========================================

  const [categoria, setCategoria] = useState('caballero')
  const [busqueda, setBusqueda] = useState('')
  const [mostrarLogin, setMostrarLogin] = useState(false)
  const [mostrarDetalle, setMostrarDetalle] = useState(false)
  const [perfumeSeleccionado, setPerfumeSeleccionado] = useState(null)
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [mensajeLogin, setMensajeLogin] = useState('')
  const [cargando, setCargando] = useState(false)

  // =========================================
  // PRODUCTOS
  // =========================================

  const perfumes = [
    {
      id: 1,
      nombre: 'BLACK WOOD',
      marca: 'PARISBELLE',
      precio: '$2,500 MXN',
      categoria: 'caballero',
      imagen: '/perfumes/perfume1.png'
    },
    {
      id: 2,
      nombre: 'UNTOLD',
      marca: 'CLUB DE NUIT',
      precio: '$2,800 MXN',
      categoria: 'dama',
      imagen: '/perfumes/perfume2.png'
    },
    {
      id: 3,
      nombre: 'YARA',
      marca: 'LATTAFA',
      precio: '$2,300 MXN',
      categoria: 'arabes',
      imagen: '/perfumes/perfume3.png'
    },
    {
      id: 4,
      nombre: 'VELVET ROSE',
      marca: 'LATTAFA',
      precio: '$2,600 MXN',
      categoria: 'arabes',
      imagen: '/perfumes/perfume4.jpg'
    },
    {
      id: 5,
      nombre: 'BLOSSOM',
      marca: 'BOUQUET',
      precio: '$2,400 MXN',
      categoria: 'dama',
      imagen: '/perfumes/perfume5.jpg'
    },
    {
      id: 6,
      nombre: 'CRYSTALLIA',
      marca: 'LA FEDE',
      precio: '$3,100 MXN',
      categoria: 'unisex',
      imagen: '/perfumes/perfume6.png'
    },
    {
      id: 7,
      nombre: 'ASAD',
      marca: 'LATTAFA',
      precio: '$1,200 MXN',
      categoria: 'arabes',
      imagen: '/perfumes/asad.jpg'
    },
    {
      id: 8,
      nombre: 'BLEU DE CHANEL',
      marca: 'CHANEL',
      precio: '$2,900 MXN',
      categoria: 'disenador',
      imagen: '/perfumes/bleu-chanel.jpg'
    }
  ]

  // =========================================
  // CATEGORÍAS
  // =========================================

  const categorias = [
    { id: 'todos', nombre: 'TODOS' },
    { id: 'arabes', nombre: 'ÁRABES' },
    { id: 'disenador', nombre: 'DISEÑADOR' },
    { id: 'caballero', nombre: 'CABALLERO' },
    { id: 'dama', nombre: 'DAMA' },
    { id: 'unisex', nombre: 'UNISEX' }
  ]

  // =========================================
  // FILTRAR PRODUCTOS
  // =========================================

  const perfumesFiltrados = perfumes.filter((perfume) => {
    const perteneceCategoria =
      categoria === 'todos' || perfume.categoria === categoria

    const coincideBusqueda =
      perfume.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      perfume.marca.toLowerCase().includes(busqueda.toLowerCase())

    return perteneceCategoria && coincideBusqueda
  })

  // =========================================
  // TÍTULO
  // =========================================

  const obtenerTitulo = () => {
    if (categoria === 'todos') return 'TODOS'
    if (categoria === 'arabes') return 'ÁRABES'
    if (categoria === 'disenador') return 'DISEÑADOR'
    if (categoria === 'caballero') return 'CABALLERO'
    if (categoria === 'dama') return 'DAMA'
    if (categoria === 'unisex') return 'UNISEX'
    return 'PERFUMES'
  }

  // =========================================
  // CAMBIAR CATEGORÍA
  // =========================================

  const cambiarCategoria = (nuevaCategoria) => {
    setCategoria(nuevaCategoria)
    setBusqueda('')
  }

  // =========================================
  // LOGIN Y AUTENTICACIÓN
  // =========================================

  const abrirLogin = (perfume) => {
    setPerfumeSeleccionado(perfume)
    setMostrarLogin(true)
    setMostrarDetalle(false)
    setUsuario('')
    setPassword('')
    setMensajeLogin('')
  }

 const iniciarSesion = async (e) => {
  e.preventDefault()

  setMensajeLogin('')
  setCargando(true)

  try {
    const respuesta = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usuario: usuario,
        password: password
      })
    })

    const texto = await respuesta.text()

    console.log('Respuesta del servidor:', texto)
    console.log('Código HTTP:', respuesta.status)

    let datos

    try {
      datos = JSON.parse(texto)
    } catch (error) {
      console.error('El servidor no devolvió JSON:', texto)

      setMensajeLogin(
        'El servidor respondió con un formato incorrecto. Revisa la consola del servidor.'
      )

      return
    }

    if (!respuesta.ok) {
      setMensajeLogin(datos.mensaje || 'Usuario o contraseña incorrectos.')
      return
    }

    setMostrarLogin(false)
    setMostrarDetalle(true)
    setMensajeLogin('')

  } catch (error) {
    console.error('ERROR COMPLETO:', error)

    setMensajeLogin(
      'No se pudo conectar con el servidor.'
    )

  } finally {
    setCargando(false)
  }
}


  // =========================================
  // INTERFAZ
  // =========================================

  return (
    // En tu App.jsx (ya lo puedes dejar así en la etiqueta principal)
<div className="min-h-screen bg-black text-white notranslate">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-neutral-900 bg-black/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-4 lg:grid lg:grid-cols-[220px_1fr_300px] lg:items-center">

          {/* LOGO */}
          <div>
            <h1 className="whitespace-nowrap text-2xl font-bold tracking-[0.22em] sm:text-3xl">
              444 ESSENCE
            </h1>
          </div>

          {/* MENÚ */}
          <nav className="flex flex-wrap items-center gap-2 lg:justify-center">
            {categorias.map((item) => (
              <button
                key={item.id}
                onClick={() => cambiarCategoria(item.id)}
                className={`rounded-full border px-3 py-2 text-[10px] font-bold tracking-wide transition-all duration-200 sm:px-4 sm:text-[11px] ${
                  categoria === item.id
                    ? 'border-white bg-white text-black'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                {item.nombre}
              </button>
            ))}
          </nav>

          {/* BUSCADOR */}
          <div className="w-full">
            <div className="flex h-10 items-center rounded-xl border border-neutral-900 bg-neutral-900 px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mr-2 h-4 w-4 text-neutral-500"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>

              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar perfume..."
                className="w-full bg-transparent text-xs text-white outline-none placeholder:text-neutral-600"
              />
            </div>
          </div>

        </div>
      </header>

      {/* FONDO DECORATIVO */}
      <div className="pointer-events-none fixed left-1/2 top-36 z-0 -translate-x-1/2 select-none text-[70px] font-black tracking-[0.08em] text-white/[0.025] sm:text-[100px] lg:text-[140px]">
        ESSENCE
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="relative z-10 mx-auto min-h-[calc(100vh-190px)] max-w-[1400px] px-5 pb-32 pt-8 sm:px-8 lg:px-10">

        {/* TÍTULO */}
        <div className="mb-7">
          <h2 className="text-2xl font-bold tracking-[0.18em] sm:text-3xl">
            {obtenerTitulo()}
          </h2>
          <div className="mt-3 h-px w-14 bg-white" />
        </div>

        {/* PRODUCTOS */}
        {perfumesFiltrados.length > 0 ? (
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {perfumesFiltrados.map((perfume) => (
              <article
                key={perfume.id}
                className="group overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700"
              >
                {/* IMAGEN */}
                <div className="aspect-[4/4.6] w-full overflow-hidden bg-neutral-900">
                  <img
                    src={perfume.imagen}
                    alt={perfume.nombre}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://placehold.co/500x600/111111/777777?text=PERFUME'
                    }}
                  />
                </div>

                {/* INFORMACIÓN */}
                <div className="p-3">
                  <h3 className="truncate text-xs font-bold tracking-wide sm:text-sm">
                    {perfume.nombre}
                  </h3>
                  <p className="mt-1 truncate text-[10px] uppercase tracking-wider text-neutral-500">
                    {perfume.marca}
                  </p>
                  <p className="mt-3 text-xs font-semibold text-white">
                    {perfume.precio}
                  </p>
                  <button
                    onClick={() => abrirLogin(perfume)}
                    className="mt-3 w-full rounded-lg bg-white px-2 py-2 text-[10px] font-bold text-black transition hover:bg-neutral-300"
                  >
                    AGREGAR AL CARRITO
                  </button>
                </div>
              </article>
            ))}
          </section>
        ) : (
          /* SIN RESULTADOS */
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-950">
            <div className="text-center">
              <p className="text-lg font-semibold text-neutral-400">
                No se encontraron perfumes
              </p>
              <p className="mt-2 text-sm text-neutral-600">
                Intenta con otro nombre o marca.
              </p>
            </div>
          </div>
        )}

      </main>

      {/* ICONO USUARIO */}
      <button
        className="fixed bottom-24 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 text-black shadow-[0_0_20px_rgba(255,255,255,0.12)] transition hover:scale-105 hover:bg-white sm:right-8"
        title="Usuario"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path
            fillRule="evenodd"
            d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 4a3 3 0 1 1-3 3 3 3 0 0 1 3-3Zm0 12a7.5 7.5 0 0 1-5.5-2.4 5.5 5.5 0 0 1 11 0A7.5 7.5 0 0 1 12 18Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 z-30 w-full border-t border-neutral-900 bg-black/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3 sm:px-8 lg:px-10">

          {/* ADMINISTRADOR */}
          <div>
            <h3 className="text-[10px] font-bold tracking-widest text-neutral-300">
              ADMINISTRADOR
            </h3>
            <p className="mt-1 text-[10px] text-neutral-500">
              Melani Naomi Sanchez Parada
            </p>
            <p className="mt-1 text-[10px] text-neutral-600">
              WhatsApp: 9631525089
            </p>
          </div>

          {/* REDES */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-neutral-400 transition hover:text-white"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <rect width="18" height="18" x="3" y="3" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>

            <a
              href="#"
              className="text-neutral-400 transition hover:text-white"
              aria-label="WhatsApp"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path d="M20 11.5a8 8 0 0 1-11.7 7.1L4 20l1.4-4.1A8 8 0 1 1 20 11.5Z" />
                <path d="M8.5 8.5c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.6 1.4c.1.2.1.4-.1.6l-.5.6c.7 1.3 1.4 2 2.7 2.7l.6-.5c.2-.2.4-.2.6-.1l1.4.6c.3.1.4.3.4.5 0 .3 0 .6-.2.9" />
              </svg>
            </a>
          </div>

        </div>
      </footer>

      {/* LOGIN */}
      {mostrarLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-5 backdrop-blur-md">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 p-8 shadow-2xl">

            {/* BOTÓN CERRAR */}
            <button
              onClick={() => setMostrarLogin(false)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-800 hover:text-white"
            >
              ×
            </button>

            {/* LOGO */}
            <div className="mb-8 text-center">
              <p className="text-xs font-bold tracking-[0.35em] text-neutral-500">
                444 ESSENCE
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-widest">
                INICIAR SESIÓN
              </h2>
              <p className="mt-2 text-xs text-neutral-500">
                Inicia sesión para ver los detalles del perfume.
              </p>
            </div>

            {/* PERFUME SELECCIONADO */}
            {perfumeSeleccionado && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-neutral-800 bg-black p-3">
                <img
                  src={perfumeSeleccionado.imagen}
                  alt={perfumeSeleccionado.nombre}
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div>
                  <p className="text-xs font-bold">
                    {perfumeSeleccionado.nombre}
                  </p>
                  <p className="mt-1 text-[10px] text-neutral-500">
                    {perfumeSeleccionado.marca}
                  </p>
                </div>
              </div>
            )}

            {/* FORMULARIO */}
            <form onSubmit={iniciarSesion}>
              {/* USUARIO */}
              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold text-neutral-400">
                  USUARIO
                </label>
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  autoComplete="username"
                  className="h-12 w-full rounded-xl border border-neutral-800 bg-black px-4 text-sm text-white outline-none transition focus:border-white"
                />
              </div>

              {/* CONTRASEÑA */}
              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold text-neutral-400">
                  CONTRASEÑA
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  className="h-12 w-full rounded-xl border border-neutral-800 bg-black px-4 text-sm text-white outline-none transition focus:border-white"
                />
              </div>

              {/* MENSAJE */}
              {mensajeLogin && (
                <div className="mb-5 rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-xs text-red-300">
                  {mensajeLogin}
                </div>
              )}

              {/* BOTÓN */}
              <button
                type="submit"
                disabled={cargando}
                className="h-12 w-full rounded-xl bg-white text-xs font-bold tracking-widest text-black transition hover:bg-neutral-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cargando ? 'VERIFICANDO...' : 'INICIAR SESIÓN'}
              </button>
            </form>

            {/* PIE */}
            <p className="mt-6 text-center text-[10px] text-neutral-600">
              Acceso exclusivo para clientes registrados
            </p>
          </div>
        </div>
      )}

      {/* DETALLE DEL PERFUME */}
      {mostrarDetalle && perfumeSeleccionado && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-5 backdrop-blur-md">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 shadow-2xl">

            {/* CERRAR */}
            <button
              onClick={() => setMostrarDetalle(false)}
              className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-xl text-neutral-400 transition hover:bg-black hover:text-white"
            >
              ×
            </button>

            <div className="grid md:grid-cols-2">

              {/* IMAGEN */}
              <div className="aspect-square bg-neutral-900 md:aspect-auto">
                <img
                  src={perfumeSeleccionado.imagen}
                  alt={perfumeSeleccionado.nombre}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* INFORMACIÓN */}
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <p className="text-[10px] font-bold tracking-[0.3em] text-neutral-500">
                  444 ESSENCE
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-wide">
                  {perfumeSeleccionado.nombre}
                </h2>

                <p className="mt-2 text-sm uppercase tracking-widest text-neutral-500">
                  {perfumeSeleccionado.marca}
                </p>

                <div className="my-7 h-px w-full bg-neutral-800" />

                <p className="text-2xl font-semibold">
                  {perfumeSeleccionado.precio}
                </p>

                <p className="mt-5 text-sm leading-6 text-neutral-500">
                  Descubre la esencia de {perfumeSeleccionado.nombre}.
                  Una fragancia seleccionada por 444 ESSENCE.
                </p>

                <button
                  onClick={() => setMostrarDetalle(false)}
                  className="mt-8 rounded-xl bg-white py-3 text-xs font-bold tracking-widest text-black transition hover:bg-neutral-300"
                >
                  CERRAR
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default App