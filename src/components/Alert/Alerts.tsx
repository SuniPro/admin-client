import toast from "react-hot-toast";
import styled from "@emotion/styled";
import Button from "@mui/material/Button";

export function ErrorAlert(message: string): void {
  toast.error(message);
}

export function SuccessAlert(message: string): void {
  toast.success(message);
}

export function ConfirmAlert(message: string, func: () => void): void {
  toast((t) => (
    <ConfirmAlertContainer>
      <span>{message}</span>
      <ConfirmFuncBox>
        <Button
          variant="outlined"
          size="small"
          onClick={() => toast.dismiss(t.id)}
        >
          NO
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => {
            toast.dismiss(t.id);
            func(); // ✅ YES 누르면 실행
          }}
        >
          YES
        </Button>
      </ConfirmFuncBox>
    </ConfirmAlertContainer>
  ));
}

const ConfirmAlertContainer = styled.div`
  width: 350px;
  gap: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ConfirmFuncBox = styled.div`
  width: 50%;
  justify-content: space-between;
  align-items: center;
  display: flex;
  flex-direction: row;
`;
