import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSidebar from '../Component/DashSidebar';
import DashProfile from '../Component/DashProfile';
import DashProducts from '../Component/DashProducts';
import DashOrderLists from '../Component/DashOrderLists';

export default function DashBoard() {
  const location = useLocation()
  const [ tab, setTab ] = useState('')
  useEffect(() => {
    const urlparams = new URLSearchParams(location.search);
    const tabFromUrl = urlparams.get('tab');
    if(tabFromUrl)
    {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
    <div className='md:w-56'>
      {/* Sliebar*/}
      <DashSidebar />
    </div>
      {/* profile ...*/}
      {tab === 'profile' && <DashProfile />}
      {/* product... */}
      {tab === 'product' && <DashProducts /> }
      {/* order... */}
      {tab === 'orderlist' && <DashOrderLists /> }
  </div>
  )
}
