import { EmployeeType } from "../model/employee";
import { useQuery } from "@tanstack/react-query";
import { getNotifyByLevel } from "../api/notify";
import { NotifyList } from "../components/Notify/NotifyList";

export function Notify(props: { user: EmployeeType }) {
  const { user } = props;
  const { data: notifyListByLevel } = useQuery({
    queryKey: ["getNotifyByLevel"],
    queryFn: () => getNotifyByLevel(user.level),
    refetchInterval: 10000,
  });

  if (!notifyListByLevel) return;

  return (
    <>
      <NotifyList user={user} notifyList={notifyListByLevel}></NotifyList>
    </>
  );
}
