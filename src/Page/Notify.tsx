import { useQuery } from "@tanstack/react-query";
import { getNotifyByLevel } from "../api/notify";
import { NotifyList } from "../components/Notify/NotifyList";
import { useUserContext } from "../context/UserContext";

export function Notify() {
  const { user } = useUserContext();
  const { data: notifyListByLevel } = useQuery({
    queryKey: ["getNotifyByLevel"],
    queryFn: () => getNotifyByLevel(user!.level),
    refetchInterval: 10000,
    enabled: Boolean(user),
  });

  if (!notifyListByLevel || !user) return;

  return (
    <>
      <NotifyList user={user} notifyList={notifyListByLevel}></NotifyList>
    </>
  );
}
