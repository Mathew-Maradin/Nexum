import { styled } from "styled-components";

export const DatasetDescriptionContainer = styled.div`
  position: relative;
  bottom: 300px;
  width: calc(300px - 4rem);
  padding: 2rem;
  background-image: linear-gradient(to bottom, rgb(255, 255, 255, 0), rgb(0,0,0, 0.8));
  height: calc(300px - 4rem);

  display: flex;
  flex-direction: column-reverse;
  border-radius: 12px;
  overflow: hidden;
`

export const DatasetDescriptionInnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const BadgeContainer = styled.div`
  margin-top: 2px;
  margin-left: 4px;
`