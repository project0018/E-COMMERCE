import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

export default function SignIn() {

  const [formData, setformData] = useState({});
  const { loading, error: errorMessage } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
    const handleChange = (e) => {
      setformData({...formData, [e.target.id]: e.target.value.trim() });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if(!formData.email || !formData.password)
      {
        return dispatch(signInFailure('Please fill out all feilds.'));
      }
  
      try {
        dispatch(signInStart());
        const res = await fetch('/api/auth/signin', {
          method:'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(formData),
         });
  
         const data = await res.json();
        if(data.success === false)
        {
          dispatch(signInFailure(data.message)); 
        }
        if(res.ok)
          {
           dispatch(signInSuccess(data));
           navigate('/');
          }
      } catch (error) {
        dispatch(signInFailure(error.message));
      }
    }

  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-gray-100'>
      {/* Main Container */}
      <div className='w-full max-w-md lg:max-w-lg p-6 lg:p-8 rounded-3xl shadow-lg bg-white'>
        {/* Sign In Title */}
        <div className='text-3xl font-bold text-center mb-6 border rounded-xl p-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white'>
          Sign In
        </div>

        {/* Form Layout: Row on Laptop, Column on Mobile */}
        <div className='space-y-6'>
          <form onSubmit={handleSubmit}>
            {/* E-mail Row */}
          <div className='flex flex-col md:flex-row md:items-center mb-4 md:mb-6'>
            <Label className='md:w-1/3 whitespace-nowrap font-semibold text-1xl' value='Your E-mail' />
            <TextInput
              id='email'
              type='email'
              className='flex-grow mt-2 md:mt-0 md:ml-4 w-full' // Full width on all screens
              placeholder='Enter your email...'
              required
              onChange={handleChange}/>
          </div>

          {/* Password Row */}
          <div className='flex flex-col md:flex-row md:items-center mb-4 md:mb-6'>
            <Label className='md:w-1/3 whitespace-nowrap font-semibold text-1xl' value='Your Password' />
            <TextInput
              id='password'
              type='password'
              className='flex-grow mt-2 md:mt-0 md:ml-4 w-full' // Full width on all screens
              placeholder='Enter your password...'
              required
              onChange={handleChange}/>
          </div>

          {/* Sign In Button Row */}
          <div className='flex justify-center' disabled={loading}>
                    <Button type='submit'
                     className='w-full md:w-3x/3 text-white font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-purple-500 hover:to-indigo-500' disabled={loading}>
                     {
                loading ? (
                  <>
                  <Spinner size='sm'/>
                  <span className='pl-3'>loading...</span>
                  </>
                ) : ('Sign In') 
              }
                    </Button>
                  </div>
          </form>
          

          {/* Sign Up Link */}
          <div className='flex justify-center mt-5'>
            <div className='text-sm'>
              <span>Don't Have an Account? </span>
              <Link to='/sign-up' className='text-blue-500 hover:underline'>
                Sign Up
              </Link>
            </div>
          </div>
          {
            errorMessage &&(
              <Alert className='mt-5' color='failure'>
                { errorMessage }
              </Alert>
            )
          } 
        </div>
      </div>
    </div>
  );
}
