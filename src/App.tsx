import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";
import AdminPage from "./pages/AdminPage";
import BrowsePage from "./pages/BrowsePage";
import DetailPage from "./pages/DetailPage";
import HistoryPage from "./pages/HistoryPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SubmitPage from "./pages/SubmitPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="lodges" element={<BrowsePage />} />
        <Route path="lodges/:id" element={<DetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route element={<RequireAuth />}>
          <Route path="submit" element={<SubmitPage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>
        <Route element={<RequireAdmin />}>
          <Route path="admin" element={<AdminPage />} />
        </Route>

        <Route
          path="*"
          element={
            <div className="page container">
              <div className="empty-card">
                <h1>Page not found</h1>
                <a className="button primary" href="/">
                  Return home
                </a>
              </div>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
