import { CheckBar } from "../components/CheckBar/CheckBar";
import { useWindowContext } from "../context/WindowContext";
import { EmployeeType } from "../model/employee";
import { BaseCheckItemProps } from "../model/util";
import { WorkMenuLabelMap, WorkMenuListType } from "../model/workTable";
import React, { ReactNode, useEffect, useState } from "react";
import { Employee } from "./manage/Employee";
import { TetherDeposit } from "./manage/TetherDeposit";
import { Notify } from "./Notify";
import { TetherAccount } from "./manage/TetherAccount";
import { createOrUpdate, getById } from "../api/workTable";
import { ErrorAlert } from "../components/Alert/Alerts";

export interface WorkTableCheckListType extends BaseCheckItemProps {
  label: WorkMenuListType;
}

const WORK_TABLE_LABEL_LIST: WorkTableCheckListType[] = [
  { checked: false, label: "MANAGE_EMPLOYEE" },
  { checked: false, label: "REVIEW_EMPLOYEE" },
  { checked: false, label: "MANAGE_TETHER" },
  { checked: false, label: "MANAGE_TETHER_DEPOSIT" },
  { checked: false, label: "NOTIFY" },
];

export function WorkTable(props: { user: EmployeeType }) {
  const { user } = props;

  const workMenuComponentMap: Record<WorkMenuListType, ReactNode> = {
    MANAGE_EMPLOYEE: <Employee />,
    REVIEW_EMPLOYEE: <Employee />,
    MANAGE_TETHER: <TetherAccount />,
    MANAGE_TETHER_DEPOSIT: <TetherDeposit user={user} />,
    NOTIFY: <Notify />,
  };

  const [workTableCheckList, setWorkTableCheckList] = useState<
    WorkTableCheckListType[]
  >(WORK_TABLE_LABEL_LIST);

  useEffect(() => {
    getById(user!.id).then((r) => {
      setWorkTableCheckList((prev) =>
        prev.map((work) => ({
          ...work,
          checked: (r.workMenuList as unknown as WorkMenuListType).includes(
            work.label,
          ), // ✅ 간결한 체크 로직
        })),
      );
    });
  }, [user]);

  const { windowWidth } = useWindowContext();

  useEffect(() => {
    const workMenuList = workTableCheckList
      .filter((work) => work.checked) // 1. checked가 true인 항목만 필터링
      .map((item) => item.label); // 2. 필터링된 항목에서 label만 추출

    createOrUpdate(user.id, workMenuList)
      .then()
      .catch((e) => ErrorAlert(e.message));
  }, [user.id, workTableCheckList]);

  return (
    <>
      <CheckBar<"WorkMenuLabelMap", WorkTableCheckListType>
        checkItemWidth={130}
        checkBarContainerWidth={95 * (windowWidth / 100)}
        checkListStatus={workTableCheckList}
        setCheckListStatus={setWorkTableCheckList}
        labelMapType="WorkMenuLabelMap"
        labelMap={WorkMenuLabelMap}
        justifyContent="center"
      />
      {workTableCheckList.map((checkItem) => (
        <React.Fragment key={checkItem.label}>
          {checkItem.checked ? workMenuComponentMap[checkItem.label] : null}
        </React.Fragment>
      ))}
    </>
  );
}
