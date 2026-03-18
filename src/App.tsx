import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PriceProvider } from "./contexts/PriceContext";
import SiteGuard from "./components/admin/SiteGuard";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import NotFound from "./pages/NotFound.tsx";
import DashboardLayout from "./components/dashboard/DashboardLayout.tsx";
import DashboardHome from "./pages/dashboard/DashboardHome.tsx";
import MarketsPage from "./pages/dashboard/MarketsPage.tsx";
import WatchlistPage from "./pages/dashboard/WatchlistPage.tsx";
import TradePage from "./pages/dashboard/TradePage.tsx";
import ChartsPage from "./pages/dashboard/ChartsPage.tsx";
import AssetTradePage from "./pages/dashboard/AssetTradePage.tsx";
import PositionsPage from "./pages/dashboard/PositionsPage.tsx";
import OrdersPage from "./pages/dashboard/OrdersPage.tsx";
import HistoryPage from "./pages/dashboard/HistoryPage.tsx";
import FundsPage from "./pages/dashboard/FundsPage.tsx";
import AlertsPage from "./pages/dashboard/AlertsPage.tsx";
import SettingsPage from "./pages/dashboard/SettingsPage.tsx";
import SupportPage from "./pages/dashboard/SupportPage.tsx";
import CryptoBuyPage from "./pages/dashboard/CryptoBuyPage.tsx";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import AdminOverview from "./pages/admin/AdminOverview.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminTransactions from "./pages/admin/AdminTransactions.tsx";
import AdminKyc from "./pages/admin/AdminKyc.tsx";
import AdminOrders from "./pages/admin/AdminOrders.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import AdminMarkets from "./pages/admin/AdminMarkets.tsx";
import AdminEmail from "./pages/admin/AdminEmail.tsx";
import AdminIssues from "./pages/admin/AdminIssues.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PriceProvider>
      <BrowserRouter>
        <SiteGuard>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="markets" element={<MarketsPage />} />
            <Route path="watchlist" element={<WatchlistPage />} />
            <Route path="trade" element={<TradePage />} />
            <Route path="charts" element={<ChartsPage />} />
            <Route path="trade/:symbol" element={<AssetTradePage />} />
            <Route path="positions" element={<PositionsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="funds" element={<FundsPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="buy/:asset" element={<CryptoBuyPage />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="markets" element={<AdminMarkets />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="kyc" element={<AdminKyc />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="email" element={<AdminEmail />} />
            <Route path="issues" element={<AdminIssues />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </SiteGuard>
      </BrowserRouter>
      </PriceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
