import { ReactNode } from 'react';
import './RootLayout.scss';
import { Outlet } from 'react-router';

function RootLayout(): ReactNode {
  return (
    <div className='RootLayout'>
      <aside className='RootLayout-LeftAside'/>
      <div className='RootLayout-Body'>
        <Outlet />
      </div>
      <aside className='RootLayout-RightAside'/>
    </div>
  )
}

export default RootLayout;
