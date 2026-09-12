import { useState, useEffect } from 'react';
import MedicalBackground from './components/MedicalBackground';
import Navbar from './components/Navbar';
import HeroMaster from './components/HeroMaster'; // <-- YAHAN REPLACE KIYA
import ProductSuite from './components/ProductSuite';
import HowItWorks from './components/HowItWorks';
import B2BServices from './components/B2BServices';
import RevenueCalculator from './components/RevenueCalculator';
import AutoReconciliation from './components/AutoReconciliation';
import HospitalSearch from './components/HospitalSearch';
import ClaimTracker from './components/ClaimTracker';
import EmergencyForm from './components/EmergencyForm';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';

function useRoute() {
  const [route, setRoute] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return route;
}

function App() {
  const route = useRoute();

  if (route === '/admin') {
    return <AdminPanel />;
  }

  return (
    <div className="relative min-h-screen bg-[#040d1a] text-white overflow-x-hidden">
      <MedicalBackground />
      <div className="relative z-10">
        <Navbar />
        <HeroMaster /> {/* <-- DYNAMIC 4-CATEGORY HERO + WHO WE ARE */}
        <ProductSuite />
        <HowItWorks />
        <B2BServices />
        <RevenueCalculator />
        <AutoReconciliation />
        <HospitalSearch />
        <ClaimTracker />
        <EmergencyForm />
        <Footer />
      </div>
      <WhatsAppButton />
    </div>
  );
}

export default App;