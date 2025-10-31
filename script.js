// Data produk
const products = [
    {
        id: 1,
        name: "Sepatu Sneakers Modern",
        price: 299000,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        description: "Sepatu sneakers dengan desain modern dan nyaman digunakan."
    },
    {
        id: 2,
        name: "Tas Ransel Trendy",
        price: 189000,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        description: "Tas ransel stylish dengan banyak kompartemen untuk kebutuhan harian."
    },
    {
        id: 3,
        name: "Kemeja Casual Pria",
        price: 159000,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        description: "Kemeja casual pria dengan bahan katun yang nyaman dan berkualitas."
    },
    {
        id: 4,
        name: "Dress Wanita Elegan",
        price: 249000,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        description: "Dress wanita elegan dengan potongan yang menawan untuk berbagai acara."
    },
    {
        id: 5,
        name: "Jam Tangan Minimalis",
        price: 399000,
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        description: "Jam tangan dengan desain minimalis dan elegan untuk penampilan stylish."
    },
    {
        id: 6,
        name: "Headphone Wireless",
        price: 459000,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        description: "Headphone wireless dengan kualitas suara tinggi dan desain ergonomis."
    }
];

// Inisialisasi keranjang
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProduct = null;

// Format harga ke Rupiah
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Render produk
function renderProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-6 col-lg-4';
        productCard.innerHTML = `
            <div class="card product-card h-100">
                <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text flex-grow-1">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <span class="product-price">${formatRupiah(product.price)}</span>
                        <button class="btn btn-outline-primary btn-sm view-detail" data-id="${product.id}">Lihat Detail</button>
                    </div>
                </div>
            </div>
        `;
        productList.appendChild(productCard);
    });
    
    // Tambahkan event listener untuk tombol lihat detail
    document.querySelectorAll('.view-detail').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            showProductDetail(productId);
        });
    });
}

// Tampilkan detail produk di modal
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductPrice').textContent = formatRupiah(product.price);
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('quantity').value = 1;
    
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

// Update tampilan keranjang
function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update jumlah item di badge
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update daftar item di sidebar
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center">Keranjang belanja kosong</p>';
        cartTotal.textContent = formatRupiah(0);
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;
        
        const itemTotal = product.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <h6>${product.name}</h6>
                    <p class="mb-1">${formatRupiah(product.price)}</p>
                    <div class="quantity-control">
                        <button class="quantity-btn decrease-cart" data-id="${product.id}">-</button>
                        <input type="number" class="quantity-input cart-quantity" data-id="${product.id}" value="${item.quantity}" min="1">
                        <button class="quantity-btn increase-cart" data-id="${product.id}">+</button>
                    </div>
                </div>
                <div class="text-end">
                    <p class="fw-bold">${formatRupiah(itemTotal)}</p>
                    <button class="btn btn-sm btn-outline-danger remove-cart" data-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Update total
    cartTotal.textContent = formatRupiah(total);
    
    // Tambahkan event listener untuk tombol di keranjang
    document.querySelectorAll('.decrease-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.increase-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.remove-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
    
    document.querySelectorAll('.cart-quantity').forEach(input => {
        input.addEventListener('change', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const quantity = parseInt(this.value);
            if (quantity > 0) {
                setCartItemQuantity(productId, quantity);
            } else {
                removeFromCart(productId);
            }
        });
    });
    
    // Simpan ke localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Tambah item ke keranjang
function addToCart(productId, quantity = 1) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            quantity: quantity
        });
    }
    
    updateCartDisplay();
    
    // Tutup modal jika terbuka
    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    if (modal) modal.hide();
    
    // Tampilkan notifikasi
    showNotification('Produk berhasil ditambahkan ke keranjang!');
}

// Update jumlah item di keranjang
function updateCartItemQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartDisplay();
    }
}

// Set jumlah item di keranjang
function setCartItemQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity = quantity;
    updateCartDisplay();
}

// Hapus item dari keranjang
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

// Toggle sidebar keranjang
function toggleCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Tampilkan notifikasi
function showNotification(message) {
    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '1060';
    notification.textContent = message;
    
    // Tambahkan ke body
    document.body.appendChild(notification);
    
    // Hapus setelah 3 detik
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', function() {
    // Render produk
    renderProducts();
    
    // Update tampilan keranjang
    updateCartDisplay();
    
    // Event listener untuk tombol keranjang
    document.getElementById('cartButton').addEventListener('click', toggleCartSidebar);
    document.getElementById('closeCart').addEventListener('click', toggleCartSidebar);
    document.getElementById('cartOverlay').addEventListener('click', toggleCartSidebar);
    
    // Event listener untuk tombol tambah ke keranjang di modal
    document.getElementById('addToCartModal').addEventListener('click', function() {
        if (!currentProduct) return;
        
        const quantity = parseInt(document.getElementById('quantity').value);
        addToCart(currentProduct.id, quantity);
    });
    
    // Event listener untuk tombol quantity di modal
    document.getElementById('increaseQuantity').addEventListener('click', function() {
        const quantityInput = document.getElementById('quantity');
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });
    
    document.getElementById('decreaseQuantity').addEventListener('click', function() {
        const quantityInput = document.getElementById('quantity');
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    // Event listener untuk tombol checkout
    document.getElementById('checkoutButton').addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Keranjang belanja kosong!');
            return;
        }
        
        showNotification('Terima kasih! Pesanan Anda sedang diproses.');
        cart = [];
        updateCartDisplay();
        toggleCartSidebar();
    });
    
    // Event listener untuk form kontak
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Pesan Anda telah terkirim! Kami akan menghubungi Anda segera.');
        this.reset();
    });
    
    // Smooth scroll untuk navigasi
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});