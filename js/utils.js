cat > js/utils.js << 'ENDOFFILE'
function showMessage(message, type = 'info') {
    const existingMessage = document.querySelector('.message-toast');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageEl = document.createElement('div');
    messageEl.className = `message-toast message-${type}`;
    messageEl.textContent = message;
    
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 500;
        max-width: 90%;
        text-align: center;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => messageEl.remove(), 300);
        }
    }, 3000);
}

function formatarCep(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    e.target.value = value;
}

function formatarTelefone(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        value = '(' + value;
        if (value.length > 3) {
            value = value.substring(0, 3) + ') ' + value.substring(3);
        }
        if (value.length > 10) {
            value = value.substring(0, 10) + '-' + value.substring(10, 14);
        }
    }
    e.target.value = value;
}

function buscarCep() {
    const cep = document.getElementById('customer-cep')?.value.replace(/\D/g, '');
    if (!cep) return;
    
    if (cep.length !== 8) {
        showMessage('CEP inválido. Digite um CEP com 8 dígitos.', 'warning');
        return;
    }
    
    const cepButton = document.getElementById('buscar-cep');
    if (!cepButton) return;
    
    cepButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    cepButton.disabled = true;
    
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                showMessage('CEP não encontrado. Preencha o endereço manualmente.', 'warning');
                if (document.getElementById('address-fields')) document.getElementById('address-fields').style.display = 'block';
            } else {
                if (document.getElementById('customer-address')) document.getElementById('customer-address').value = data.logradouro || '';
                if (document.getElementById('customer-neighborhood')) document.getElementById('customer-neighborhood').value = data.bairro || '';
                if (document.getElementById('customer-city')) document.getElementById('customer-city').value = data.localidade || '';
                if (document.getElementById('customer-state')) document.getElementById('customer-state').value = data.uf || '';
                if (document.getElementById('address-fields')) document.getElementById('address-fields').style.display = 'block';
                if (document.getElementById('customer-number')) document.getElementById('customer-number').focus();
                showMessage('Endereço preenchido automaticamente!', 'success');
            }
        })
        .catch(error => {
            showMessage('Erro ao buscar CEP. Preencha o endereço manualmente.', 'error');
            if (document.getElementById('address-fields')) document.getElementById('address-fields').style.display = 'block';
        })
        .finally(() => {
            cepButton.innerHTML = '<i class="fas fa-search"></i>';
            cepButton.disabled = false;
        });
}

function validateForm() {
    const name = document.getElementById('customer-name')?.value.trim();
    const phone = document.getElementById('customer-phone')?.value.trim();
    
    if (!name || !phone) {
        showMessage('Por favor, preencha pelo menos seu nome e telefone.', 'warning');
        return false;
    }
    
    if (isDelivery) {
        const address = document.getElementById('customer-address')?.value.trim();
        const number = document.getElementById('customer-number')?.value.trim();
        const neighborhood = document.getElementById('customer-neighborhood')?.value.trim();
        const city = document.getElementById('customer-city')?.value.trim();
        const state = document.getElementById('customer-state')?.value.trim();
        
        if (!address || !number || !neighborhood || !city || !state) {
            showMessage('Para delivery, é necessário informar o endereço completo.', 'warning');
            return false;
        }
    }
    return true;
}

function buildWhatsAppMessage(name, phone, notes) {
    const orderType = isDelivery ? 'Delivery' : 'Retirada';
    let message = `*NOVO PEDIDO - Costela do Titi*%0A%0A`;
    message += `*Cliente:* ${name}%0A`;
    message += `*Telefone:* ${phone}%0A`;
    message += `*Tipo:* ${orderType}%0A%0A`;
    
    if (isDelivery) {
        const address = document.getElementById('customer-address')?.value.trim() || '';
        const number = document.getElementById('customer-number')?.value.trim() || '';
        const complement = document.getElementById('customer-complement')?.value.trim() || '';
        const neighborhood = document.getElementById('customer-neighborhood')?.value.trim() || '';
        const city = document.getElementById('customer-city')?.value.trim() || '';
        const state = document.getElementById('customer-state')?.value.trim() || '';
        
        message += `*Endereço:* ${address}, ${number}`;
        if (complement) message += `, ${complement}`;
        message += ` - ${neighborhood}, ${city}-${state}%0A%0A`;
    }
    
    message += `*ITENS DO PEDIDO:*%0A%0A`;
    
    const categories = {
        'lanche': '🍔 *LANCHES*',
        'bebida': '🥤 *BEBIDAS*',
        'porcao': '🍟 *PORÇÕES*'
    };
    
    let subtotal = 0;
    const itemsByCategory = {};
    
    for (const itemId in cart) {
        const item = cart[itemId];
        const category = item.category || 'outros';
        if (!itemsByCategory[category]) itemsByCategory[category] = [];
        itemsByCategory[category].push({ itemId, ...item });
    }
    
    Object.keys(itemsByCategory).forEach(category => {
        if (categories[category]) message += `${categories[category]}%0A`;
        
        itemsByCategory[category].forEach(item => {
            const itemTotal = item.totalPrice * item.quantity;
            subtotal += itemTotal;
            
            message += `• ${item.quantity}x ${item.name}`;
            if (item.additionalsInfo && item.additionalsInfo.length > 0) {
                message += ` (+ ${item.additionalsInfo.join(', ')})`;
            }
            message += ` - R$ ${itemTotal.toFixed(2)}`;
            if (item.notes) message += `%0A  _Obs: ${item.notes}_`;
            message += `%0A`;
        });
        message += `%0A`;
    });
    
    if (isDelivery) {
        message += `🚚 *Taxa de entrega: ${CONFIG.deliveryText}*%0A%0A`;
    }
    
    message += `💰 *SUBTOTAL: R$ ${subtotal.toFixed(2)}*%0A`;
    if (isDelivery) {
        message += `💰 *TOTAL: A calcular com a taxa de entrega*%0A%0A`;
    } else {
        message += `%0A`;
    }
    
    if (notes) message += `📝 *Observações:* ${notes}%0A%0A`;
    
    if (isDelivery) {
        message += `🚚 *Delivery* - Tempo estimado: 30-45 minutos%0A`;
        message += `Entraremos em contato para confirmar o pedido e informar o valor da entrega!%0A%0A`;
    } else {
        message += `🏪 *Retirada no Local* - Tempo estimado: ${CONFIG.prepareTime} minutos%0A`;
        message += `Avisaremos quando estiver pronto para retirada!%0A%0A`;
    }
    
    message += `_Pedido realizado via site_`;
    return message;
}

function enviarPedidoWhatsApp() {
    const name = document.getElementById('customer-name')?.value.trim();
    const phone = document.getElementById('customer-phone')?.value.trim();
    const notes = document.getElementById('customer-notes')?.value.trim();
    
    if (!name || !phone) {
        showMessage('Por favor, preencha pelo menos seu nome e telefone.', 'warning');
        return;
    }
    
    if (!validateForm()) return;
    
    const message = buildWhatsAppMessage(name, phone, notes);
    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${message}`, '_blank');
    
    clearFormAndCart();
    closeCustomerModal();
    showMessage('Pedido enviado com sucesso!', 'success');
}

function clearFormAndCart() {
    if (document.getElementById('customer-name')) document.getElementById('customer-name').value = '';
    if (document.getElementById('customer-phone')) document.getElementById('customer-phone').value = '';
    if (document.getElementById('customer-cep')) document.getElementById('customer-cep').value = '';
    if (document.getElementById('customer-address')) document.getElementById('customer-address').value = '';
    if (document.getElementById('customer-number')) document.getElementById('customer-number').value = '';
    if (document.getElementById('customer-complement')) document.getElementById('customer-complement').value = '';
    if (document.getElementById('customer-neighborhood')) document.getElementById('customer-neighborhood').value = '';
    if (document.getElementById('customer-city')) document.getElementById('customer-city').value = '';
    if (document.getElementById('customer-state')) document.getElementById('customer-state').value = '';
    if (document.getElementById('customer-notes')) document.getElementById('customer-notes').value = '';
    
    document.querySelectorAll('.qty-value').forEach(el => el.textContent = '0');
    if (document.getElementById('address-fields')) document.getElementById('address-fields').style.display = 'none';
    clearCart();
}
ENDOFFILE