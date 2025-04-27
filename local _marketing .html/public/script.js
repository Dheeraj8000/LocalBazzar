// LOGIN SYSTEM
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    showMainContent();
  } else {
    alert('Invalid Username or Password!');
  }
});

function showMainContent() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('main-content').style.display = 'block';

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  document.getElementById('welcome-msg').textContent = `Welcome, ${currentUser.username}!`;

  if (currentUser.role === 'shopkeeper') {
    document.getElementById('product-form').style.display = 'block';
    document.getElementById('pshop').value = currentUser.shopName || '';
    document.getElementById('plocation').value = currentUser.location || '';
  }

  document.getElementById('logout-btn').style.display = 'block';
  loadProducts();
}

// LOGOUT
document.getElementById('logout-btn').addEventListener('click', function() {
  localStorage.removeItem('currentUser');
  location.reload();
});

// ADD / UPDATE PRODUCT
let editingProductId = null;
document.getElementById('product-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const pname = document.getElementById('pname').value.trim();
  const pprice = document.getElementById('pprice').value.trim();
  const pshop = document.getElementById('pshop').value.trim();
  const plocation = document.getElementById('plocation').value.trim();
  const pcategory = document.getElementById('pcategory').value.trim();
  const pimage = document.getElementById('pimage').files[0];

  if (!pname || !pprice || !pshop || !plocation || !pcategory || !pimage) {
    alert('Please fill all fields correctly.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const imageUrl = e.target.result;
    let products = JSON.parse(localStorage.getItem('products')) || [];

    if (editingProductId) {
      products = products.map(product => 
        product.id === editingProductId
          ? { ...product, name: pname, price: pprice, shop: pshop, location: plocation, category: pcategory, image: imageUrl }
          : product
      );
      editingProductId = null;
    } else {
      products.push({
        id: Date.now(),
        name: pname,
        price: pprice,
        shop: pshop,
        location: plocation,
        category: pcategory,
        image: imageUrl
      });
    }

    localStorage.setItem('products', JSON.stringify(products));
    loadProducts();
    document.getElementById('product-form').reset();

    // Autofill shop & location again after reset (but allow edit)
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('pshop').value = currentUser.shopName || '';
    document.getElementById('plocation').value = currentUser.location || '';
  };
  reader.readAsDataURL(pimage);
});

// LOAD PRODUCTS
function loadProducts() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const list = document.getElementById('product-list');
  list.innerHTML = '';

  products.forEach(product => {
    if (currentUser.role === 'shopkeeper' && product.shop === currentUser.shopName) {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h4>${product.name}</h4>
        <p>Price: ₹${product.price}</p>
        <p>Shop: ${product.shop}</p>
        <p>Location: ${product.location}</p>
        <p>Category: ${product.category}</p>
        <button onclick="editProduct(${product.id})">Edit</button>
        <button onclick="deleteProduct(${product.id})">Delete</button>
      `;
      list.appendChild(card);
    } else if (currentUser.role !== 'shopkeeper') {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h4>${product.name}</h4>
        <p>Price: ₹${product.price}</p>
        <p>Shop: ${product.shop}</p>
        <p>Location: ${product.location}</p>
        <p>Category: ${product.category}</p>
      `;
      list.appendChild(card);
    }
  });
}

// DELETE PRODUCT
function deleteProduct(id) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  let products = JSON.parse(localStorage.getItem('products')) || [];
  const product = products.find(p => p.id === id);

  if (product && product.shop === currentUser.shopName) {
    products = products.filter(product => product.id !== id);
    localStorage.setItem('products', JSON.stringify(products));
    loadProducts();
  } else {
    alert("You can only delete your own products.");
  }
}

// EDIT PRODUCT
function editProduct(id) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const product = products.find(p => p.id === id);

  if (product && product.shop === currentUser.shopName) {
    editingProductId = id;
    document.getElementById('pname').value = product.name;
    document.getElementById('pprice').value = product.price;
    document.getElementById('pshop').value = product.shop;
    document.getElementById('plocation').value = product.location;
    document.getElementById('pcategory').value = product.category;
  } else {
    alert("You can only edit your own products.");
  }
}

// SEARCH PRODUCTS
function searchProducts() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const results = products.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.category.toLowerCase().includes(query) || 
    p.shop.toLowerCase().includes(query)
  );

  const searchList = document.getElementById('search-results');
  searchList.innerHTML = '';

  results.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h4>${product.name}</h4>
      <p>Price: ₹${product.price}</p>
      <p>Shop: ${product.shop}</p>
      <p>Location: ${product.location}</p>
      <p>Category: ${product.category}</p>
    `;
    searchList.appendChild(card);
  });
}
// EDIT PRODUCT
function editProduct(id) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const product = products.find(p => p.id === id);

  // Allow editing only if the product belongs to the logged-in shopkeeper
  if (product && product.shop === currentUser.shopName) {
    editingProductId = id;
    document.getElementById('pname').value = product.name;
    document.getElementById('pprice').value = product.price;
    document.getElementById('pcategory').value = product.category;
    document.getElementById('pshop').value = product.shop;
    document.getElementById('plocation').value = product.location;
  } else {
    alert("You can only edit your own products.");
  }
}