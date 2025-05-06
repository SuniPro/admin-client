import { useState } from "react";
import { TetherAccountList } from "../../components/Tether/TetherAccountList";
import { useUserContext } from "../../context/UserContext";
import { TetherAccountType } from "../../model/financial";

export function TetherAccount() {
  const { user } = useUserContext();
  const [selectedAccount, setSelectedAccount] = useState<TetherAccountType>({
    id: 0,
    tetherWallet: "",
    email: "",
    insertDateTime: "",
  });

  if (!user) return;

  return (
    <TetherAccountList
      user={user}
      selectedAccountState={{
        selectedAccount,
        setSelectedAccount,
      }}
    />
  );
}
