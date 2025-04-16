import styled from "@emotion/styled";
import { css } from "@emotion/react";

export function StyledImage(props: {
  className?: string;
  imageUrl: string;
  size: { width: number; height: number };
}) {
  const { className, imageUrl, ...other } = props;
  return (
    <ImageCase className={className} imageUrl={imageUrl} {...other}></ImageCase>
  );
}

const ImageCase = styled.div<{
  imageUrl: string;
  size: { width: number; height: number };
}>(
  ({ imageUrl, size }) => css`
    width: ${size.width}px;
    height: ${size.height}px;
    background-image: url(${imageUrl});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  `,
);
