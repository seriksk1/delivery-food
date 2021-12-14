import Swiper from 'https://unpkg.com/swiper@7/swiper-bundle.esm.browser.min.js';

new WOW().init();

const modal = document.querySelector(".modal");
const cartButton = document.querySelector("#cart-button");
const close = document.querySelector(".close");
const modalAuth = document.querySelector(".modal-auth");
const buttonAuth = document.querySelector(".button-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
const cardsRestaurants = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");
const restaurantTitle = document.querySelector(".section-title-rest");
const restaurantRating = document.querySelector(".rating");
const restaurantPrice = document.querySelector(".price");
const restaurantCategory = document.querySelector(".category");
const restaurant = document.querySelector(".card");

let login = localStorage.getItem("login");

const getData = async function (url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Ошибка по адресу ${url}, статсус ошибки ${response.status}!`
    );
  }

  return await response.json();
};

function ToggleModal() {
  modal.classList.toggle("modal-active");
}

function ToggleModalAuth() {
  modalAuth.classList.toggle("modal-active");
  loginInput.style.borderColor = "";

  if (modalAuth.classList.contains("modal-active")) {
    disabledScroll();
  } else {
    enabledScroll();
  }
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function notAuthorized() {
  console.log("Не авторизован");

  function logIn(event) {
    event.preventDefault();
    login = loginInput.value;

    if (login.trim()) {
      localStorage.setItem("login", login);
      ToggleModalAuth();
    } else {
      alert("Введите логин для продолжения!");
      loginInput.style.borderColor = "#ff0000";
    }

    buttonAuth.removeEventListener("click", ToggleModalAuth);
    closeAuth.removeEventListener("click", ToggleModalAuth);
    logInForm.removeEventListener("submit", logIn);
    logInForm.reset();

    checkAuth();
  }

  buttonAuth.addEventListener("click", ToggleModalAuth);
  closeAuth.addEventListener("click", ToggleModalAuth);
  logInForm.addEventListener("submit", logIn);

  modalAuth.addEventListener("click", function (event) {
    if (event.target.classList.contains("modal-active")) {
      ToggleModalAuth();
    }
  })
}

function authorized() {
  console.log("Авторизован");

  function logOut() {
    login = null;
    localStorage.removeItem("login");

    buttonAuth.style.display = "";
    userName.style.display = "";
    buttonOut.style.display = "";
    buttonOut.removeEventListener("click", logOut);

    checkAuth();
  }

  userName.textContent = login;
  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "flex";
  buttonOut.addEventListener("click", logOut);
}

function createCardRestaurant(restaurant) {
  const {
    image,
    kitchen,
    price,
    name,
    stars,
    products,
    time_of_delivery: timeOfDelivery,
  } = restaurant;

  const cardRestaurant = document.createElement("a");
  cardRestaurant.className =
    "card animate__animated wow animate__fadeInLeft animate__delay-1s";
  cardRestaurant.dataset.products = products;
  cardRestaurant.info = { name, price, stars, kitchen };

  const card = `
    <img src="${image}" alt="rest-1" class="card-image">
    <div class="card-text">
        <div class="card-heading">
            <h3 class="card-title">${name}</h3>
            <span class="tag card-tag">${timeOfDelivery} мин</span>
        </div>
        <div class="card-info">
            <div class="rating">
                <img src="img/rating.svg" alt="rating" class="rating-star">${stars}
            </div>
            <div class="price">От ${price} ₽</div>
            <div class="category">${kitchen}</div>
        </div>
    </div>
  `;

  cardRestaurant.insertAdjacentHTML("beforeend", card);
  cardsRestaurants.insertAdjacentElement("beforeend", cardRestaurant);
}

function createCardItem(item) {
  const card = document.createElement("div");
  card.className =
    "card card-rest animate__animated animate__fadeInDown animate__delay-1s";

  const { description, image, name, price } = item;

  card.insertAdjacentHTML(
    "beforeend",
    `
      <img src="${image}" alt="rest-1" class="card-image-rest">
      <div class="card-text">
          <div class="card-heading">
              <h3 class="card-title card-title-reg">${name}</h3>
          </div>
          <div class="card-info">
              <div class="ingredients">${description}</div>
          </div>
          <div class="card-buttons">
              <button class="button button-primary">
                  <span class="button-text button-card-text">В корзину</span>
                  <img src="/img/cart-white.svg" alt="cart-white" class="button-card-icon">
              </button>
              <strong class="card-price-bold">${price} ₽</strong>
          </div>
      </div>
  `
  );

  cardsMenu.insertAdjacentElement("beforeend", card);
}

function openItem(event) {
  const target = event.target;

  if (login) {
    const restaurant = target.closest(".card");
    if (restaurant) {
      cardsMenu.textContent = "";
      restaurantRating.textContent = "";
      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");
      menu.classList.remove("hide");

      const { name, price, stars, kitchen } = restaurant.info;
      restaurantTitle.textContent = name;
      restaurantRating.insertAdjacentHTML(
        "beforeend",
        `<img src="img/rating.svg" alt="rating" class="rating-star">${stars}`
      );
      restaurantPrice.textContent = `От ${price} ₽`;
      restaurantCategory.textContent = kitchen;

      getData(`./db/${restaurant.dataset.products}`).then(function (data) {
        data.forEach(createCardItem);
      });
    }
  } else {
    ToggleModalAuth();
  }
}

function init() {
  getData("./db/partners.json").then(function (data) {
    data.forEach(createCardRestaurant);
  });

  cartButton.addEventListener("click", ToggleModal);

  close.addEventListener("click", ToggleModal);

  cardsRestaurants.addEventListener("click", openItem);

  logo.addEventListener("click", function () {
    containerPromo.classList.remove("hide");
    restaurants.classList.remove("hide");
    menu.classList.add("hide");
  });

  checkAuth();
}

init();

new Swiper('.swiper', {
  sliderPerView: 1,
  loop: true,
  autoplay: true,
})
