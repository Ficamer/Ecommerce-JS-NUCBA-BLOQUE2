//Constantes nav menu
const nav = document.querySelector('.nav');
const abrirNav = document.querySelector('.abrir-nav');
const buscador = document.querySelector('.search');

//Constantes contenedores para cargar productos
const contenedorBuscados = document.querySelector('.productos-buscados');
const contenedorProductos = document.querySelector('.contenedor-productos');

//Constante menu de filtro por categoria
const contenedorCategorias = document.querySelector('.contenedor__categorias');
const categoriasModoCelular = document.querySelector('.categorias-celular');
const listaCategorias = document.querySelectorAll('.categoria');

//Constantes carrito de compras
const iconoCarrito = document.querySelector('.iconCarrito');
const contadorProductos = document.querySelector('.contador');
const menuCarrito = document.querySelector('.carrito__menu');
const productosCarrito = document.querySelector('.carrito__productos');
const botonBorrar = document.querySelector('.boton-borrar');
const botonComprar = document.querySelector('.boton-compra');
const total = document.querySelector('.total');

//--- Array de productos para el carrito ---
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

//--- Guardar en LocalStorage los productos cargados en el carrito ---
const saveLocalStorage = listaProductos => {
    localStorage.setItem('carrito', JSON.stringify(listaProductos)); 
    //Creamos una clave tasks para guardar los valores de la lista de tareas en forma de JSON.
};


//--- RENDERIZACION DE PRODUCTOS ---

//Funcion para crear el HTML del producto.
const renderProduct = (producto)=> {
    const {id, nombre, categoria,precio,img} = producto; //Desestructuro
    return `<div class="items" id=${id} categoria=${categoria}><img src="${img}"><div class="producto-texto"><h3>${nombre}</h3><p>Precio: <span class="precio">$${precio}</span></p></div><i class="fa-solid fa-cart-shopping agregarCarrito" data-id='${id}' data-nombre='${nombre}' data-precio='${precio}' data-img='${img}'></i></div>`
};
//Renderizo todos los productos 
const renderAllProducts = (productos) => {
    contenedorProductos.innerHTML = productos.map(renderProduct).join('');//Con el metodo .join('') hago que el separador sea vacio, o sea que no haya separador.
        //Map crea un nuevo array en el que a cada elemento se le asigna una funcion.
}
const renderFilteredProducts = (categoria) =>{
    const productList = productsData.filter((producto) => producto.categoria == categoria);
    contenedorProductos.innerHTML = productList.map(renderProduct).join('');
}
//Renderizo el arreglo de productos
const renderProducts = (categoria = undefined) => { //Render es un nombre que se refiere a "pintar"
    if(!categoria){ //Si no tengo categoria
        renderAllProducts(productsData); 
        return;
    };
    renderFilteredProducts(categoria); //Filtro por categoria
};
//Renderizo productos buscados
const renderSearchedProducts = (categoria) =>{
    if (categoria.length == 0){
        contenedorBuscados.innerHTML ="";
        return;
    }
    const productList = productsData.filter((producto) => producto.nombre.toLowerCase().includes(categoria.toLowerCase()) && (producto.nombre[0].toLowerCase() == categoria[0].toLowerCase()));
    contenedorBuscados.innerHTML = productList.map(renderProduct).join('');
}

// --- Logica de filtros, por categoria seleccionada y busqueda ---

//Cambiar el background-color si la categoria esta seleccionada.
const cambiarEstadoListaActiva = (categoriaSeleccionada) => {
    const categorias = [...listaCategorias]; //Como es un HTML Collection lo transformo a array.
    categorias.forEach((listaActiva)=>{
        if(listaActiva.dataset.categoria != categoriaSeleccionada){
            listaActiva.classList.remove('active');
            return;
        }
        listaActiva.classList.add('active');
    });
};
//Guardar en una constante la categoria de la seleccion.
const cambiarFiltroEstado = e=>{
    const categoriaSeleccionada = e.target.dataset.categoria; //Guardo la categoria del target
    cambiarEstadoListaActiva(categoriaSeleccionada);
};
//Filtrar productos segun el valor ingresado en el search del nav.
const filtrarPorBusqueda = ()=>{
    const categoria = buscador.value.trim('');
    if (categoria.length >0){
        contenedorBuscados.style.display="flex";
        if(nav.classList.contains('visible')){
            abrirNav.innerHTML = `<i class="fa-solid fa-bars"></i>`;
            abrirNav.dataset.id ="0";
            nav.classList.remove('visible');
        } 
        menuCarrito.classList.remove('open-cart')
    }else {
        contenedorBuscados.style.display="none";
    }
    renderSearchedProducts(categoria);
}
//Aplicar filtro cambio de (background-color) al hacer click sobre el elemento seleccionado.
const aplicarFiltro = e=>{
    if(!e.target.classList.contains('categoria'))return; //Si no contiene la clase categoria retornar.
    cambiarFiltroEstado(e);
    if(!e.target.dataset.categoria){ //Si no tiene la categoria del elemento seleccionado
        contenedorProductos.innerHTML = "";
        renderProducts();
    } else {
        console.log(e.target.dataset.categoria);
        renderProducts(e.target.dataset.categoria);
    }
};


//--- Abrir y cerrar el nav-menu, carrito y menu de categorias modo celular  ---

//Abrir y cerrar nav-menu con cambio de icono.
abrirNav.addEventListener('click', e =>{
    const seleccionado = Number(abrirNav.dataset.id);
    if(menuCarrito.classList.contains('open-cart')){
        menuCarrito.classList.toggle('open-cart');
        productosCarrito.classList.toggle('show-overlay');
    }
    if (seleccionado===0) {
        abrirNav.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
        e.currentTarget.dataset.id = "1";
        nav.classList.add("visible");
    }else {
        abrirNav.innerHTML = `<i class="fa-solid fa-bars"></i>`;
        e.currentTarget.dataset.id = "0";  //UTILIZAR currentTarget
        nav.classList.remove("visible");
    }
});
categoriasModoCelular.addEventListener('click',()=>{   
    contenedorCategorias.classList.toggle('show-overlay');
});
//Abrir y cerrar el carrito.
const toggleCart = () => {
    menuCarrito.classList.toggle('open-cart'); //El método toggle() alterna entre hide() y show(), basicamente agrega o quita una clase.
    contenedorBuscados.style.display="none";
    if(nav.classList.contains('visible')){
        abrirNav.innerHTML = `<i class="fa-solid fa-bars"></i>`;
        abrirNav.dataset.id ="0";
        nav.classList.remove('visible');
    }
    productosCarrito.classList.toggle('show-overlay');
};


//--- Renderizacion de los productos cargados en el carrito y logica del carrito ---

// Creo el HTML del producto seleccionado obteniendo las propiedades del objeto con destruccturing
const renderProductoCarrito = (producto)=>{
    const {id, nombre, categoria,precio,img,quantity} = producto; //Desestructuro
    return `<div class="carrito__items" id=${id} categoria=${categoria}>
    <img src="${img}">
    <div class="producto-texto">
        <h3>${nombre}</h3>
        <p>Precio: <span class="precio">$${precio}</span></p>
    </div>
    
    <div class="item-handler">
        <span class="quantity-handler down" data-id=${id}>-</span>
        <span class="item-quantity">${quantity}</span>
        <span class="quantity-handler up" data-id=${id}>+</span>
    </div>
    </div>`
};

//Dibujo los productos del carrito, en caso de no haber, muestro texto indicandolo.
const renderCarrito = (carrito) => {
    if(!carrito.length){
        productosCarrito.innerHTML = `<p class="empty-msg">No hay productos en el carrito.</p>`;
        return;
    }
    productosCarrito.innerHTML = carrito.map(renderProductoCarrito).join('');
};

//Obtengo el valor final de la suma de todos los productos.
const obtenerTotalCarrito = ()=>{
    return carrito.reduce((acc,cur)=>acc + Number(cur.precio) * cur.quantity,0);
};

//Renderizo el total 
const mostrarTotal = ()=>{
    total.innerHTML = `${obtenerTotalCarrito().toFixed(2)}$`  //toFixed limita los decimales a dos.
};

//A partir de los dataset que coloque en el boton agregar producto de cada producto, creo la data del producto agregado al carrito.
const crearDataProducto = (id,nombre,precio,img)=>{ 
    return {id, nombre, precio,img};
};

//Analizo la existencia del producto en el carrito, en caso de coincidir, retorno el producto.
const existeProductoEnCarrito = (producto)=>{
    console.log(carrito.find((item)=>item.id === producto.id));
    return carrito.find((item)=>item.id === producto.id);
};

//Incremento la cantidad de unidades si hay coincidencia, es decir si agregamos un producto que ya estaba en el carrito, le aumentamos una unidad.
const agregarUnidad = (producto)=>{
    carrito = carrito.map((productoCarrito)=>{
        return productoCarrito.id === producto.id ? {...productoCarrito, quantity: productoCarrito.quantity + 1} : productoCarrito  //Sumale uno a la cantidad, uso operador ternario.
    })
};

//Redefinimos el arreglo carrito, pero agregandole el producto cargado con una propiedad extra que hace referencia a cantidad.
const crearProductoCarrito = (producto) =>{
    carrito = [...carrito,{...producto,quantity: 1}]; //Agregamos al  arreglo carrito, el producto que creamos al obtener los dataset y ademas agregamos la propiedad quantity y la iniciamos en 1.
    console.log("Producto creado");
    console.log(carrito);
};

//Logica para añadir un producto al carrito al hacer click en el boton para aregar.
const agregarProductoCarrito = e =>{
    if(carrito.length>3){
        alert("La cantidad maxima de productos distintos por compra es de 4.");
        return;
    }
    if(!e.target.classList.contains("agregarCarrito"))return;
    const {id,nombre,precio,img} = e.target.dataset; //Desestructuro los dataset del target, y los guardo en constantes
    const producto = crearDataProducto(id,nombre,precio,img);

    if (existeProductoEnCarrito(producto)){
        agregarUnidad(producto);
    }else {
        crearProductoCarrito(producto);
    }
    checkEstadoCarrito(); //Basicamente, actualiza el contenido del carrito en caso de que haya cambios. 
};

//Quitar todos los productos del carrito, hago que sea igual a un array vacio.
const resetearCarrito = ()=>{
    carrito = [];
    checkEstadoCarrito();
};

//Alerta que verifica si el usuario esta de acuerdo con eliminar los productos del carrito y permite aceptarlo.
const completeCartAction = (confirmMsg, successMsg) => {
    if(!carrito.length) return;
    if(window.confirm(confirmMsg)) { //Muestra el mensaje y si tocamos confirmar en la ventana, entra en la condicion.
        resetearCarrito();
        alert(successMsg);
    }
};

//Le asigno una accion al boton para borrar los productos del carrito.
const borrarCarrito = ()=>{
    completeCartAction("Desea vaciar el carrito?","No hay productos en el carrito.")
};
//Resto una unidad al producto.
const restarUnidadProducto = (productoExistente) => {
    carrito = carrito.map(producto => {
        return producto.id === productoExistente.id ? {...producto,quantity: Number(producto.quantity) - 1} : producto;
    })
}

//Elimino producto del carrito
const removerProductoDelCarrito = (productoExistente)=>{

    carrito = carrito.filter(producto => producto.id !== productoExistente.id); //Filtrame todos los productos que no se correspondan con el ID del producto que quiero quitar.
    checkEstadoCarrito();
}

//Evento boton restar
const  eventoBotonRestar = (id)=>{
    const productoCarritoExistente = carrito.find((item)=>item.id === id); // busco el producto que coincide con el id
    if(productoCarritoExistente.quantity ===1){
        if(window.confirm("Desea eliminar el producto del carrito")){
            //borrar producto
            console.log("hola");
            removerProductoDelCarrito(productoCarritoExistente);
        }
        return; //evito que no me quite la unidad.
    }
    restarUnidadProducto(productoCarritoExistente);
}

//Evento boton sumar
const  eventoBotonSumar = (id)=>{
    const productoCarritoExistente = carrito.find((item)=>item.id === id); // busco el producto que coincide con el id
    agregarUnidad(productoCarritoExistente);
}

//Manejar cantidad de un producto
const manejarCantidad = (e) => {
    if(e.target.classList.contains("down")){
        eventoBotonRestar(e.target.dataset.id);
    }
    else if(e.target.classList.contains("up")){
        eventoBotonSumar(e.target.dataset.id);
    }
    checkEstadoCarrito();
}
//Checkeo el estado del carrito
const checkEstadoCarrito = () =>{
    saveLocalStorage(carrito);
    const cantProductos = carrito.map((producto)=>producto.quantity);
    let total = 0;
    cantProductos.forEach((a)=> total+=a);
    contadorProductos.innerHTML = `${total}`;  
    renderCarrito(carrito);
    mostrarTotal();
};

//Funcion inicializadora 
const init = ()=>{
    renderProducts();
    contenedorCategorias.addEventListener('click',aplicarFiltro);
    buscador.addEventListener('keyup',filtrarPorBusqueda);
    contenedorProductos.addEventListener('click',agregarProductoCarrito);
    iconoCarrito.addEventListener('click',toggleCart);
    document.addEventListener('DOMContentLoaded',checkEstadoCarrito);
    botonBorrar.addEventListener('click',borrarCarrito);
    productosCarrito.addEventListener('click', manejarCantidad);
};

init();
