import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './redux/authSlice';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionListPage from './pages/TransactionListPage';
import BudgetPage from './pages/BudgetPage';
import ProfilePage from './pages/ProfilePage';
import CardsPage from './pages/CardsPage';
import VisualizationPage from './pages/VisualizationPage';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/" element={
          <PrivateRoute>
             <Layout>
                <DashboardPage />
             </Layout>
          </PrivateRoute>
        } />
        <Route path="/transactions" element={
          <PrivateRoute>
             <Layout>
                <TransactionListPage />
             </Layout>
          </PrivateRoute>
        } />
        <Route path="/budgets" element={
          <PrivateRoute>
             <Layout>
                <BudgetPage />
             </Layout>
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
             <Layout>
                <ProfilePage />
             </Layout>
          </PrivateRoute>
        } />
        <Route path="/cards" element={
          <PrivateRoute>
             <Layout>
                <CardsPage />
             </Layout>
          </PrivateRoute>
        } />
        <Route path="/visual" element={
          <PrivateRoute>
             <Layout>
                <VisualizationPage />
             </Layout>
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
