import SalesForm from '../components/SalesForm';
import DailySalesBoard from '../components/DailySalesBoard';

export default function SalesPage() {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Sales</h2>
            <div className="grid grid-cols-1 gap-8 mb-8">
                <DailySalesBoard />
            </div>
            <div className="grid grid-cols-1 gap-8">
                <SalesForm />
            </div>
        </div>
    );
}
{/*Will return to finish sales page...*/}