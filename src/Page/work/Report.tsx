/** @jsxImportSource @emotion/react */
import { useUserContext } from "../../context/UserContext";
import { ReportList } from "../../components/list/ReportList";

export function Reports() {
  const { user } = useUserContext();

  if (!user) return;

  return (
    <>
      <ReportList user={user} />
    </>
  );
}
