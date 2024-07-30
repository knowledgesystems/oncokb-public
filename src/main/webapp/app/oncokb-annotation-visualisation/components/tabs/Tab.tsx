import React from 'react';

export interface TabProps {
  eventKey: string;
  title: React.ReactNode;
  children: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default Tab;
