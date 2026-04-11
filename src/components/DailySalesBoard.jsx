import { useSales } from '../context/SalesContext.jsx';

export default function DailySalesBoard() {
    const { invoices, dailyGoal } = useSales();

    const today = new Date().toDateString();
    const todayInvoices = invoices.filter(
        (inv) => new Date(inv.date).toDateString() === today
    );
    const todaySales = todayInvoices.reduce((sum, inv) => sum + inv.total, 0);

    const progress = (todaySales / dailyGoal) * 100;

    //This is all for display purposes, within this function we are returning the sales, which will then be calculated and displayed by the daily goal
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Today's Performance
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-600 text-sm font-semibold">Today's Sales</p>
                    <p className="text-4xl font-bold text-green-600 mt-2">
                        ${todaySales.toFixed(2)}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-600 text-sm font-semibold">Daily Goal</p>
                    <p className="text-4xl font-bold text-blue-600 mt-2">
                        ${dailyGoal}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-600 text-sm font-semibold">Transactions</p>
                    <p className="text-4xl font-bold text-purple-600 mt-2">
                        {todayInvoices.length}
                    </p>
                </div>
            </div>



            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-800">Goal Progress</span>
                    <span className="text-lg font-bold text-gray-800">
            {Math.round(progress)}%
          </span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden">
                    <div
                        className={`h-full transition-all font-bold text-white flex items-center justify-center text-sm ${
                            progress >= 100 ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    >
                        {progress > 10 && `${Math.round(progress)}%`}
                    </div>
                </div>
            </div>
        </div>
    );
}
