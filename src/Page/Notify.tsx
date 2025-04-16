import styled from "@emotion/styled";
import { Editor } from "../components/Lexical/Editor";
import { Container } from "../components/layouts/Frames/FrameLayouts";

export function Notify() {
  // useQuery({
  //     queryKey:
  // });
  return (
    <NotifyContainer>
      <ContentsContainer></ContentsContainer>
      <Editor />
    </NotifyContainer>
  );
}

const NotifyContainer = styled(Container)`
  width: 100%;
  margin-top: 5.2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;

const ContentsContainer = styled(Container)`
  width: 90%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;
