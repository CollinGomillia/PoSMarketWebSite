import { useState } from 'react';
import { Plus, Download, Search, Eye, Trash2, Edit2, X, ChevronDown } from 'lucide-react';

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState([
        { id: 'INV-001', date: '2026-04-10', customer: 'John Smith', amount: 150.50, status: 'Paid', items: 3 }, //Example invoice, or filler
    ]);

    //Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // The SetUp for creating a new invoice
    const [formData, setFormData] = useState({
        customer: '',
        email: '',
        phone: '',
        date: new Date().toISOString().split('T')[0],
        items: [{ id: 1, description: '', quantity: 1, unitPrice: 0 }],
        status: 'Pending',
        notes: ''
    });
    const [nextItemId, setNextItemId] = useState(2);

    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.customer.toLowerCase().includes(searchTerm.toLowerCase());
        return filterStatus === 'all' ? matchesSearch : matchesSearch && invoice.status === filterStatus;
    });

    //For drop down of stats on store invoices
    const stats = {
        total: invoices.reduce((sum, inv) => sum + inv.amount, 0),
        paid: invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0),
        pending: invoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + inv.amount, 0),
        overdue: invoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0)
    };

    //Colors to show importance of the status of a invoice
    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-emerald-100 text-emerald-700 border border-emerald-300';
            case 'Pending': return 'bg-amber-100 text-amber-700 border border-amber-300';
            case 'Overdue': return 'bg-rose-100 text-rose-700 border border-rose-300';
            default: return 'bg-slate-100 text-slate-700 border border-slate-300';
        }
    };

    const handleDelete = (id) => {
        setInvoices(invoices.filter(inv => inv.id !== id));
    };

    const handleViewDetails = (invoice) => {
        setSelectedInvoice(invoice);
        setShowDetailModal(true);
    };

    const handleDownload = (invoice) => {
        const element = document.createElement('a');
        const file = new Blob([`Invoice ${invoice.id}\n\nCustomer: ${invoice.customer}\nDate: ${invoice.date}\nAmount: $${invoice.amount.toFixed(2)}\nStatus: ${invoice.status}`], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${invoice.id}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    // Invoice Creation Handlers
    const calculateTotal = () => {
        return formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    };

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { id: nextItemId, description: '', quantity: 1, unitPrice: 0 }]
        });
        setNextItemId(nextItemId + 1);
    };

    const handleRemoveItem = (itemId) => {
        setFormData({
            ...formData,
            items: formData.items.filter(item => item.id !== itemId)
        });
    };

    const handleItemChange = (itemId, field, value) => {
        setFormData({
            ...formData,
            items: formData.items.map(item =>
                item.id === itemId ? { ...item, [field]: field === 'quantity' || field === 'unitPrice' ? parseFloat(value) || 0 : value } : item
            )
        });
    };

    const handleCreateInvoice = () => {
        if (!formData.customer.trim()) {
            alert('Please enter a customer name');
            return;
        }
        if (formData.items.length === 0 || !formData.items[0].description) {
            alert('Please add at least one item');
            return;
        }

        const newInvoiceId = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
        const newInvoice = {
            id: newInvoiceId,
            date: formData.date,
            customer: formData.customer,
            amount: calculateTotal(),
            status: formData.status,
            items: formData.items.length,
            email: formData.email,
            phone: formData.phone,
            notes: formData.notes
        };

        setInvoices([newInvoice, ...invoices]);
        setShowCreateModal(false);

        // Reset form
        setFormData({
            customer: '',
            email: '',
            phone: '',
            date: new Date().toISOString().split('T')[0],
            items: [{ id: 1, description: '', quantity: 1, unitPrice: 0 }],
            status: 'Pending',
            notes: ''
        });
        setNextItemId(2);

        alert(`Invoice ${newInvoiceId} created successfully!`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Invoices</h1>
                <p className="text-slate-600">Manage and track all customer invoices</p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">

                {/* Top Bar with Action */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
                    <div>
                        <p className="text-sm font-medium text-slate-600">Showing {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
                    >
                        <Plus size={20} /> Create Invoice
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                    <StatCard
                        label="Total Revenue"
                        amount={stats.total}
                        bgColor="bg-slate-100"
                        textColor="text-slate-700"
                        icon="💰"
                    />
                    <StatCard
                        label="Paid"
                        amount={stats.paid}
                        bgColor="bg-emerald-100"
                        textColor="text-emerald-700"
                        icon="✓"
                    />
                    <StatCard
                        label="Pending"
                        amount={stats.pending}
                        bgColor="bg-amber-100"
                        textColor="text-amber-700"
                        icon="⏳"
                    />
                    <StatCard
                        label="Overdue"
                        amount={stats.overdue}
                        bgColor="bg-rose-100"
                        textColor="text-rose-700"
                        icon="⚠"
                    />
                </div>

                {/* Search & Filter */}
                <div className="p-6 border-b border-slate-200 bg-white">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by invoice ID or customer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="appearance-none px-4 py-2.5 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="Paid">Paid</option>
                                <option value="Pending">Pending</option>
                                <option value="Overdue">Overdue</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={20} />
                        </div>
                    </div>
                </div>

                {/* Table */}
                {filteredInvoices.length === 0 ? (
                    <div className="text-center py-16 px-6">
                        <div className="text-6xl mb-4">📋</div>
                        <p className="text-slate-500 text-lg font-medium">No invoices found</p>
                        <p className="text-slate-400 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-100 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Invoice ID</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Customer</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Amount</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Items</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                            {filteredInvoices.map((invoice) => (
                                <tr
                                    key={invoice.id}
                                    className="hover:bg-slate-50 transition-colors duration-150 group"
                                >
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-slate-900">{invoice.id}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {new Date(invoice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {invoice.customer}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-slate-900">${invoice.amount.toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {invoice.items}
                                    </td>
                                    <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(invoice.status)}`}>
                                                {invoice.status}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                            <button
                                                onClick={() => handleViewDetails(invoice)}
                                                className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 hover:text-blue-700 transition-all"
                                                title="View details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDownload(invoice)}
                                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-700 transition-all"
                                                title="Download invoice"
                                            >
                                                <Download size={18} />
                                            </button>
                                            <button
                                                className="p-2 hover:bg-amber-50 rounded-lg text-amber-600 hover:text-amber-700 transition-all"
                                                title="Edit invoice"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(invoice.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700 transition-all"
                                                title="Delete invoice"
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
            </div>

            {/* Details of the model, mostly css to make it look better*/}
            {showDetailModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50">
                            <h2 className="text-xl font-bold text-slate-900">Invoice Details</h2>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                <X size={24} className="text-slate-600" />
                            </button>
                        </div>

                        {/* Page Body */}
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Invoice ID</p>
                                    <p className="text-lg font-bold text-slate-900 mt-1">{selectedInvoice.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</p>
                                    <p className="text-lg font-bold text-slate-900 mt-1">{new Date(selectedInvoice.date).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-4">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer</p>
                                <p className="text-lg font-bold text-slate-900 mt-1">{selectedInvoice.customer}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</p>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">${selectedInvoice.amount.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Items</p>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">{selectedInvoice.items}</p>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-4">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</p>
                                <div className="mt-2">
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold inline-block ${getStatusColor(selectedInvoice.status)}`}>
                                        {selectedInvoice.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Page Footer */}
                        <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="flex-1 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-900 font-medium rounded-lg transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    handleDownload(selectedInvoice);
                                    setShowDetailModal(false);
                                }}
                                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Download size={18} /> Download
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create invoice detail */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 my-8">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50 sticky top-0">
                            <h2 className="text-2xl font-bold text-slate-900">Create New Invoice</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                <X size={24} className="text-slate-600" />
                            </button>
                        </div>

                        {/* Body to collect information from the invoice */}
                        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
                            {/* Customer Information */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-slate-900">Customer Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Customer Name *"
                                        value={formData.customer}
                                        onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                                        className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Line Items */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-slate-900">Line Items</h3>
                                    <button
                                        onClick={handleAddItem}
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                                    >
                                        <Plus size={16} /> Add Item
                                    </button>
                                </div>

                                <div className="space-y-3 max-h-48 overflow-y-auto">
                                    {formData.items.map((item) => (
                                        <div key={item.id} className="flex gap-3 items-end">
                                            <input
                                                type="text"
                                                placeholder="Description *"
                                                value={item.description}
                                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Qty"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                                                className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Price"
                                                min="0"
                                                step="0.01"
                                                value={item.unitPrice}
                                                onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                                                className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            />
                                            <div className="w-24 px-3 py-2 bg-slate-100 rounded-lg text-sm font-semibold text-slate-900">
                                                ${(item.quantity * item.unitPrice).toFixed(2)}
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Leave Notes & Status */}
                            <div className="space-y-4">
                                <textarea
                                    placeholder="Notes (optional)"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    rows="2"
                                />
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Pending">Status: Pending</option>
                                    <option value="Paid">Status: Paid</option>
                                    <option value="Overdue">Status: Overdue</option>
                                </select>
                            </div>

                            {/* Total for invoices */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-slate-900">Total:</span>
                                    <span className="text-2xl font-bold text-blue-600">${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Page Footer */}
                        <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl sticky bottom-0">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-900 font-medium rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateInvoice}
                                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Create Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ label, amount, bgColor, textColor, icon }) {
    return (
        <div className={`${bgColor} rounded-xl p-4 ${textColor}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium opacity-80">{label}</p>
                    <p className="text-2xl font-bold mt-1">${amount.toFixed(2)}</p>
                </div>
                <span className="text-3xl opacity-60">{icon}</span>
            </div>
        </div>
    );
}