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