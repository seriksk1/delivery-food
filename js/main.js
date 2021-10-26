new WOW().init();

const modal = document.querySelector('.modal');
const cartButton = document.querySelector('#cart-button');
const close = document.querySelector('.close');

const modalAuth = document.querySelector('.modal-auth');
const buttonAuth = document.querySelector('.button-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');

let login = localStorage.getItem('login');

function ToggleModal() {
  modal.classList.toggle('modal-active');
}

function ToggleModalAuth() {
  modalAuth.classList.toggle('modal-active');
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function notAuthorized() {
  console.log('Не авторизован');

  function logIn(event) {
    event.preventDefault();
    login = loginInput.value;

    if (!login) {
      alert('Введите логин для продолжения!');
    } else {
      localStorage.setItem('login', login);
      ToggleModalAuth();
    }

    buttonAuth.removeEventListener('click', ToggleModalAuth);
    closeAuth.removeEventListener('click', ToggleModalAuth);
    logInForm.removeEventListener('submit', logIn);
    logInForm.reset();

    checkAuth();
  }

  buttonAuth.addEventListener('click', ToggleModalAuth);
  closeAuth.addEventListener('click', ToggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function authorized() {
  console.log('Авторизован');

  function logOut() {
    login = null;
    localStorage.removeItem('login');

    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);

    checkAuth();
  }

  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  buttonOut.addEventListener('click', logOut);
}

function init() {
  cartButton.addEventListener('click', ToggleModal);
  close.addEventListener('click', ToggleModal);

  checkAuth();
}

init();
