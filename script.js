const nav = document.querySelector('.nav');
const abrirNav = document.querySelector('.abrir-nav');
const menuCarrito = document.querySelector('.carrito__menu');
const productosCarrito = document.querySelector('.carrito__productos');
const iconoCarrito = document.querySelector('.iconCarrito');
const contadorHtml = document.querySelector('.contador');
//Boton vaciar carrito
const botonBorrar = document.querySelector('.boton-borrar');
const botonCompra = document.querySelector('.boton-compra');
const total = document.querySelector('.total');
const contenedorProductos = document.querySelector('.contenedor-productos');
const categorias = document.querySelector('.menu-productos');
//HTML collection de todas las categorias
const listaCategorias = document.querySelectorAll('.categoria');


//Setear el array para el carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Funcion para guardar en el localstorage 
const saveLocalStorage = listaProductos => {
    localStorage.setItem('carrito', JSON.stringify(listaProductos)); 
    //Creamos una clave tasks para guardar los valores de la lista de tareas en forma de JSON.
};

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


//Logica de filtros 
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
const cambiarFiltroEstado = e=>{
    const categoriaSeleccionada = e.target.dataset.categoria; //Guardo la categoria del target
    cambiarEstadoListaActiva(categoriaSeleccionada);
};
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

//Abrir y cerrar el carrito/menu y mostrar el overlay

//Abrir y cerrar menu con cambio de icono.
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

//Abrir y cerrar el carrito.
const toggleCart = () => {
    menuCarrito.classList.toggle('open-cart'); //El método toggle() alterna entre hide() y show(), basicamente agrega o quita una clase.
    if(nav.classList.contains('visible')){
        abrirNav.innerHTML = `<i class="fa-solid fa-bars"></i>`;
        abrirNav.dataset.id ="0";
        nav.classList.remove('visible');
    }
    productosCarrito.classList.toggle('show-overlay');
};

//Logica del carrito

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
        <span class="quantity-handler up" data-id=${id}></span>
    </div>
    </div>`
};

const renderCarrito = (carrito) => {
    if(!carrito.length){
        productosCarrito.innerHTML = `<p class="empty-msg">No hay productos en el carrito.</p>`;
        return;
    }
    productosCarrito.innerHTML = carrito.map(renderProductoCarrito).join('');
};

const obtenerTotalCarrito = ()=>{
    return carrito.reduce((acc,cur)=>acc + Number(cur.precio) * cur.quantity,0);
};

const mostrarTotal = ()=>{
    total.innerHTML = `${obtenerTotalCarrito().toFixed(2)}$`  //toFixed limita los decimales a dos.
};

const crearDataProducto = (id,nombre,precio,img)=>{ // A partir de los dataset que coloque en el boton agregar producto de cada producto.
    return {id, nombre, precio,img};
};
const existeProductoEnCarrito = (producto)=>{
    return carrito.find((item)=>item.id === producto.id);
};

//Incremento la cantidad de unidades si hay coincidencia, es decir si agregamos un producto que ya estaba en el carrito, le aumentamos una unidad.
const agregarUnidad = (producto)=>{
    carrito = carrito.map((productoCarrito)=>{
        return productoCarrito.id === producto.id ? {...productoCarrito, quantity: productoCarrito.quantity + 1} : productoCarrito  //Sumale uno a la cantidad, uso operador ternario.
    })
};

const crearProductoCarrito = (producto) =>{
    carrito = [...carrito,{...producto,quantity: 1}]; //Agregamos al  arreglo carrito, el producto que creamos al obtener los dataset y ademas agregamos la propiedad quantity y la iniciamos en 1.
    console.log("Producto creado");
    console.log(carrito);
};
const agregarProductoCarrito = e =>{
    if(carrito.length>3){
        alert("La cantidad maxima de productos distintos por compra es de 4.");
        return;
    }
    if(!e.target.classList.contains("agregarCarrito"))return;
    const {id,nombre,precio,img} = e.target.dataset;
    const producto = crearDataProducto(id,nombre,precio,img);

    if (existeProductoEnCarrito(producto)){
        agregarUnidad(producto);
    }else {
        crearProductoCarrito(producto);
    }
    checkEstadoCarrito();
};
//Quitar todos los productos
const resetearCarrito = ()=>{
    carrito = [];
    checkEstadoCarrito();
};
const completeCartAction = (confirmMsg, successMsg) => {
    if(!carrito.length) return;
    if(window.confirm(confirmMsg)) { //Muestra el mensaje y si tocamos confirmar en la ventana, entra en la condicion.
        resetearCarrito();
        alert(successMsg);
    }
};
const borrarCarrito = ()=>{
    completeCartAction("Desea vaciar el carrito?","No hay productos en el carrito.")
};

//Checkeo el estado del carrito
const checkEstadoCarrito = () =>{
    saveLocalStorage(carrito);
    const cantProductos = carrito.map((producto)=>producto.quantity);
    let total = 0;
    cantProductos.forEach((a)=> total+=a);
    contadorHtml.innerHTML = `${total}`;  
    renderCarrito(carrito);
    mostrarTotal();
};

//Funcion inicializadora 
const init = ()=>{
    renderProducts();
    categorias.addEventListener('click',aplicarFiltro);
    contenedorProductos.addEventListener('click',agregarProductoCarrito);
    iconoCarrito.addEventListener('click',toggleCart);
    document.addEventListener('DOMContentLoaded',checkEstadoCarrito);
    botonBorrar.addEventListener('click',borrarCarrito);
};

init();
