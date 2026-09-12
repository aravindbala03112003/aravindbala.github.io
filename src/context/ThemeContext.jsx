import { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext({ theme: 'dark' });

export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.classList.add('dark');
    try {
      localStorage.removeItem('theme');
      localStorage.removeItem('portfolio-theme');
      sessionStorage.removeItem('theme');
      sessionStorage.removeItem('portfolio-theme');
    } catch (e) {}
  }, []);

  return <ThemeContext.Provider value={{ theme: 'dark' }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
