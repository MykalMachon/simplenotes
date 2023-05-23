import React, { ReactNode } from 'react';

type MainLayoutProps = {
  children?: ReactNode;
}

import NavBar from './NavBar';

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="layout layout--main">
      <NavBar />
      <main className="main">{children}</main>
    </div>
  );
};

export default MainLayout;
