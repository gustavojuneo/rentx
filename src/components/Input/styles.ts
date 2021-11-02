import { RFValue } from 'react-native-responsive-fontsize';
import { TextInput } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  height: 56px;

  flex-direction: row;
`;

export const IconContainer = styled.View`
  width: 56px;
  height: 100%;
  margin-right: 2px;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.background_secondary};
`;

export const InputText = styled(TextInput)`
  flex: 1;
  height: 100%;
  font-size: ${RFValue(15)}px;
  font-family: ${({ theme }) => theme.fonts.primary_400};
  padding: 0 24px;

  background-color: ${({ theme }) => theme.colors.background_secondary};
`;
