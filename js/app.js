cat > js/app.js << 'ENDOFFILE'
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateCartDisplay();
    updateFloatingCart();
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollTopBtn = document.getElementById('scroll-top');
        if (scrollTopBtn) {
            if (scrollTop > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        }
    });
    
    console.log('✅ Costela do Titi - Site inicializado com sucesso!');
});

function initializeEventListeners() {
    // Delivery options
    const localBtn = document.getElementById('local-btn');
    const viagemBtn = document.getElementById('viagem-btn');
    
    if (localBtn && viagemBtn) {
        localBtn.addEventListener('click', () => toggleDeliveryOption(false));
        viagemBtn.addEventListener('click', () => toggleDeliveryOption(true));
    }

    // Quantity buttons
    document.querySelectorAll('.qty-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.product;
            const action = this.dataset.action;
            if (productId && action) {
                updateQuantity(productId, action === 'increase' ? 1 : -1);
            }
        });
    });

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.product;
            if (productId) {
                addToCartDirect(productId);
            }
        });
    });

    document.querySelectorAll('.add-to-cart-direct').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.product;
            if (productId) {
                addToCartDirect(productId);
            }
        });
    });

    // Customize buttons
    document.querySelectorAll('.customize-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.product;
            if (productId) {
                openCustomizeModal(productId);
            }
        });
    });

    // Customize modal
    const cancelCustomize = document.getElementById('cancel-customize');
    const addCustomized = document.getElementById('add-customized');
    
    if (cancelCustomize) cancelCustomize.addEventListener('click', closeCustomizeModal);
    if (addCustomized) addCustomized.addEventListener('click', addCustomizedToCart);
    
    document.querySelectorAll('input[name="additional"]').forEach(input => {
        input.addEventListener('change', updateCustomizeTotal);
    });

    // Checkout
    const finalizarBtn = document.getElementById('finalizar-pedido');
    if (finalizarBtn) finalizarBtn.addEventListener('click', finalizarPedido);
    
    // Customer modal
    const buscarCepBtn = document.getElementById('buscar-cep');
    const cancelarPedidoBtn = document.getElementById('cancelar-pedido');
    const enviarWhatsAppBtn = document.getElementById('enviar-whatsapp');
    
    if (buscarCepBtn) buscarCepBtn.addEventListener('click', buscarCep);
    if (cancelarPedidoBtn) cancelarPedidoBtn.addEventListener('click', closeCustomerModal);
    if (enviarWhatsAppBtn) enviarWhatsAppBtn.addEventListener('click', enviarPedidoWhatsApp);

    // Form formatting
    const customerCep = document.getElementById('customer-cep');
    const customerPhone = document.getElementById('customer-phone');
    
    if (customerCep) customerCep.addEventListener('input', formatarCep);
    if (customerPhone) customerPhone.addEventListener('input', formatarTelefone);

    // Keyboard events
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const customizeModal = document.getElementById('customize-modal');
            const customerModal = document.getElementById('customer-modal');
            
            if (customizeModal && customizeModal.style.display === 'flex') {
                closeCustomizeModal();
            }
            if (customerModal && customerModal.style.display === 'flex') {
                closeCustomerModal();
            }
        }
    });
}

function toggleDeliveryOption(delivery) {
    isDelivery = delivery;
    const localBtn = document.getElementById('local-btn');
    const viagemBtn = document.getElementById('viagem-btn');
    
    if (localBtn && viagemBtn) {
        localBtn.classList.toggle('active', !delivery);
        viagemBtn.classList.toggle('active', delivery);
    }
    updateCartDisplay();
}
ENDOFFILE