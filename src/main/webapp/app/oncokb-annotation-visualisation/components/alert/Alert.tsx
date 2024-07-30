import React from 'react';
import './Alert.scss';

interface AlertProps {
  variant: 'danger' | 'primary' | 'warning' | 'success';
  children: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({ variant, children }) => {
  return <div className={`alert alert-${variant}`}>{children}</div>;
};

export default Alert;
