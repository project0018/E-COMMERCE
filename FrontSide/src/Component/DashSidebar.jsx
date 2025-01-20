import { Sidebar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiArrowSmRight, HiDocumentText, HiUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';

export default function DashSidebar() {
  const location = useLocation();
  const [ tab, setTab ] = useState('');
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);


  useEffect(() => {
    const urlparams = new URLSearchParams(location.search);
    const tabFromUrl = urlparams.get('tab');
    if(tabFromUrl)
    {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
        const res = await fetch('/api/user/signout', {
          method: 'POST',
        });
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
            dispatch(signoutSuccess());
        }
      } catch (error) {
        console.log(error.message);
      }
  };
  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.role=="seller" ? 'Seller':'Buyer'} labelColor='dark' as='div' className='mb-2'>
                      Profile
                    </Sidebar.Item>
                </Link>
                {currentUser.role=="seller" && (
                  <>
                  <Link to='/dashboard?tab=product'>
                  <Sidebar.Item active={tab === 'product'} icon={HiDocumentText} as='div' className='mb-2'>
                    Created Poducts
                  </Sidebar.Item>
                  </Link>
                  <Link to='/dashboard?tab=orderlist'>
                  <Sidebar.Item active={tab === 'orderlist'} icon={HiDocumentText} as='div' className='mb-2'>
                    Ordered Lists
                  </Sidebar.Item>
                  </Link>
                  </>
                )}

                <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>
                  Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
 