// Traer elementos del html
const form = document.getElementById('form');
const nameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');
const phoneInput = document.getElementById('phone');

// Funciones de validacion

// Checkeamos el nombre de usuario (devolvemos un booleano)
const checkUsername = () => {
    //Input valido por defecto = false
    let valid = false;

    //Guardamos en dos variables el minimo y el maximo de caracteres para el nombre de usuario
    const min = 3;
    const max = 25;

    //Guardamos el nombre de usuario en una variable.
    const username = nameInput.value.trim();

    //Si el campo esta vacio, mostranos un error llamando a la funcion showError.
    if(!isEmpty(username)){ // Lo niego ya que coloque inverso el ternario, es decir si esta vacio devuelve false, entonces deberia negar para que el condicional sea true y haga algo.
        showError(nameInput,'El nombre es obligatorio')
    }else if(!isBetween(username.length,min,max)){
        showError(nameInput,`El nombre debe tener entre ${min} y ${max} caracteres`)
    }else {
        showSuccess(nameInput);
        valid = true;
    }
    return valid;
}

// Checkear el email

const checkEmail = () => {
    let valid = false;

    const emailValue = emailInput.value.trim();

    if (!isEmpty(emailValue)) {
        showError(emailInput, 'El mail es obligatorio');
    }else if (!isEmailValid){
        showError(emailInput, 'El email no es valido');
    }else {
        showSuccess(emailInput);
        valid = true;
    }
    return valid;
}

// Checkear contraseña

const checkPassword = () => {
    let valid = false;

    const password = emailInput.value.trim();

    if (!isEmpty(password)) {
        showError(passInput, 'La contraseña es obligatoria');
    }else if (!isPassSecure){
        showError(passInput, 'La contraseña debe tener al menos 8 caracteres, una mayuscula, una minuscula y un simbolo especial.');
    }else {
        showSuccess(passInput);
        valid = true;
    }
    return valid;
}

// Checkear telefono
const checkPhone = () => {
    let valid = false;

    const phoneValue = phoneInput.value.trim();

    if (!isPhoneValid(phoneValue)) {
        showError(phoneInput, 'El telefono no es valido');
    }else {
        showSuccess(phoneInput);
        valid = true;
    }
    return valid;
}



// Funciones para verificar si esta vacio, longitud, errores, etc.

// Funcion para verificar si se necesita un campo, esta funcion nos va a devolver true si el campo esta vacio.
const isEmpty = value => (value === '' ? false : true); //Uso ternario.

// Funcion para verificar si la longitud del campo esta dentro de un minimo y un maximo
const isBetween = (length,min,max) => length < min || length > max ? false : true;

// Funcion para mostrar un error
// Recibir input y el mensaje de error.
const showError = (input, message) => {
    const formField =  input.parentElement; //Vamos a llamar al padre del input, es decir a su correspondiente formfield
    formField.classList.remove('success');
    formField.classList.add('error');
    const error = formField.querySelector('small');
    error.textContent =  message;
}

// Funcion para mostrar exito, recibe el input.

const showSuccess = input => {
    const formField = input.parentElement;
    formField.classList.remove('error');
    formField.classList.add('success');
    const error = formField.querySelector('small');
    error.textContent = ''; // No quiero que haya mensaje
}

// Email valido, hay que usar expresiones regulares.
//Una expresion regular, es un (objeto) patron que se utiliza para hacer coincidir combinaciones de caracteres.

const isEmailValid = email => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    
    // Testear
    return re.test(email);
}

// Checkear que la contraseña tenga 8 caracteres, minuscula, mayuscula y un simbolo.
const isPassSecure = pass => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
    
    //Testeamos
    return re.test(pass)
}

//Checkear que el telefono es valido (10 numeros)
const isPhoneValid = phone => {
    const re = /^[0-9]{10}$/;

    //Testeamos
    return re.test(phone);
}

// Event Listener para enviar y checkear que todo sea valido

form.addEventListener('submit', e =>{
    e.preventDefault();

    // Guardar el estado de los inputs en variables
    let isUsernameValid = checkUsername();
    let isEmailValid = checkEmail();
    let isPasswordValid = checkPassword();
    let isPhoneValid = checkPhone();

    console.log(isUsernameValid,isEmailValid,isPasswordValid,isPhoneValid);

    let isFormValid = isUsernameValid && isEmailValid && isPasswordValid && isPhoneValid;

    //Si todos los campos son validos, "Enviamos" el formulario

    if(isFormValid) {
        alert('Exito');
        form.submit();
    }
});

// Las funciones de rebote (debounce) no se ejecutan al momento de su invocacion. En lugar de esto, lo que hace 
// es retrasar su ejecucion por un periodo de tiempo predeterminado. Si la misma funcion se invoca de nuevo, la ejecucion previa se cancela y el tiempo de espera se reinicia.
// Funcion de rebote, debounce. Lo que hace es que cuando estemos escribiendo
//y dejemos de escribir, va a esperar 500ms y luego de esos 500ms analiza si es correcto el contenido del input o no.
//Coloco el delay por defecto en 500ms.

//Esta funcion recibe dos parametros: una funcion (callback) y un tiempo de delay 500ms.
const debounce = (funcion,delay = 500) => {
    let timeoutId;
    return(...args) =>{
        // Cancelar el timer anterior
        if(timeoutId) clearTimeout(timeoutId);

        // Setear un nuevo timer
        timeoutId = setTimeout(()=> {
            funcion.apply(null,args);
        }, delay);
    };
};

//Agregar un addEventLister de tipo input al form, para usar el debounce.
form.addEventListener('input',debounce(e=>{
    switch(e.target.id){
        case 'username':
            checkUsername();
            break;
        case 'email':
            checkEmail();
            break;
        case 'password':
            checkPassword();
            break;  
        case 'phone':
            checkPhone();
            break;  
    }
}))