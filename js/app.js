const elements = {
    scrollTop: document.getElementById('scroll-top')
};

document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateCartDisplay();
    updateFloatingCart();
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 300) {
            elements.scrollTop.classList.add('show');
        } else {
            elements.scrollTop.classList.remove('show');
        }
    });
});

function initializeEventListeners() {
    // Delivery options
    document.getElementById('local-btn').addEventListener('click', () => toggleDeliveryOption(false));
    document.getElementById('viagem-btn').addEventListener('click', () => toggleDeliveryOption(true));

    // Quantity buttons
    document.querySelectorAll('.qty-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.product;
            const action = this.dataset.action;
            updateQuantity(productId, action === 'increase' ? 1 : -1);
        });
    });

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.product;
            addToCartDirect(productId);
        });
    });

    document.querySelectorAll('.add-to-cart-direct').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.product;
            addToCartDirect(productId);
        });
    });

    // Customize buttons
    document.querySelectorAll('.customize-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.product;
            openCustomizeModal(productId);
        });
    });

    // Customize modal
    document.getElementById('cancel-customize').addEventListener('click', closeCustomizeModal);
    document.getElementById('add-customized').addEventListener('click', addCustomizedToCart);
    
    document.querySelectorAll('input[name="additional"]').forEach(input => {
        input.addEventListener('change', updateCustomizeTotal);
    });

    // Checkout
    document.getElementById('finalizar-pedido').addEventListener('click', finalizarPedido);
    
    // Customer modal
    document.getElementById('buscar-cep').addEventListener('click', buscarCep);
    document.getElementById('cancelar-pedido').addEventListener('click', closeCustomerModal);
    document.getElementById('enviar-whatsapp').addEventListener('click', enviarPedidoWhatsApp);

    // Form formatting
    document.getElementById('customer-cep').addEventListener('input', formatarCep);
    document.getElementById('customer-phone').addEventListener('input', formatarTelefone);

    // Keyboard events
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (modalElements.customizeModal.style.display === 'flex') {
                closeCustomizeModal();
            }
            if (modalElements.customerModal.style.display === 'flex') {
                closeCustomerModal();
            }
        }
    });
}

function toggleDeliveryOption(delivery) {
    isDelivery = delivery;
    document.getElementById('local-btn').classList.toggle('active', !delivery);
    document.getElementById('viagem-btn').classList.toggle('active', delivery);
    updateCartDisplay();
}