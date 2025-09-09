import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function useRefetchDeposits(queryKeys: string[][]) {
  const queryClient = useQueryClient();

  return useCallback(() => {
    void Promise.all(
      queryKeys.map((key) =>
        queryClient.refetchQueries({
          queryKey: key,
          exact: false,
          type: "active",
        }),
      ),
    );
  }, [queryClient, queryKeys]);
}
