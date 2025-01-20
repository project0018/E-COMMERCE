import { Alert, Button, Label, Spinner, TextInput, Textarea } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {

const [formData, setformData] = useState({});
const [errorMessage, setErrorMessage] = useState(null);
const [loading, setLoading] = useState(false);
const navigate = useNavigate();

  const handleChange = (e) => {
    setformData({...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.companyname || !formData.username || !formData.email || !formData.password || !formData.role || !formData.address || !formData.description || !formData.contactno )
    {
      return setErrorMessage('Please fill out all feilds.');
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
       });

       const data = await res.json();
      if(data.success === false)
      {
       return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok)
        {
         navigate('/sign-in');
        }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }
  
  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-gray-100'>
      {/* Main Container */}
      <div className='w-full max-w-md lg:max-w-lg p-6 lg:p-8 rounded-3xl shadow-lg bg-white'>
        {/* Sign Up Title */}
        <div className='text-3xl font-bold text-center mb-6 border rounded-xl p-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white'>
          Sign Up
        </div>

        {/* Form Layout: Row on Laptop, Column on Mobile */}
        <div className='space-y-6'>
              <form onSubmit={handleSubmit}> 
                  {/* Company Name Row */}
                  <div className='flex flex-col md:flex-row md:items-center mb-4 md:mb-6'>
                    <Label className='md:w-1/3 whitespace-nowrap font-semibold text-1xl' value='Company Name' />
                      <TextInput
                          id='companyname'
                          type='text'
                          className='flex-grow mt-2 md:mt-0 md:ml-4 w-full'
                          placeholder='Enter your Company Name...'
                          required
                          onChange={handleChange}/>
                  </div>

                  {/* Name Row */}
                  <div className='flex flex-col md:flex-row md:items-center mb-4 md:mb-6'>
                        <Label className='md:w-1/3 whitespace-nowrap font-semibold text-1xl' value='Name' />
                        <TextInput
                          id='username'
                          type='text'
                          className='flex-grow mt-2 md:mt-0 md:ml-4 w-full'
                          placeholder='Enter your Name...'
                          required
                          onChange={handleChange}/>
                  </div>

                   {/* E-mail Row */}
                   <div className='flex flex-col md:flex-row md:items-center mb-4 md:mb-6'>
                       <Label className='md:w-1/3 whitespace-nowrap font-semibold text-1xl' value='E-mail' />
                      <TextInput
                         id='email'
                         type='email'
                         className='flex-grow mt-2 md:mt-0 md:ml-4 w-full'
                         placeholder='Enter your email...'
                         required
                         onChange={handleChange}/>
                    </div>

                    {/* Password Row */}
                    <div className='flex flex-col md:flex-row md:items-center mb-4 md:mb-6'>
                       <Label className='md:w-1/3 whitespace-nowrap font-semibold text-1xl' value='Password' />
                          <TextInput
                            id='password'
                            type='password'
                            className='flex-grow mt-2 md:mt-0 md:ml-4 w-full'
                            placeholder='Enter your password...'
                            required
                            onChange={handleChange}/>
                    </div>

                    {/* Radio Buttons for Buyer or Seller */}
                    <div className='flex flex-col md:flex-row md:items-center mb-4 md:mb-6 lg:flex-col'>
                       <Label className='md:w-1/3 whitespace-nowrap font-semibold text-1xl mb-3' value='Are you a Buyer or Seller?' />
                       <div className='flex-grow mt-2 md:mt-0 md:ml-4 w-full flex items-center justify-center'>
                          <div className='flex items-center mr-4'>
                            <input
                              type='radio'
                              id='role'
                              name='role'
                              value='buyer'
                              className='mr-2'
                              required 
                              onChange={handleChange}/>
                            <Label>Buyer</Label>
                         </div>
                         <div className='flex items-center'>
                          <input
                            type='radio'
                            id='role'
                            name='role'
                            value='seller'
                            className='mr-2'
                            required
                            onChange={handleChange}/>
                         <Label>Seller</Label>
                         </div>
                       </div>
                    </div>

                   {/* Address Textarea */}
                   <div className='flex flex-col md:flex-row md:items-center mb-4 md:mb-6'>
                      <Label className='md:w-1/3 whitespace-nowrap font-semibold text-1xl' value='Address' />
                      <Textarea
                        id='address'
                        rows={3}
                        className='flex-grow mt-2 md:mt-0 md:ml-4 w-full'
                        placeholder='Enter your Address...'
                        required
                        onChange={handleChange}/>
                    </div>

                    {/* Company Description Textarea */}
                   <div className='flex flex-col md:flex-row md:items-center mb-4 md:mb-6'>
                     <Label className='md:w-1/3 whitespace-nowrap font-semibold text-1xl' value='Company Description' />
                     <Textarea
                       id='description'
                       rows={3}
                       className='flex-grow mt-2 md:mt-0 md:ml-4 w-full'
                       placeholder='Describe your company...'
                       required
                       onChange={handleChange}/>
                   </div>

                   {/* Contact Number Row */}
                  <div className='flex flex-col md:flex-row md:items-center mb-4 md:mb-6'>
                    <Label className='md:w-1/3 whitespace-nowrap font-semibold text-1xl' value='Contact Number' />
                    <TextInput
                      id='contactno'
                      type='text'
                      className='flex-grow mt-2 md:mt-0 md:ml-4 w-full'
                      placeholder='Enter your Contact Number...'
                      required
                      onChange={handleChange}/>
                 </div>

                 {/* Sign Up Button Row */}
                 <div className='flex justify-center' disabled={loading}>
                    <Button type='submit'
                     className='w-full md:w-3x/3 text-white font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-purple-500 hover:to-indigo-500' disabled={loading}>
                     {
                loading ? (
                  <>
                  <Spinner size='sm'/>
                  <span className='pl-3'>loading...</span>
                  </>
                ) : ('Sign Up') 
              }
                    </Button>
                  </div>
              </form>
          

          {/* Sign In Link */}
          <div className='flex justify-center mt-5'>
            <div className='text-sm'>
              <span>Already have an account? </span>
              <Link to='/sign-in' className='text-blue-500 hover:underline'>
                Sign In
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
