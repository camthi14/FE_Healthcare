import { useEffect } from "react";
import { LocalStorage } from "~/constants";
import { appActions, useCurrentTabSelector } from "~/features/app";
import { getTabsOpen, setTabsOpen } from "~/helpers";
import { useAppDispatch } from "~/stores";

const useCountOpenTab = () => {
  const currentTab = useCurrentTabSelector();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const removeCountTabsOpen = () => {
      const tabsOpen = getTabsOpen();
      if (tabsOpen === 0) return;
      setTabsOpen(tabsOpen - 1);
    };

    window.addEventListener("unload", removeCountTabsOpen);

    return () => {
      window.removeEventListener("unload", removeCountTabsOpen);
    };
  }, []);

  useEffect(() => {
    function storage(e: StorageEvent) {
      console.log(`event storage`, e.key);

      if (e.key !== LocalStorage.tabsOpen || !e.newValue) return;

      const tabsOpen = parseInt(e.newValue);
      console.log(`{current, tabsOpen}`, { currentTab, tabsOpen });

      if (currentTab >= tabsOpen) {
        const newCurrentTab = currentTab - 1;
        dispatch(appActions.setCurrentTab(newCurrentTab === 0 ? 1 : newCurrentTab));
      }
    }

    window.addEventListener("storage", storage);
    return () => window.removeEventListener("storage", storage);
  }, [currentTab]);
};

export default useCountOpenTab;
