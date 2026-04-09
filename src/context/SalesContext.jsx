import { createContext, useState, useContext, useEffect } from 'react';

// Create context
const SalesContext = createContext();

// Create a provider component
export function SalesProvider({ children }) {
    const [currentCart, setCurrentCart] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [products] = useState([
        { id: 1, name: 'Milk', price: 2.50, category: 'Dairy' },
        { id: 2, name: 'Bread', price: 1.50, category: 'Bakery' },
        { id: 3, name: 'Eggs', price: 3.00, category: 'Dairy' },
        { id: 4, name: 'Butter', price: 4.50, category: 'Dairy' },
        { id: 5, name: 'Cheese', price: 5.00, category: 'Dairy' },
        { id: 6, name: 'Cereal', price: 2.50, category: 'Breakfast Foods'}
    ]);
    const [dailyGoal] = useState(70000);

    // Load from localStorage on startup
    useEffect(() => {
        const saved = localStorage.getItem('invoices');
        if (saved) {
            try {
                setInvoices(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading invoices:', e);
            }
        }
    }, []);

    // Save to localStorage whenever invoices change
    useEffect(() => {
        localStorage.setItem('invoices', JSON.stringify(invoices));
    }, [invoices]);

    const addToCart = (product, quantity) => {
        const existing = currentCart.find(item => item.id === product.id);
        if (existing) {
            setCurrentCart(currentCart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            ));
        } else {
            setCurrentCart([...currentCart, { ...product, quantity }]);
        }
    };

    const removeFromCart = (productId) => {
        setCurrentCart(currentCart.filter(item => item.id !== productId));
    };

    const completeSale = (paymentMethod) => {
        const total = currentCart.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
        );

        const newInvoice = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: currentCart,
            total,
            paymentMethod,
        };

        setInvoices([...invoices, newInvoice]);
        setCurrentCart([]);
    };

    return (
        <SalesContext.Provider
            value={{
                currentCart,
                invoices,
                products,
                dailyGoal,
                addToCart,
                removeFromCart,
                completeSale,
            }}
        >
            {children}
        </SalesContext.Provider>
    );
}

// Custom hook to use context
export function useSales() {
    const context = useContext(SalesContext);
    if (!context) {
        throw new Error('useSales must be used inside SalesProvider');
    }
    return context;
}
