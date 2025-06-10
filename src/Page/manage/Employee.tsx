import { useState } from "react";
import { EmployeeAnalysisPanel } from "../../components/analysis/Employee";
import { useUserContext } from "../../context/UserContext";
import { EmployeeList } from "../../components/list/employee/EmployeeList";
import { EmployeeType } from "../../model/employee";

export function Employee() {
  const { user } = useUserContext();

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType>({
    id: 0,
    department: "OFFICE",
    level: "STAFF",
    name: "",
    insertName: "",
    insertDateTime: "",
    updateName: "",
    updateDateTime: "",
    deleteName: "",
    deleteDateTime: "",
  });

  if (!user) return;

  return (
    <>
      <EmployeeAnalysisPanel user={user} employee={selectedEmployee} />
      <EmployeeList
        user={user}
        selectedEmployeeState={{
          selectedEmployee,
          setSelectedEmployee,
        }}
      ></EmployeeList>
    </>
  );
}
