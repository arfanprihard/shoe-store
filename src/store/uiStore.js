import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set) => ({
      isDarkMode: false,
      isSidebarOpen: false,
      toast: null,

      toggleDark: () => set(s => ({ isDarkMode: !s.isDarkMode })),
      setSidebar: (v) => set({ isSidebarOpen: v }),
      showToast: (message, type = 'success') => {
        set({ toast: { message, type, id: Date.now() } });
        setTimeout(() => set({ toast: null }), 3000);
      },
    }),
    { name: 'shoe-ui', partialize: (s) => ({ isDarkMode: s.isDarkMode }) }
  )
);
