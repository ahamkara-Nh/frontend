import { Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './screens/Onboarding/Onboarding';
import Onboarding2 from './screens/Onboarding/Onboarding2';
import OnboardingLearn1 from './screens/Onboarding/OnboardingLearn1';
import OnboardingLearn2 from './screens/Onboarding/OnboardingLearn2';
import OnboardingLearn3 from './screens/Onboarding/OnboardingLearn3';
import OnboardingLearn4 from './screens/Onboarding/OnboardingLearn4';
import OnboardingLearn5 from './screens/Onboarding/OnboardingLearn5';
import OnboardingLearn6 from './screens/Onboarding/OnboardingLearn6';
import HomePhase0 from './screens/Home/HomePhase0';
import HomePhase1 from './screens/Home/HomePhase1';
import OnboardingAllergies from './screens/Onboarding/OnboardingAllergies';
import { AuthProvider } from './context/AuthContext';

// Placeholder for where the app navigates after onboarding
const HomePagePlaceholder = () => <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>Welcome to the App! (Homepage Placeholder)</div>;

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboarding/2" element={<Onboarding2 />} />
        <Route path="/onboarding/learn/1" element={<OnboardingLearn1 />} />
        <Route path="/onboarding/learn/2" element={<OnboardingLearn2 />} />
        <Route path="/onboarding/learn/3" element={<OnboardingLearn3 />} />
        <Route path="/onboarding/learn/4" element={<OnboardingLearn4 />} />
        <Route path="/onboarding/learn/5" element={<OnboardingLearn5 />} />
        <Route path="/onboarding/learn/6" element={<OnboardingLearn6 />} />
        <Route path="/onboarding/allergies" element={<OnboardingAllergies />} />
        <Route path="/home" element={<HomePagePlaceholder />} />
        <Route path="/home/phase0" element={<HomePhase0 />} />
        <Route path="/home/phase1" element={<HomePhase1 />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
