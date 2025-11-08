const PRODUCTS = {
    'casa': { 
        name: 'Pão da Casa', 
        price: 20.00, 
        category: 'lanche', 
        description: 'Pão, carne 100g, queijo, alface e banana frita, cebola roxa. Uma combinação clássica e saborosa.' 
    },
    'titi': { 
        name: 'Pão do Titi', 
        price: 27.00, 
        category: 'lanche', 
        description: 'Pão, carne 150g, queijo, bacon, alface, cebola roxa e banana frita. Nosso carro-chefe!' 
    },
    'cupim': { 
        name: 'Cupim Grelhado', 
        price: 30.00, 
        category: 'lanche', 
        description: 'Pão baguete, cupim grelhado 120g, queijo, bacon, alface, cebola roxa e banana frita' 
    },
    'agua_mineral': { 
        name: 'Água Mineral', 
        price: 3.00, 
        category: 'bebida' 
    },
    'agua_gas': { 
        name: 'Água Mineral c/ Gás', 
        price: 4.00, 
        category: 'bebida' 
    },
    'refri_lata': { 
        name: 'Refrigerante Lata', 
        price: 6.00, 
        category: 'bebida' 
    },
    'refri_600ml': { 
        name: 'Refrigerante 600ml', 
        price: 9.00, 
        category: 'bebida' 
    },
    'refri_1l': { 
        name: 'Refrigerante 1L', 
        price: 11.00, 
        category: 'bebida' 
    },
    'refri_1_5l': { 
        name: 'Refrigerante 1,5L', 
        price: 16.00, 
        category: 'bebida' 
    },
    'batata_150': { 
        name: 'Batata Frita 150g', 
        price: 10.00, 
        category: 'porcao' 
    },
    'batata_300': { 
        name: 'Batata Frita 250g', 
        price: 15.00, 
        category: 'porcao' 
    }
};

const ADDITIONALS = {
    'requeijao': { name: 'Requeijão', price: 3.00 },
    'bacon': { name: 'Bacon', price: 3.00 }
};

const CONFIG = {
    deliveryFee: 0,
    deliveryText: 'A combinar',
    whatsappNumber: '5569992701658',
    prepareTime: '15-20'
};