import { createContext, useContext, useState } from 'react';
const WalletContext = createContext();
export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState({ balance: 1240.5, profits: 182.24, frozen: 0, completed: 12, total: 20 });
  return <WalletContext.Provider value={{ wallet, setWallet }}>{children}</WalletContext.Provider>;
}
export const useWallet = () => useContext(WalletContext);
