import { getAllSite } from "@/api/site";
import { EmployeeList } from "@/components/list/admin/EmployeeList";
import { SiteList } from "@/components/list/admin/SiteList";
import { useEmployeeContext } from "@/context/EmployeeContext";
import { useQuery } from "@tanstack/react-query";

export function Admin() {
  const { employee } = useEmployeeContext();

  const { data: siteList, refetch } = useQuery({
    queryKey: ["getAllSite"],
    queryFn: () => getAllSite(employee!.level),
    refetchInterval: 10000,
    enabled: Boolean(employee),
  });

  if (!employee) return;

  return (
    <>
      <EmployeeList employee={employee} />
      {siteList && <SiteList siteList={siteList} refetch={refetch} />}
    </>
  );
}
