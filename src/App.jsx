import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { SalesProvider } from './context/SalesContext.jsx';
import SalesPage from './pages/SalesPage';
import InventoryPage from './pages/InventoryPage';
import BackstockPage from './pages/BackstockPage';
import IncomingInventoryPage from './pages/IncomingInventoryPage';
import FillFloorPage from './pages/FillFloorPage';
import './App.css';

export default function App() {
    return (
        <SalesProvider>
            <Router>
                <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
                    {/* Header */}
                    <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 shadow-2xl">
                        <div className="p-8 max-w-7xl mx-auto">
                            <h1 className="text-5xl font-bold text-white text-center mb-8">
                                Supermarket PoS-myDay
                            </h1>
                        </div>

                        {/* Navigation */}
                        <nav className="bg-white/10 backdrop-blur-md border-t border-white/20">
                            <div className="max-w-7xl mx-auto px-6 py-4">
                                <div className="flex items-center justify-center gap-2">
                                    <NavLink to="/">Sales</NavLink>
                                    <div className="w-1 h-6 bg-white/30 rounded-full"></div>
                                    <NavLink to="/inventory">Inventory</NavLink>
                                    <div className="w-1 h-6 bg-white/30 rounded-full"></div>
                                    <NavLink to="/backstock">Backstock</NavLink>
                                    <div className="w-1 h-6 bg-white/30 rounded-full"></div>
                                    <NavLink to="/incoming">Incoming</NavLink>
                                    <div className="w-1 h-6 bg-white/30 rounded-full"></div>
                                    <NavLink to="/fill-floor">Fill Floor</NavLink>
                                </div>
                            </div>
                        </nav>
                    </header>

                    {/* Page Content */}
                    <main className="p-8 max-w-7xl mx-auto">
                        <Routes>
                            <Route path="/" element={<SalesPage />} />
                            <Route path="/inventory" element={<InventoryPage />} />
                            <Route path="/backstock" element={<BackstockPage />} />
                            <Route path="/incoming" element={<IncomingInventoryPage />} />
                            <Route path="/fill-floor" element={<FillFloorPage />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </SalesProvider>
    );
}

// Navigation Link Component
function NavLink({ to, children }) {
    return (
        <Link
            to={to}
            className="text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition duration-300 whitespace-nowrap"
        >
            {children}
        </Link>
    );
}
