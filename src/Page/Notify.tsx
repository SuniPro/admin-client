import { useQuery } from "@tanstack/react-query";
import {
  getAllNotifyList,
  getNotifyListByReadEmployee,
  getNotifyListByUnReadEmployee,
} from "../api/notify";
import { NotifyList } from "../components/Notify/NotifyList";
import { useEmployeeContext } from "../context/EmployeeContext";
import { useState } from "react";

export function Notify() {
  const { employee } = useEmployeeContext();

  const [all, setAll] = useState<boolean>(false);
  const [notifyType, setNotifyType] = useState<"read" | "unread">("unread");

  const { data: notifyListByLevel } = useQuery({
    queryKey: ["getNotifyByLevel", notifyType],
    queryFn: () => {
      if (all) {
        return getAllNotifyList();
      } else {
        if (notifyType === "read") {
          return getNotifyListByReadEmployee();
        } else {
          return getNotifyListByUnReadEmployee();
        }
      }
    },
    refetchInterval: 300000,
    enabled: Boolean(employee),
  });

  if (!notifyListByLevel || !employee) return;

  return (
    <>
      <NotifyList
        employee={employee}
        notifyList={notifyListByLevel}
        notifyTypeState={{ notifyType, setNotifyType }}
        allState={{ all, setAll }}
      />
    </>
  );
}
