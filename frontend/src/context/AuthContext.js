import { createContext, useContext } from 'react';
const AuthContext = createContext({ user: { name: 'Alex Morgan', level: 'VIP 2', score: 98 } });
export const useAuth = () => useContext(AuthContext);
export { AuthContext };
