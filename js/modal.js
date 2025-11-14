cat > js/modal.js << 'ENDOFFILE'
let currentCustomizing = null;

function openCustomizeModal(productId) {
    const product = PRODUCTS[productId];
    if (!product) return;

    currentCustomizing = productId;
    
    if (document.getElementById('customize-title')) {
        document.getElementById('customize-title').textContent = `Personalizar ${product.name}`;
    }
    
    if (document.getElementById('base-product-info')) {
        document.getElementById('base-product-info').innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">${product.name}</div>
            <div style="color: var(--primary); font-weight: 600;">R$ ${product.price.toFixed(2)}</div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">${product.description}</div>
        `;
    }
    
    document.querySelectorAll('input[name="additional"]').forEach(input => {
        input.checked = false;
    });
    
    if (document.getElementById('item-notes')) {
        document.getElementById('item-notes').value = '';
    }
    
    updateCustomizeTotal();
    
    const customizeModal = document.getElementById('customize-modal');
    if (customizeModal) customizeModal.style.display = 'flex';
}

function closeCustomizeModal() {
    const customizeModal = document.getElementById('customize-modal');
    if (customizeModal) customizeModal.style.display = 'none';
    currentCustomizing = null;
}

function updateCustomizeTotal() {
    if (!currentCustomizing) return;
    
    const product = PRODUCTS[currentCustomizing];
    let total = product.price;
    
    document.querySelectorAll('input[name="additional"]:checked').forEach(input => {
        total += parseFloat(input.dataset.price);
    });
    
    if (document.getElementById('customize-total-value')) {
        document.getElementById('customize-total-value').textContent = `R$ ${total.toFixed(2)}`;
    }
}

function addCustomizedToCart() {
    if (!currentCustomizing) return;
    
    const additionals = [];
    document.querySelectorAll('input[name="additional"]:checked').forEach(input => {
        additionals.push(input.value);
    });
    
    const notes = document.getElementById('item-notes')?.value.trim() || '';
    
    addItemToCart(currentCustomizing, 1, additionals, notes);
    closeCustomizeModal();
    showMessage('Lanche personalizado adicionado ao carrinho!', 'success');
}

function openCustomerModal() {
    const modalTitle = document.getElementById('modal-title');
    const deliveryFields = document.getElementById('delivery-fields');
    const localInstructions = document.getElementById('local-instructions');
    
    if (!modalTitle || !deliveryFields || !localInstructions) return;
    
    if (isDelivery) {
        modalTitle.textContent = 'Informações para Entrega';
        deliveryFields.style.display = 'block';
        localInstructions.style.display = 'none';
    } else {
        modalTitle.textContent = 'Informações para Consumo no Local';
        deliveryFields.style.display = 'none';
        localInstructions.style.display = 'block';
    }
    
    const customerModal = document.getElementById('customer-modal');
    if (customerModal) customerModal.style.display = 'flex';
}

function closeCustomerModal() {
    const customerModal = document.getElementById('customer-modal');
    if (customerModal) customerModal.style.display = 'none';
}

function finalizarPedido() {
    if (Object.keys(cart).length === 0) {
        showMessage('Adicione itens ao carrinho antes de finalizar o pedido.', 'warning');
        return;
    }
    openCustomerModal();
}
ENDOFFILE