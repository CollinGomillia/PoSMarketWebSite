import { useState } from 'react';
import { Search, Plus, Trash2, Edit2 } from 'lucide-react';

export default function BackstockPage() {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        sku: '',
        location: '',
        reorderLevel: ''
    });

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Add or update item
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.quantity || !formData.sku) {
            alert('Please fill in all required fields');
            return;
        }

        if (editingId) {
            // Update existing item
            setItems(items.map(item =>
                item.id === editingId
                    ? { ...item, ...formData, quantity: parseInt(formData.quantity), reorderLevel: parseInt(formData.reorderLevel) || 0 }
                    : item
            ));
            setEditingId(null);
        } else {
            // Add new item
            const newItem = {
                id: Date.now(),
                ...formData,
                quantity: parseInt(formData.quantity),
                reorderLevel: parseInt(formData.reorderLevel) || 0,
                dateAdded: new Date().toLocaleDateString()
            };
            setItems([...items, newItem]);
        }

        // Reset form
        setFormData({ name: '', quantity: '', sku: '', location: '', reorderLevel: '' });
        setShowForm(false);
    };

    // Delete item
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    // Edit item
    const handleEdit = (item) => {
        setFormData({
            name: item.name,
            quantity: item.quantity.toString(),
            sku: item.sku,
            location: item.location,
            reorderLevel: item.reorderLevel.toString()
        });
        setEditingId(item.id);
        setShowForm(true);
    };

    // Cancel form
    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: '', quantity: '', sku: '', location: '', reorderLevel: '' });
    };

    // Filter items based on search
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Check for low stock items
    const lowStockItems = filteredItems.filter(item => item.quantity <= item.reorderLevel && item.reorderLevel > 0);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Backstock</h2>

            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Header with Add Button */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">Items stored in backstock area</p>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus size={20} />
                        Backstock Item
                    </button>
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-4">
                            {editingId ? 'Edit Item' : 'Add New Item'}
                        </h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Item Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Milk"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                    min="0"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Dairy/Frozen/Grocery"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex gap-2 md:col-span-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                                >
                                    {editingId ? 'Update Item' : 'Add Item'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
                        <Search size={20} className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Search by name, SKU, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-gray-700"
                        />
                    </div>
                </div>

                {/* Low Stock Alert */}
                {lowStockItems.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-yellow-800 font-medium">
                            ⚠️ {lowStockItems.length} item(s) below reorder level
                        </p>
                    </div>
                )}

                {/* Items Table */}
                {items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p className="mb-2">No items in backstock yet</p>
                        <p className="text-sm">Click "Add Item" to get started</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No items match your search</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="border-b-2 border-gray-300 bg-gray-50">
                                <th className="text-left px-4 py-3 font-semibold">Item Name</th>
                                <th className="text-left px-4 py-3 font-semibold">SKU</th>
                                <th className="text-center px-4 py-3 font-semibold">Quantity</th>
                                <th className="text-left px-4 py-3 font-semibold">Location</th>
                                <th className="text-center px-4 py-3 font-semibold">Reorder Level</th>
                                <th className="text-center px-4 py-3 font-semibold">Status</th>
                                <th className="text-center px-4 py-3 font-semibold">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredItems.map((item) => (
                                <tr
                                    key={item.id}
                                    className={`border-b border-gray-200 hover:bg-gray-50 ${
                                        item.quantity <= item.reorderLevel && item.reorderLevel > 0
                                            ? 'bg-yellow-50'
                                            : ''
                                    }`}
                                >
                                    <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                                    <td className="px-4 py-3 text-gray-700">{item.sku}</td>
                                    <td className="px-4 py-3 text-center font-semibold text-gray-900">
                                        {item.quantity}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{item.location}</td>
                                    <td className="px-4 py-3 text-center text-gray-700">{item.reorderLevel}</td>
                                    <td className="px-4 py-3 text-center">
                                        {item.quantity <= item.reorderLevel && item.reorderLevel > 0 ? (
                                            <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                    Low Stock
                                                </span>
                                        ) : (
                                            <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                    Ok
                                                </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Summary Stats */}
                {items.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-gray-600 text-sm">Total Items</p>
                            <p className="text-2xl font-bold text-gray-900">{filteredItems.length}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Units</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {filteredItems.reduce((sum, item) => sum + item.quantity, 0)}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Low Stock Items</p>
                            <p className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
