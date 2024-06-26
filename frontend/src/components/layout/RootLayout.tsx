import { ReactNode } from 'react';
import './RootLayout.scss';
import { Outlet } from 'react-router';
import CustomDialog from '../dialog/CustomDialog';

export default function RootLayout(): ReactNode {
  return (
    <>
      <CustomDialog />
      <div className='RootLayout'>
        <aside className='RootLayout-LeftAside'/>
        <div className='RootLayout-Body'>
          <Outlet />
        </div>
        <aside className='RootLayout-RightAside'/>
      </div>
    </>
  )
}