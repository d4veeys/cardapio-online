let currentCustomizing = null;

const modalElements = {
    customerModal: document.getElementById('customer-modal'),
    customizeModal: document.getElementById('customize-modal'),
    modalTitle: document.getElementById('modal-title'),
    deliveryFields: document.getElementById('delivery-fields'),
    localInstructions: document.getElementById('local-instructions'),
    addressFields: document.getElementById('address-fields')
};

function openCustomizeModal(productId) {
    const product = PRODUCTS[productId];
    if (!product) return;

    currentCustomizing = productId;
    
    document.getElementById('customize-title').textContent = `Personalizar ${product.name}`;
    
    document.getElementById('base-product-info').innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">${product.name}</div>
        <div style="color: var(--primary); font-weight: 600;">R$ ${product.price.toFixed(2)}</div>
        <div style="font-size: 12px; color: #666; margin-top: 5px;">${product.description}</div>
    `;
    
    document.querySelectorAll('input[name="additional"]').forEach(input => {
        input.checked = false;
    });
    document.getElementById('item-notes').value = '';
    
    updateCustomizeTotal();
    modalElements.customizeModal.style.display = 'flex';
}

function closeCustomizeModal() {
    modalElements.customizeModal.style.display = 'none';
    currentCustomizing = null;
}

function updateCustomizeTotal() {
    if (!currentCustomizing) return;
    
    const product = PRODUCTS[currentCustomizing];
    let total = product.price;
    
    document.querySelectorAll('input[name="additional"]:checked').forEach(input => {
        total += parseFloat(input.dataset.price);
    });
    
    document.getElementById('customize-total-value').textContent = `R$ ${total.toFixed(2)}`;
}

function addCustomizedToCart() {
    if (!currentCustomizing) return;
    
    const additionals = [];
    document.querySelectorAll('input[name="additional"]:checked').forEach(input => {
        additionals.push(input.value);
    });
    
    const notes = document.getElementById('item-notes').value.trim();
    
    addItemToCart(currentCustomizing, 1, additionals, notes);
    closeCustomizeModal();
    showMessage('Lanche personalizado adicionado ao carrinho!', 'success');
}

function openCustomerModal() {
    if (isDelivery) {
        modalElements.modalTitle.textContent = 'Informações para Entrega';
        modalElements.deliveryFields.style.display = 'block';
        modalElements.localInstructions.style.display = 'none';
    } else {
        modalElements.modalTitle.textContent = 'Informações para Consumo no Local';
        modalElements.deliveryFields.style.display = 'none';
        modalElements.localInstructions.style.display = 'block';
    }
    modalElements.customerModal.style.display = 'flex';
}

function closeCustomerModal() {
    modalElements.customerModal.style.display = 'none';
}

function finalizarPedido() {
    if (Object.keys(cart).length === 0) {
        showMessage('Adicione itens ao carrinho antes de finalizar o pedido.', 'warning');
        return;
    }
    openCustomerModal();
}