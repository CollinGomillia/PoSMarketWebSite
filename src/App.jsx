import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { SalesProvider } from './context/SalesContext.jsx';
import SalesPage from './pages/SalesPage';
import InventoryPage from './pages/InventoryPage';
import BackstockPage from './pages/BackstockPage';
import IncomingInventoryPage from './pages/IncomingInventoryPage';
import FillFloorPage from './pages/FillFloorPage';
import InvoicesPage from './pages/InvoicesPage';
import UsersPage from './pages/UserPage';
import './app.css';

//This is the main page to the app, all links through dashboard and sidenavbar links, this is ideally what you want to see with a PoS system
//Need to add some more functionalities later, and links to completed pages
export default function App() {
    return (
        <SalesProvider>
            <Router>
                <div className="app-container">
                    {/* Header */}
                    <header className="header">
                        <div className="header-content">
                            <div>
                                <h1>Supermarket PoS</h1>
                            </div>
                            <div className="header-right">
                                {/*Current time est*/}
                                <div className="header-time">
                                    {new Date().toLocaleTimeString()}
                                </div>
                                <div className="header-user">
                                    Logged in as: <span>ADMIN</span>
                                </div>
                                <button className="logout-btn">Logout</button>
                            </div>
                        </div>
                    </header>

                    <div className="main-wrapper">
                        {/* Sidebar, emoticons taken from online, will be for tasks, non-financial */}
                        {/*Some of these may not be completed yet, including mark out items and incoming inventory/trailers */}
                        <aside className="sidebar">
                            <nav>
                                <SidebarLink icon="📊" label="Dashboard" to="/" />
                                <SidebarLink icon="🫙" label="Inventory" to="/inventory" />
                                <SidebarLink icon="🚚" label="Incoming Inventory" to="/incoming" />
                                <SidebarLink icon="❌" label="Mark Out Items" to="/mark-out" />
                                <SidebarLink icon="🛒" label = "Fill The Floor" to= "/fill-floor" />
                                <SidebarLink icon="🫳" label = "Backstock Items" to="/backstockitems" />
                                <hr />
                                <button className="sidebar-logout"> Switch User</button>
                            </nav>
                        </aside>

                        {/* Main content on the dashboard*/}
                        <main className="main-content">
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/sales" element={<SalesPage />} />
                                <Route path="/invoices" element={<InvoicesPage />} />
                                <Route path="/users" element={<UsersPage />} />
                                <Route path="/inventory" element={<InventoryPage />} />
                                <Route path="/backstockitems" element={<BackstockPage />} />
                                <Route path="/incoming" element={<IncomingInventoryPage />} />
                                <Route path="/fill-floor" element={<FillFloorPage />} />
                            </Routes>
                        </main>
                    </div>
                </div>
            </Router>
        </SalesProvider>
    );
}

// Sidebar Link
function SidebarLink({ icon, label, to }) {
    return (
        <Link to={to} className="sidebar-link">
            <span className="sidebar-icon">{icon}</span>
            <span>{label}</span>
        </Link>
    );
}

// Dashboard labels and icons
function Dashboard() {
    const actions = [
        { icon: "👤", label: "User", to: "/users" },
        { icon: "📄", label: "Invoices", to: "/invoices" },
        { icon: "💰", label: "Sales", to: "/sales" },
        { icon: "📁", label: "Sales Report", to: "/sales-report" },
        { icon: "💳", label: "Account Receivable", to: "/account-receivable" },
    ];
    // Dashboard on main page
    return (
        <div>
            <h2 className="dashboard-title">Dashboard</h2>
            <div className="dashboard-grid">
                {actions.map((action) => (
                    <Link
                        key={action.label}
                        to={action.to}
                        className="action-card"
                    >
                        <div className="action-card-icon">{action.icon}</div>
                        <div className="action-card-label">{action.label}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
}