import { Route, Routes } from 'react-router-dom';
import CommercialAutoLayout from './layouts/CommercialAutoLayout';
import MainLayout from './layouts/MainLayout';
import MainDashboard from './pages/MainDashboard';
import NotFound from './pages/NotFound';
import CommercialAutoDashboard from './pages/commercial-auto/CommercialAutoDashboard';
import CustomerList from './pages/commercial-auto/customers/CustomerList';
import CustomerForm from './pages/commercial-auto/customers/CustomerForm';
import CustomerDetail from './pages/commercial-auto/customers/CustomerDetail';
import QuoteList from './pages/commercial-auto/quotes/QuoteList';
import QuoteWizard from './pages/commercial-auto/quotes/QuoteWizard';
import QuoteDetail from './pages/commercial-auto/quotes/QuoteDetail';
import PolicyList from './pages/commercial-auto/policies/PolicyList';
import PolicyDetail from './pages/commercial-auto/policies/PolicyDetail';
import PaymentList from './pages/commercial-auto/payments/PaymentList';
import PaymentForm from './pages/commercial-auto/payments/PaymentForm';
import ClaimList from './pages/commercial-auto/claims/ClaimList';
import ClaimForm from './pages/commercial-auto/claims/ClaimForm';
import ClaimDetail from './pages/commercial-auto/claims/ClaimDetail';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<MainDashboard />} />
      </Route>

      <Route path="/commercial-auto" element={<CommercialAutoLayout />}>
        <Route index element={<CommercialAutoDashboard />} />

        <Route path="customers" element={<CustomerList />} />
        <Route path="customers/new" element={<CustomerForm />} />
        <Route path="customers/:id" element={<CustomerDetail />} />
        <Route path="customers/:id/edit" element={<CustomerForm />} />

        <Route path="quotes" element={<QuoteList />} />
        <Route path="quotes/new" element={<QuoteWizard />} />
        <Route path="quotes/:id" element={<QuoteDetail />} />
        <Route path="quotes/:id/edit" element={<QuoteWizard />} />

        <Route path="policies" element={<PolicyList />} />
        <Route path="policies/:id" element={<PolicyDetail />} />

        <Route path="payments" element={<PaymentList />} />
        <Route path="payments/new" element={<PaymentForm />} />

        <Route path="claims" element={<ClaimList />} />
        <Route path="claims/new" element={<ClaimForm />} />
        <Route path="claims/:id" element={<ClaimDetail />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
