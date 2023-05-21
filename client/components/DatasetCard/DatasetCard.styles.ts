import { styled } from "styled-components";

export const DatasetDescriptionContainer = styled.div`
  position: relative;
  bottom: 300px;
  width: calc(100% - 4rem);
  padding: 2rem;
  background-image: linear-gradient(to bottom, rgb(255, 255, 255, 0), rgb(0,0,0, 0.8));
  height: calc(300px - 4rem);

  display: flex;
  flex-direction: column-reverse;
`