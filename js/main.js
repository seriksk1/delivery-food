new WOW().init();

const modal = document.querySelector('.modal');
const cartButton = document.querySelector('#cart-button');
const close = document.querySelector('.close');

function ToggleModal() {
  modal.classList.toggle('modal-active');
}

cartButton.addEventListener('click', ToggleModal);
close.addEventListener('click', ToggleModal);
