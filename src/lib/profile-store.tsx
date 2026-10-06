import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_PROFILE, type Profile } from "./matching";

const KEY = "smarthire.profile";
const Ctx = createContext<{ profile: Profile; setProfile: (p: Profile) => void } | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setState] = useState<Profile>(DEFAULT_PROFILE);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...DEFAULT_PROFILE, ...JSON.parse(raw) });
    } catch {}
  }, []);
  const setProfile = (p: Profile) => {
    setState(p);
    localStorage.setItem(KEY, JSON.stringify(p));
  };
  return <Ctx.Provider value={{ profile, setProfile }}>{children}</Ctx.Provider>;
}

export function useProfile() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useProfile outside provider");
  return c;
}
