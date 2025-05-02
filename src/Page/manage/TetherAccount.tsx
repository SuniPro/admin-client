import { useState } from "react";
import { TetherAccountList } from "../../components/Tether/TetherAccountList";
import { useUserContext } from "../../context/UserContext";

export function TetherAccount() {
  const { user } = useUserContext();
  const [selectedId, setSelectedId] = useState<number>(0);

  if (!user) return;

  return (
    <TetherAccountList
      user={user}
      selectedIdState={{
        selectedId,
        setSelectedId,
      }}
    />
  );
}
