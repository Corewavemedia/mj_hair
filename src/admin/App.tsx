import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminRoute } from './components/AdminRoute';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { AddProducts } from './pages/AddProducts';
import { EditProduct } from './pages/EditProduct';
import { Orders } from './pages/Orders';
import { Customers } from './pages/Customers';
import { SalesReport } from './pages/SalesReport';
import { Settings } from './pages/Settings';
import { ThemeProvider } from './context/ThemeContext';
import { AnalyticsProvider } from './context/AnalyticsContext';


function App() {
  return (
    <ThemeProvider>
      <Router>
        <AdminRoute>
          <AnalyticsProvider>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/sales-report" element={<SalesReport />} />
              <Route path="/add-products" element={<AddProducts />} />
              <Route path="/products/edit/:id" element={<EditProduct />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </AnalyticsProvider>
        </AdminRoute>
      </Router>
    </ThemeProvider>
  );
}

export default App;
