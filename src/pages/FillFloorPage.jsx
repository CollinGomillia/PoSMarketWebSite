import { useState } from 'react';
import { Search, Plus, Trash2, Edit2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

{/*Initially wanted to be like a pull from the backroom, didn't have enough time to implement this */}
const INITIAL_FORM = {
    itemName: '',
    location: '',
    quantity: '',
    assignedTo: '',
    priority: 'NOW',
    status: 'pending'
};

const PRIORITY_COLORS = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
};

const STATUS_ICONS = {
    completed: { icon: CheckCircle, color: 'text-green-600' },
    'in-progress': { icon: Clock, color: 'text-blue-600' },
    pending: { icon: AlertCircle, color: 'text-yellow-600' }
};

export default function FillFloorPage() {
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [formData, setFormData] = useState(INITIAL_FORM);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData(INITIAL_FORM);
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.itemName || !formData.location || !formData.quantity) {
            alert('Please fill in all required fields');
            return;
        }

        if (editingId) {
            setTasks(tasks.map(task =>
                task.id === editingId
                    ? { ...task, ...formData, quantity: parseInt(formData.quantity) }
                    : task
            ));
        } else {
            setTasks([...tasks, {
                id: Date.now(),
                ...formData,
                quantity: parseInt(formData.quantity),
                dateCreated: new Date().toLocaleDateString(),
                timeCreated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }

        resetForm();
    };

    const handleEdit = (task) => {
        setFormData({
            itemName: task.itemName,
            location: task.location,
            quantity: task.quantity.toString(),
            assignedTo: task.assignedTo,
            priority: task.priority,
            status: task.status
        });
        setEditingId(task.id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure?')) {
            setTasks(tasks.filter(task => task.id !== id));
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, status: newStatus } : task
        ));
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = [task.itemName, task.location, task.assignedTo]
            .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()));
        return filterStatus === 'all' ? matchesSearch : matchesSearch && task.status === filterStatus;
    });

    const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        'in-progress': tasks.filter(t => t.status === 'in-progress').length,
        completed: tasks.filter(t => t.status === 'completed').length
    };

    const FormField = ({ label, name, type = 'text', options = null, required = false }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && '*'}
            </label>
            {options ? (
                <select
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            ) : (
                <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    min={type === 'number' ? '0' : undefined}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            )}
        </div>
    );

    const StatusIcon = ({ status }) => {
        const { icon: Icon, color } = STATUS_ICONS[status] || STATUS_ICONS.pending;
        return <Icon size={18} className={color} />;
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Fill Floor</h2>

            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">Floor stocking tasks and assignments</p>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus size={20} /> New Task
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total', value: stats.total, color: 'bg-gray-100' },
                        { label: 'Pending', value: stats.pending, color: 'bg-yellow-100' },
                        { label: 'In Progress', value: stats['in-progress'], color: 'bg-blue-100' },
                        { label: 'Completed', value: stats.completed, color: 'bg-green-100' }
                    ].map(stat => (
                        <div key={stat.label} className={`${stat.color} p-4 rounded-lg text-center`}>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* This is for the create new pull to fill the floor */}
                {showForm && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-4">
                            {editingId ? 'Edit Pull' : 'Create New Pull'}
                        </h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="Item Name" name="itemName"  />
                            <FormField label="Location" name="location"  />
                            <FormField label="Quantity" name="quantity" type="number"  />
                            <FormField label="Assigned To" name="assignedTo" />
                            <FormField label="Priority" name="priority" options={['low', 'medium', 'high']} />
                            <FormField label="Status" name="status" options={['pending', 'in-progress', 'completed']} />

                            <div className="flex gap-2 md:col-span-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                                >
                                    {editingId ? 'Update' : 'Create'} Task
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}


                {/* Tasks Table */}
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        {tasks.length === 0 ? 'No tasks yet. Create one to get started!' : 'No tasks match your search.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Item</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Location</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Qty</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Assigned</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Priority</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredTasks.map(task => (
                                <tr key={task.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium">{task.itemName}</td>
                                    <td className="px-4 py-3 text-sm">{task.location}</td>
                                    <td className="px-4 py-3 text-sm">{task.quantity}</td>
                                    <td className="px-4 py-3 text-sm">{task.assignedTo || '—'}</td>
                                    <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-1 rounded ${PRIORITY_COLORS[task.priority]}`}>
                                                {task.priority}
                                            </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(task)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
