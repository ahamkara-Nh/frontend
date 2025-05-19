import { Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './screens/Onboarding/Onboarding';
import Onboarding2 from './screens/Onboarding/Onboarding2';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboarding/2" element={<Onboarding2 />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
