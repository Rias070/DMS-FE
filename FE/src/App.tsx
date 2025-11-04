import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
// Chart pages disabled (kept in repo but not routed)
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import Inbox from "./pages/Inbox/Inbox";
import { ScrollToTop } from "./components/common/ScrollToTop";
import RoleBasedHome from "./pages/Home/RoleBasedHome";
import Products from "./pages/Ecommerce/Products";
import Orders from "./pages/Ecommerce/Orders";
import Customers from "./pages/Ecommerce/Customers";
import CustomerDetails from "./pages/Ecommerce/CustomerDetails";
import TestDrivePage from "./pages/TestDrive/TestDrivePage";
import UserManagement from "./pages/UserManagement";
import RestockManagement from "./pages/Restock/RestockManagement";
import CompanyRestockRequests from "./pages/Restock/CompanyRestockRequests";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DealerManagement from "./pages/DealerManagement";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
        <ScrollToTop />
        <Routes>
          {/* Auth Layout - Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Dashboard Layout - Protected Routes */}
          <Route 
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index path="/" element={<RoleBasedHome />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements removed */}
            <Route path="/inbox" element={<Inbox />} />

            {/* Charts removed from routes */}
            {/* Ecommerce */}
            <Route path="/ecommerce/products" element={<Products />} />
            <Route path="/ecommerce/orders" element={<Orders />} />
            <Route path="/ecommerce/customers" element={<Customers />} />
            <Route path="/ecommerce/customers/:id" element={<CustomerDetails />} />

            {/* Test Drive Management - Only for Dealer roles */}
            <Route 
              path="/test-drive" 
              element={
                <ProtectedRoute requiredRoles={['DealerAdmin', 'DealerStaff']}>
                  <TestDrivePage />
                </ProtectedRoute>
              } 
            />

            {/* Dealer Management - Only for Company Admin */}
            <Route 
              path="/dealer-management" 
              element={
                <ProtectedRoute requiredRoles={['CompanyAdmin']}>
                  <DealerManagement />
                </ProtectedRoute>
              } 
            />

            {/* User Management - Only for Company Admin */}
            <Route 
              path="/user-management" 
              element={
                <ProtectedRoute requiredRoles={['CompanyAdmin']}>
                  <UserManagement />
                </ProtectedRoute>
              } 
            />

            {/* Restock Management - Only for Dealer Admin/Manager */}
            <Route 
              path="/restock-management" 
              element={
                <ProtectedRoute requiredRoles={['DealerAdmin', 'DealerManager']}>
                  <RestockManagement />
                </ProtectedRoute>
              } 
            />

            {/* Company Restock Requests - Only for Company Admin/Manager/Staff */}
            <Route 
              path="/company-restock-requests" 
              element={
                <ProtectedRoute requiredRoles={['CompanyAdmin', 'CompanyManager', 'CompanyStaff']}>
                  <CompanyRestockRequests />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}
