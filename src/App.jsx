import Onboarding from './screens/Onboarding/Onboarding';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Onboarding />
    </AuthProvider>
  );
}

export default App;
