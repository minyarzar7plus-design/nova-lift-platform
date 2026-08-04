import '../styles/globals.css';
import { WalletProvider } from '../context/WalletContext';
export default function App({ Component, pageProps }) { return <WalletProvider><Component {...pageProps} /></WalletProvider>; }
