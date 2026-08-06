import ProductGrid from '../components/starting/ProductGrid';
import Gauge from '../components/starting/Gauge';
import NoticeBox from '../components/starting/NoticeBox';

export default function Starting() {
  return (
    <div>
      <Gauge />
      <NoticeBox />
      <ProductGrid />
    </div>
  );
}
