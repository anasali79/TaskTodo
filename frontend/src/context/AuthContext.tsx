import { createContext, useState, useEffect, type ReactNode } from 'react';

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}

interface AuthContextType {
  userInfo: UserInfo | null;
  login: (data: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  userInfo: null,
  login: () => { },
  logout: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.token) {
          localStorage.setItem('token', parsed.token);
        }
        setUserInfo(parsed);
      } catch (e) {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (data: any) => {
    const token = data.token || data.data?.token;
    if (token) {
      localStorage.setItem('token', token);
    }
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUserInfo(data);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};