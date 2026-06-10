"use strict";


const BOTANICAL_LOTS = [
    { id: 1, name: "Monstera Alba Deliciosa", price: 120000, rare: "variegated", light: "bright", image: "img/alba.webp" },
    { id: 2, name: "Philodendron Pink Princess", price: 65000, rare: "variegated", light: "shade", image: "img/princess.webp" },
    { id: 3, name: "Alocasia Frydek Variegata", price: 190000, rare: "grail", light: "bright", image: "img/frydek.webp" },
    { id: 4, name: "Scindapsus Jade Satin Var.", price: 48000, rare: "variegated", light: "shade", image: "img/jade.webp" },
    { id: 5, name: "Anthurium Luxurians", price: 280000, rare: "grail", light: "shade", image: "img/luxurians.webp" },
    { id: 6, name: "Aglaonema Tricolor Especia", price: 82000, rare: "variegated", light: "shade", image: "img/tricolor.webp" },
    { id: 7, name: "Caladium Thai Beauty", price: 35000, rare: "variegated", light: "bright", image: "img/caladium.webp" },
    { id: 8, name: "Philodendron Caramel Marble", price: 450000, rare: "grail", light: "bright", image: "img/caramel.webp" }
];


let cartState = JSON.parse(localStorage.getItem("phytos_cart")) || [];


const catalogGrid = document.getElementById("catalogGrid");
const cartCount = document.getElementById("cartCount");
const cartModal = document.getElementById("cartModal");
const cartBtn = document.getElementById("cartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const modalCartList = document.getElementById("modalCartList");
const modalTotalSum = document.getElementById("modalTotalSum");


const searchPlant = document.getElementById("searchPlant");
const filterRare = document.getElementById("filterRare");
const filterLight = document.getElementById("filterLight");
const orderForm = document.getElementById("orderForm");

document.addEventListener("DOMContentLoaded", () => {
    renderGrid(BOTANICAL_LOTS);
    updateCartDOM();
    bindFilterEvents();
    bindModalEvents();
    bindFormValidation();
});


function renderGrid(items) {
    catalogGrid.innerHTML = "";
    
    if (items.length === 0) {
        catalogGrid.innerHTML = `<div style="grid-column: 1/-1; padding: 80px 0; text-align: center; font-family: var(--font-accent); color: var(--text-muted);">[ РЕЗУЛЬТАТОВ НЕ НАЙДЕНО ]</div>`;
        return;
    }

    items.forEach(lot => {
        const itemLayout = document.createElement("article");
        itemLayout.className = "card";
        itemLayout.innerHTML = `
            <div class="card__visual">
                <img src="${lot.image}" alt="${lot.name}" class="card__img" loading="lazy">
                <span class="card__tag">${lot.rare === 'grail' ? 'HOLY GRAIL' : 'MUTATION'}</span>
            </div>
            <h3 class="card__title">${lot.name}</h3>
            <div class="card__footer">
                <span class="card__price">${lot.price.toLocaleString()} ₸</span>
                <button class="card__btn" data-id="${lot.id}">Приобрести</button>
            </div>
        `;
        catalogGrid.appendChild(itemLayout);
    });

    
    catalogGrid.querySelectorAll(".card__btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const lotId = parseInt(e.currentTarget.dataset.id);
            addLotToCart(lotId);
        });
    });
}


function bindFilterEvents() {
    const runFilterEngine = () => {
        const query = searchPlant.value.toLowerCase().trim();
        const rarity = filterRare.value;
        const illumination = filterLight.value;

        const results = BOTANICAL_LOTS.filter(lot => {
            const matchSearch = lot.name.toLowerCase().includes(query) || lot.code.toLowerCase().includes(query);
            const matchRarity = rarity === "all" || lot.rare === rarity;
            const matchIllumination = illumination === "all" || lot.light === illumination;
            return matchSearch && matchRarity && matchIllumination;
        });

        renderGrid(results);
    };

    searchPlant.addEventListener("input", runFilterEngine);
    filterRare.addEventListener("change", runFilterEngine);
    filterLight.addEventListener("change", runFilterEngine);
}


function addLotToCart(id) {
    const targetedLot = BOTANICAL_LOTS.find(lot => lot.id === id);
    if (targetedLot) {
        cartState.push(targetedLot);
        localStorage.setItem("phytos_cart", JSON.stringify(cartState));
        updateCartDOM();
    }
}


function updateCartDOM() {
    cartCount.textContent = cartState.length;
    modalCartList.innerHTML = "";
    
    let totalAccumulator = 0;
    cartState.forEach(item => {
        totalAccumulator += item.price;
        const li = document.createElement("li");
        li.className = "drawer__item";
        li.innerHTML = `
            <span>${item.name}</span>
            <span style="font-family: var(--font-accent); font-weight: bold; color: var(--accent-neon);">${item.price.toLocaleString()} ₸</span>
        `;
        modalCartList.appendChild(li);
    });
    
    modalTotalSum.textContent = totalAccumulator.toLocaleString();
}


function bindModalEvents() {
    cartBtn.addEventListener("click", () => cartModal.showModal());
    closeCartBtn.addEventListener("click", () => cartModal.close());
    cartModal.addEventListener("click", (e) => {
        if (e.target === cartModal) cartModal.close();
    });
}


function bindFormValidation() {
    orderForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const nameField = document.getElementById("userName");
        const phoneField = document.getElementById("userPhone");
        const nameError = document.getElementById("nameError");
        const phoneError = document.getElementById("phoneError");
        
        let stateValid = true;

        nameField.classList.remove("checkout-form__input--error");
        phoneField.classList.remove("checkout-form__input--error");
        nameError.textContent = "";
        phoneError.textContent = "";

        
        const namePattern = /^[A-Za-zА-Яа-яЁё\s]{2,}$/;
        if (!namePattern.test(nameField.value.trim())) {
            nameField.classList.add("checkout-form__input--error");
            nameError.textContent = "[ Ошибка: Имя должно состоять из букв ]";
            stateValid = false;
        }

        
        const phonePattern = /^(?:\+7|8)?[\s\-]?\(?7\d{2}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
        if (!phonePattern.test(phoneField.value.trim())) {
            phoneField.classList.add("checkout-form__input--error");
            phoneError.textContent = "[ Ошибка: Формат телефона +7 (7xx) xxx-xx-xx ]";
            stateValid = false;
        }

        if (stateValid) {
            if (cartState.length === 0) {
                nameError.textContent = "[ Ошибка: Вы не выбрали ни одного растения ]";
                return;
            }
            
            
            const submitBtn = orderForm.querySelector(".checkout-form__submit");
            submitBtn.textContent = "Заявка принята";
            submitBtn.style.background = "#ffffff";
            submitBtn.style.color = "#000000";
            submitBtn.style.boxShadow = "0 0 30px #ffffff";
            submitBtn.disabled = true;

            setTimeout(() => {
                cartState = [];
                localStorage.removeItem("phytos_cart");
                updateCartDOM();
                orderForm.reset();
                submitBtn.textContent = "Оформить предзаказ";
                submitBtn.style.background = "var(--accent-neon)";
                submitBtn.style.color = "var(--bg-dark)";
                submitBtn.style.boxShadow = "0 0 15px var(--accent-glow)";
                submitBtn.disabled = false;
                cartModal.close();
            }, 2500);
        }
    });
}