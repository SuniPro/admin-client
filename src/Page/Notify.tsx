import { useQuery } from "@tanstack/react-query";
import {
  getAllNotifyList,
  getNotifyListByReadEmployee,
  getNotifyListByUnReadEmployee,
} from "../api/notify";
import { NotifyList } from "../components/Notify/NotifyList";
import { useUserContext } from "../context/UserContext";
import { useState } from "react";

export function Notify() {
  const { user } = useUserContext();

  const [all, setAll] = useState<boolean>(false);
  const [notifyType, setNotifyType] = useState<"read" | "unread">("unread");

  const { data: notifyListByLevel } = useQuery({
    queryKey: ["getNotifyByLevel", notifyType],
    queryFn: () => {
      if (all) {
        return getAllNotifyList();
      } else {
        if (notifyType === "read") {
          return getNotifyListByReadEmployee(user!.id, user!.level);
        } else {
          return getNotifyListByUnReadEmployee(user!.id, user!.level);
        }
      }
    },
    refetchInterval: 10000,
    enabled: Boolean(user),
  });

  if (!notifyListByLevel || !user) return;

  return (
    <>
      <NotifyList
        user={user}
        notifyList={notifyListByLevel}
        notifyTypeState={{ notifyType, setNotifyType }}
        allState={{ all, setAll }}
      />
    </>
  );
}
