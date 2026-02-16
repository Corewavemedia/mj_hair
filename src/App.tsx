import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import SuccessPage from "./pages/SuccessPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import UserDashboard from "./pages/UserDashboard";
import ShopPage from "./pages/ShopPage";
import ProductDetails from "./pages/ProductDetails";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";

// Admin Imports
import { Dashboard } from "./admin/pages/Dashboard";
import { Products } from "./admin/pages/Products";
import { Orders } from "./admin/pages/Orders";
import { Customers } from "./admin/pages/Customers";
import { SalesReport } from "./admin/pages/SalesReport";
import { AddProducts } from "./admin/pages/AddProducts";
import { EditProduct } from "./admin/pages/EditProduct";
import { Settings } from "./admin/pages/Settings";
import { AdminRoute } from "./admin/components/AdminRoute";
import { ThemeProvider } from "./admin/context/ThemeContext";
import { AnalyticsProvider } from "./admin/context/AnalyticsContext";

export default function App() {
    return (
        <CartProvider>
            <Router>
                <div className="font-['Manrope',sans-serif]">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={
                            <>
                                <SignedIn>
                                    <CheckoutPage />
                                </SignedIn>
                                <SignedOut>
                                    <RedirectToSignIn />
                                </SignedOut>
                            </>
                        } />
                        <Route path="/dashboard" element={
                            <>
                                <SignedIn>
                                    <UserDashboard />
                                </SignedIn>
                                <SignedOut>
                                    <RedirectToSignIn />
                                </SignedOut>
                            </>
                        } />
                        <Route path="/shop" element={<ShopPage />} />
                        <Route path="/shop/:id" element={<ProductDetails />} />
                        <Route path="/success" element={<SuccessPage />} />
                        <Route path="/login/*" element={<SignInPage />} />
                        <Route path="/signup/*" element={<SignUpPage />} />

                        {/* Admin Routes */}
                        <Route path="/admin/*" element={
                            <ThemeProvider>
                                <AdminRoute>
                                    <AnalyticsProvider>
                                        <Routes>
                                            <Route index element={<Dashboard />} />
                                            <Route path="dashboard" element={<Dashboard />} />
                                            <Route path="products" element={<Products />} />
                                            <Route path="orders" element={<Orders />} />
                                            <Route path="customers" element={<Customers />} />
                                            <Route path="sales-report" element={<SalesReport />} />
                                            <Route path="add-products" element={<AddProducts />} />
                                            <Route path="products/edit/:id" element={<EditProduct />} />
                                            <Route path="settings" element={<Settings />} />
                                        </Routes>
                                    </AnalyticsProvider>
                                </AdminRoute>
                            </ThemeProvider>
                        } />
                    </Routes>
                </div>
            </Router>
        </CartProvider >
    );
}