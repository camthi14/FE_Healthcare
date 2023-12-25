import { useEffect } from "react";
import { useCurrentTabSelector } from "~/features/app";
import { useAuth } from "~/features/auth";
import {
  generateSession,
  getAccessSessions,
  getPathAuthLogin,
  setAccessSessions,
  setLastSession,
} from "~/helpers";

export const useBeforeUnload = () => {
  const { session, role } = useAuth();
  const currentTab = useCurrentTabSelector();

  useEffect(() => {
    if (!session || !role) return;

    window.onbeforeunload = (event) => {
      event.preventDefault();

      console.log(`beforeUnload`);

      const accessSessions = getAccessSessions();

      if (!accessSessions || !accessSessions?.length) return;

      let _lastSession = `${+generateSession() + currentTab}`;

      const path = getPathAuthLogin(role);
      let index = accessSessions.findIndex((t) => t.session === session || t.path === path);

      console.log(`index`, index);

      if (index === -1) {
        accessSessions.push({ path, session: _lastSession });
      } else {
        accessSessions[index] = {
          ...accessSessions[index],
          session: _lastSession,
        };
      }

      setAccessSessions(accessSessions);
      setLastSession(_lastSession);
      console.log(`set LocalStorage _lastSession and accessSessions`);
    };
  }, [session, role, currentTab]);
};
