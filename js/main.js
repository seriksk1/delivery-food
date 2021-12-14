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
const inputSearch = document.querySelector(".input-search");
const modalBody = document.querySelector(".modal-body");
const modalPrice = document.querySelector(".modal-pricetag");
const clearCart = document.querySelector(".clear-cart")

let login = localStorage.getItem("login");
let cart = JSON.parse(localStorage.getItem(`cart_${login}`)) || [];

function saveCart() {
  localStorage.setItem(`cart_${login}`, JSON.stringify(cart));
}

function loadCart() {
  if (localStorage.getItem(`cart_${login}`)) {
    const data = JSON.parse(localStorage.getItem(`cart_${login}`));

    cart.push(...data);
  }
}

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

    loadCart();

    buttonAuth.removeEventListener("click", ToggleModalAuth);
    closeAuth.removeEventListener("click", ToggleModalAuth);
    logInForm.removeEventListener("submit", logIn);
    logInForm.reset();

    checkAuth();
  }

  buttonAuth.addEventListener("click", ToggleModalAuth);
  closeAuth.addEventListener("click", ToggleModalAuth);
  logInForm.addEventListener("submit", logIn);
  cartButton.style.display = "none";

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
    cart = [];
    localStorage.removeItem("login");

    buttonAuth.style.display = "";
    cartButton.style.display = "none";
    userName.style.display = "";
    buttonOut.style.display = "";
    buttonOut.removeEventListener("click", logOut);

    checkAuth();
  }

  userName.textContent = login;
  buttonAuth.style.display = "none";
  cartButton.style.display = "flex";
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

  const { id, description, image, name, price } = item;

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
              <button class="button button-primary button-add-cart" id="${id}">
                  <span class="button-text button-card-text">В корзину</span>
                  <img src="/img/cart-white.svg" alt="cart-white" class="button-card-icon">
              </button>
              <strong class="card-price card-price-bold">${price} ₽</strong>
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

function addToCart(e) {
  const target = e.target;
  const buttonAddToCart = target.closest(".button-add-cart");

  if (buttonAddToCart) {
    const card = target.closest(".card");
    const title = card.querySelector(".card-title-reg").textContent;
    const cost = card.querySelector(".card-price").textContent;
    const id = buttonAddToCart.id;
    const item = cart.find((item) => item.id === id);

    if (item) {
      ++item.count;
    } else {
      cart.push({ id, title, cost, count: 1 });
    }
  }

  saveCart();
}

function renderCart() {
  modalBody.textContent = '';

  cart.forEach(({ id, title, cost, count }) => {
    const itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost}</strong>
        <div class="food-counter">
            <button class="counter-button counter-minus" data-id="${id}">-</button>
            <span class="counter">${count}</span>
            <button class="counter-button counter-plus" data-id="${id}">+</button>
        </div>
      </div>
    `;

    modalBody.insertAdjacentHTML("afterbegin", itemCart);
  });

  const totalPrice = cart.reduce((acc, item) => acc + parseInt(item.cost) * item.count, 0);
  modalPrice.textContent = totalPrice + " ₽";

  saveCart();
}

function changeCount(e) {
  const target = e.target;

  if (target.classList.contains("counter-button")) {
    const item = cart.find((item) => item.id === target.dataset.id);

    if (target.classList.contains("counter-minus")) {
      item.count--;

      if (item.count === 0) {
        cart.splice(cart.indexOf(item), 1);
      }
    }

    if (target.classList.contains("counter-plus")) {
      item.count++;
    }

    renderCart();
  }
}

function init() {
  getData("./db/partners.json").then(function (data) {
    data.forEach(createCardRestaurant);
  });

  cartButton.addEventListener("click", () => {
    renderCart();
    ToggleModal();
  });

  clearCart.addEventListener("click", () => {
    cart = [];

    renderCart();
    ToggleModal();
  })

  modalBody.addEventListener("click", changeCount);

  cardsMenu.addEventListener("click", addToCart);
  close.addEventListener("click", ToggleModal);
  cardsRestaurants.addEventListener("click", openItem);

  logo.addEventListener("click", function () {
    containerPromo.classList.remove("hide");
    restaurants.classList.remove("hide");
    menu.classList.add("hide");
  });

  checkAuth();

  inputSearch.addEventListener("keypress", (e) => {
    if (e.charCode === 13) {
      const value = e.target.value.trim();

      if (!value) {
        e.target.value = '';
        return;
      }

      getData("./db/partners.json")
        .then((data) => {
          const linksProduct = data.map((partner) => partner.products);
          return linksProduct;
        })
        .then((linksProduct) => {
          cardsMenu.textContent = "";
          linksProduct.forEach((link) => {
            getData(`./db/${link}`)
              .then((data) => {
                const resultSearch = data.filter((item) => {
                  const name = item.name.toLowerCase();
                  return name.includes(value.toLowerCase());
                })

                restaurantRating.textContent = "";
                containerPromo.classList.add("hide");
                restaurants.classList.add("hide");
                menu.classList.remove("hide");

                restaurantTitle.textContent = 'Результат поиска';
                restaurantRating.textContent = '';
                restaurantPrice.textContent = 'Разная кухня';
                restaurantCategory.textContent = '';
                resultSearch.forEach(createCardItem);
              })
          })
        })
    }
  })
}

init();

new Swiper('.swiper', {
  sliderPerView: 1,
  loop: true,
  autoplay: true,
})