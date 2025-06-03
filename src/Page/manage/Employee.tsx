import { useState } from "react";
import { EmployeeAnalysisPanel } from "../../components/analysis/Employee";
import { useUserContext } from "../../context/UserContext";
import { EmployeeList } from "../../components/list/EmployeeList";

export function Employee() {
  const { user } = useUserContext();

  const [selectedId, setSelectedId] = useState<number>(2);

  if (!user) return;

  return (
    <>
      <EmployeeAnalysisPanel user={user} employeeId={selectedId} />
      <EmployeeList
        selectedIdState={{
          selectedId,
          setSelectedId,
        }}
      ></EmployeeList>
    </>
  );
}
