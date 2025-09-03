import { EmployeeList } from "@/components/list/admin/EmployeeList";
import { SiteList } from "@/components/list/admin/SiteList";
import { useEmployeeContext } from "@/context/UserContext";

export function Admin() {
  const { employee } = useEmployeeContext();

  if (!employee) return;

  return (
    <>
      <EmployeeList employee={employee} />
      <SiteList />
    </>
  );
}
