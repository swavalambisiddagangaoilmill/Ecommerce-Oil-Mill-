// Route map for the isolated admin UI prototype.
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout.jsx";
import { AuditLogsPage, CategoriesPage, ContentPage, CouponsPage, CustomersPage, DashboardPage, InventoryPage, MediaPage, MessagesPage, NewsletterPage, OffersPage, OrdersPage, PaymentsPage, ProductFormPage, ProductsPage, ReportsPage, SettingsPage, ShippingPage, UsersPage } from "../pages/AdminPages.jsx";

export default function AdminRoutes() {
  return <Routes>
    <Route element={<AdminLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="products/new" element={<ProductFormPage />} />
      <Route path="inventory" element={<InventoryPage />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="offers" element={<OffersPage />} />
      <Route path="coupons" element={<CouponsPage />} />
      <Route path="shipping" element={<ShippingPage />} />
      <Route path="customers" element={<CustomersPage />} />
      <Route path="payments" element={<PaymentsPage />} />
      <Route path="content" element={<ContentPage />} />
      <Route path="media" element={<MediaPage />} />
      <Route path="messages" element={<MessagesPage />} />
      <Route path="newsletter" element={<NewsletterPage />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="audit-logs" element={<AuditLogsPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Route>
  </Routes>;
}
