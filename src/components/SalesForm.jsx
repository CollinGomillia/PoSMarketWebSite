import { useState } from 'react';
import { useSales } from '../context/SalesContext.jsx';
import { Trash2, Plus } from 'lucide-react';
//This was made for the purpose of manually adding in items just to see if the daily progress percentage worked, I will be moving this into a transaction page of it's own later

export default function SalesForm() {
    const { products, currentCart, addToCart, removeFromCart, completeSale } =
        useSales();

    const [quantity, setQuantity] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Cash');

    const handleAddToCart = () => {
        if (selectedProduct && quantity > 0) {
            addToCart(selectedProduct, quantity);
            setQuantity(1);
            setSelectedProduct(null);
        }
    };

    const cartTotal = currentCart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );


    return (
        <div className="flex gap-6 bg-white rounded-lg shadow-lg p-6">
            {/* Product Selection Panel */}
            <div className="flex-1">
                <h2 className="text-2xl font-bold mb-6">Add Items</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Select Product
                        </label>
                        <select
                            value={selectedProduct?.id || ''}
                            onChange={(e) =>
                                setSelectedProduct(products.find((p) => p.id == e.target.value))
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Choose a product --</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} - ${p.price.toFixed(2)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Quantity
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter quantity"
                        />
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedProduct}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    >
                        <Plus size={20} /> Add to Cart
                    </button>
                </div>
            </div>

            {/* Just heading for Shopping Cart, updates with user input*/}
            <div className="flex-1 border-l pl-6">
                <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

                {currentCart.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Cart is empty</p>
                ) : (
                    <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                        {currentCart.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center border-b pb-3"
                            >
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-600">
                                        ${item.price.toFixed(2)} × {item.quantity}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-600 hover:text-red-800 mt-1 flex items-center gap-1 text-sm"
                                    >
                                        <Trash2 size={16} /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}



                <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-xl font-bold mb-4">
                        <span>Total:</span>
                        <span className="text-green-600">${cartTotal.toFixed(2)}</span>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2"> {/*This is for payment methods, it's just a drop down menu for now, I haven't categorized yet */}
                            Payment Method
                        </label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option>Cash</option>
                            <option>Card</option>
                            <option>Mobile Payment</option>
                        </select>
                    </div>

                    <button
                        onClick={() => completeSale(paymentMethod)}
                        disabled={currentCart.length === 0}
                        className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    >
                        Complete Sale
                    </button>
                </div>
            </div>
        </div>
    );
}
