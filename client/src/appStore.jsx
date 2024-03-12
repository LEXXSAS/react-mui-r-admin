import {create} from 'zustand';
import {persist} from 'zustand/middleware';

let appStore = (set) => ({
  smallmenu: null,
  dopen: false,
  dopenfscrn: false,
  selectedIndex: 0,
  setSelectedIndex: (selectedIndex) => set(() => ({selectedIndex:selectedIndex})),
  updateOpen:(dopen) => set(() => ({dopen:dopen})),
  setSmallMenu:(smallmenu) => set(() => ({smallmenu:smallmenu})),
  updateOpenfscrn:(dopenfscrn) => set(() => ({dopenfscrn:dopenfscrn}))
});

appStore = persist (appStore, {name: "my_app_store"});
export const useAppStore = create(appStore);
