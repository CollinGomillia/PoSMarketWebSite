export default function InventoryPage() {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Inventory</h2>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <p className="text-gray-600">Current inventory levels and stock management</p>
                {/*This technically will coexist with Backstock since it already registers inventory, will get back to it later*/}
            </div>
        </div>
    );
}
