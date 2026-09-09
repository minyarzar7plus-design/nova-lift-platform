import ProductGrid from '../components/starting/ProductGrid';
import Gauge from '../components/starting/Gauge';
import NoticeBox from '../components/starting/NoticeBox';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';

export default function Starting() {
  return (
    <main className="shell">
      <Header />
      <div className="pb-24 pt-4">
        <Gauge />
        <NoticeBox />
        <ProductGrid />
      </div>
      <BottomNav />
    </main>
  );
}
