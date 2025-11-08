let cart = {};
let isDelivery = false;

const elements = {
    cartItems: document.getElementById('cart-items'),
    cartTotal: document.getElementById('cart-total'),
    deliveryFeeContainer: document.getElementById('delivery-fee-container'),
    floatingCart: document.getElementById('floating-cart'),
    cartBadge: document.getElementById('cart-badge')
};

function updateQuantity(productId, change) {
    const qtyElement = document.getElementById(`qty-${productId}`);
    let quantity = parseInt(qtyElement.textContent);
    quantity += change;
    if (quantity < 0) quantity = 0;
    qtyElement.textContent = quantity;
}

function addToCartDirect(productId) {
    const product = PRODUCTS[productId];
    if (!product) return;

    let quantity = 1;
    const qtyElement = document.getElementById(`qty-${productId}`);
    if (qtyElement) {
        quantity = parseInt(qtyElement.textContent);
        if (quantity <= 0) {
            showMessage('Selecione uma quantidade antes de adicionar.', 'warning');
            return;
        }
        qtyElement.textContent = '0';
    }

    addItemToCart(productId, quantity);
    showMessage(`${product.name} adicionado ao carrinho!`, 'success');
}

function addItemToCart(productId, quantity = 1, additionals = [], notes = '') {
    const product = PRODUCTS[productId];
    if (!product) return;

    const itemId = generateItemId(productId, additionals);
    
    if (cart[itemId]) {
        cart[itemId].quantity += quantity;
    } else {
        let totalPrice = product.price;
        let additionalsInfo = [];
        
        additionals.forEach(additionalId => {
            const additional = ADDITIONALS[additionalId];
            if (additional) {
                totalPrice += additional.price;
                additionalsInfo.push(additional.name);
            }
        });

        cart[itemId] = {
            productId: productId,
            name: product.name,
            basePrice: product.price,
            totalPrice: totalPrice,
            quantity: quantity,
            additionals: additionals,
            additionalsInfo: additionalsInfo,
            notes: notes,
            category: product.category
        };
    }
    
    updateCartDisplay();
    updateFloatingCart();
}

function generateItemId(productId, additionals = []) {
    const additionalsStr = additionals.sort().join(',');
    return `${productId}_${additionalsStr}`;
}

function updateCartDisplay() {
    elements.cartItems.innerHTML = '';
    
    let subtotal = 0;
    const itemCount = Object.keys(cart).length;
    
    if (itemCount === 0) {
        elements.cartItems.innerHTML = '<div class="empty-cart">Seu carrinho está vazio</div>';
        elements.deliveryFeeContainer.style.display = 'none';
        elements.cartTotal.textContent = 'R$ 0,00';
        return;
    }
    
    for (const itemId in cart) {
        const item = cart[itemId];
        const itemTotal = item.totalPrice * item.quantity;
        subtotal += itemTotal;
        
        const cartItemElement = createCartItemElement(itemId, item, itemTotal);
        elements.cartItems.appendChild(cartItemElement);
    }
    
    if (isDelivery && subtotal > 0) {
        elements.deliveryFeeContainer.style.display = 'block';
    } else {
        elements.deliveryFeeContainer.style.display = 'none';
    }
    
    elements.cartTotal.textContent = `R$ ${subtotal.toFixed(2)}`;
}

function createCartItemElement(itemId, item, itemTotal) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    
    let additionalsHtml = '';
    if (item.additionalsInfo && item.additionalsInfo.length > 0) {
        additionalsHtml = `<div class="cart-item-details">+ ${item.additionalsInfo.join(', ')}</div>`;
    }
    
    let notesHtml = '';
    if (item.notes) {
        notesHtml = `<div class="cart-item-details">Obs: ${item.notes}</div>`;
    }
    
    cartItem.innerHTML = `
        <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            ${additionalsHtml}
            ${notesHtml}
            <div class="cart-item-price">R$ ${item.totalPrice.toFixed(2)} cada</div>
        </div>
        <div class="cart-item-quantity">
            <button class="qty-btn" data-item="${itemId}" data-action="decrease">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" data-item="${itemId}" data-action="increase">+</button>
        </div>
        <div class="cart-item-total">R$ ${itemTotal.toFixed(2)}</div>
    `;
    
    cartItem.querySelectorAll('.qty-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.dataset.item;
            const action = this.dataset.action;
            changeCartItemQuantity(itemId, action === 'increase' ? 1 : -1);
        });
    });
    
    return cartItem;
}

function changeCartItemQuantity(itemId, change) {
    if (cart[itemId]) {
        cart[itemId].quantity += change;
        
        if (cart[itemId].quantity <= 0) {
            delete cart[itemId];
        }
        
        updateCartDisplay();
        updateFloatingCart();
    }
}

function updateFloatingCart() {
    const summary = getCartSummary();
    
    if (summary.totalItems === 0) {
        elements.floatingCart.classList.remove('show');
        return;
    }
    
    elements.floatingCart.classList.add('show');
    elements.cartBadge.textContent = summary.totalItems;
    
    elements.cartBadge.style.animation = 'none';
    setTimeout(() => {
        elements.cartBadge.style.animation = 'pulse 0.5s ease-in-out';
    }, 10);
}

function getCartSummary() {
    const summary = {
        itemCount: 0,
        totalItems: 0,
        subtotal: 0,
        total: 0
    };
    
    for (const itemId in cart) {
        const item = cart[itemId];
        summary.itemCount++;
        summary.totalItems += item.quantity;
        summary.subtotal += item.totalPrice * item.quantity;
    }
    
    summary.total = summary.subtotal;
    return summary;
}

function clearCart() {
    cart = {};
    updateCartDisplay();
    updateFloatingCart();
}