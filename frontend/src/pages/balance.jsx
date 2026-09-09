import Overview from '../components/balance/Overview';
import Analytics from '../components/balance/Analytics';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';

export default function Balance() {
  return (
    <main className="shell">
      <Header />
      <div className="pb-24 pt-4">
        <Overview />
        <Analytics />
      </div>
      <BottomNav />
    </main>
  );
}
