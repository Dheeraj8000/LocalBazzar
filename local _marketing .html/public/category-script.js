// category-script.js

// Check if user is logged in
if (!localStorage.getItem("loggedInUser")) {
    alert("Please login to view products.");
    window.location.href = "index.html";
}

// Get category from URL
const params = new URLSearchParams(window.location.search);
const category = params.get("category");

document.title = `${category} - Local Bazaar`;
document.getElementById("category-title").innerText = category;

// Get all products from localStorage
const allUsers = JSON.parse(localStorage.getItem("users")) || [];
let products = [];

allUsers.forEach(user => {
    if (user.products && user.products.length > 0) {
        products = products.concat(user.products);
    }
});

// Filter products by category
const filtered = products.filter(p => p.category === category);

// Display products
const container = document.getElementById("product-list");
if (filtered.length === 0) {
    container.innerHTML = "<p>No products found in this category.</p>";
} else {
    filtered.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p>Price: ₹${product.price}</p>
        `;
        container.appendChild(card);
    });
}