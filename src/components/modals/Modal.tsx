import React from 'react';
import RNModal, { type ModalProps } from 'react-native-modal';

interface Props extends ModalProps {}

export const Modal: React.FC<Props> = ({ children, ...rest }) => {
  return <RNModal {...rest}>{children}</RNModal>;
};
