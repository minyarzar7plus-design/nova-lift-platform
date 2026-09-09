import { useState } from 'react';
import OrderList from '../components/record/OrderList';
import StatusTabs from '../components/record/StatusTabs';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';

export default function Record() {
  const [active, setActive] = useState('All');
  return (
    <main className="shell">
      <Header />
      <div className="pb-24 pt-4">
        <StatusTabs active={active} setActive={setActive} />
        <div className="mt-4">
          <OrderList status={active} />
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
