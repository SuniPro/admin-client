import { useQuery } from "@tanstack/react-query";
import { getNotifyByLevel } from "../api/notify";
import { EmployeeType } from "../model/employee";
import { NotifyList } from "../components/Notify/NotifyList";

export function Notice(props: { user: EmployeeType }) {
  const { user } = props;
  const { data: notifyListByLevel } = useQuery({
    queryKey: ["getNotifyByLevel"],
    queryFn: () => getNotifyByLevel(user.level),
    refetchInterval: 10000,
  });

  if (!notifyListByLevel) return;

  return (
    <>
      <NotifyList notifyList={notifyListByLevel}></NotifyList>
    </>
  );
}
