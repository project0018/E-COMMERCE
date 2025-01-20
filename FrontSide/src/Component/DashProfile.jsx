import { Alert, Button, Modal, Textarea, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutSuccess } from '../redux/user/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';


export default function DashProfile() {

  const { currentUser, error, loading } = useSelector(state => state.user);
  const [ formData, setFormData ] = useState({});
  const [ imageFile, setImageFile ] = useState(null);
  const [ imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const filePickerRef = useRef();

  console.log(imageFileUploadProgress, imageFileUploadError);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
        setUpdateUserError('No changes made');
        return;
    }
    if (imageFileUploading) {
        setUpdateUserError('Please wait for image to upload');
        return;
    }
    try {
        dispatch(updateStart());
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          const data =await res.json();
          if (!res.ok) {
            dispatch(updateFailure(data.message));
            setUpdateUserError(data.message);
          }
          else{
            dispatch(updateSuccess(data));
            setUpdateUserSuccess("User's profile updated successfully");
          }
    } catch (error) {
        dispatch(updateFailure(error.message));
        setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
  if (!res.ok) {
    dispatch(deleteUserFailure(data.message));
  } else {
    dispatch(deleteUserSuccess(data));
  } 
    } catch (error) {
        dispatch(deleteUserFailure(error.message));
    }
  };

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file));
    }
};

useEffect(() => {
  if (imageFile) {
      uploadImage();
  }
}, [imageFile]);

const uploadImage = async () => {

  const storage = getStorage(app);
  const fileName = new Date().getTime() + imageFile.name;
  const storageRef = ref(storage, fileName);
  const uploadTask =  uploadBytesResumable(storageRef, imageFile);

  uploadTask.on(
    'state_changed',
    (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
         setImageFileUploadProgress(progress.toFixed(0));
    },
    (error) => {
         setImageFileUploadError('Could not upload the image (File must be less than 2MB)');
         setImageFileUploadProgress(null);
         setImageFile(null);
         setImageFileUrl(null);
         setImageFileUploading(false);
    },
    () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL);
            setFormData({...formData, profilePicture: downloadURL });
            setImageFileUploading(false);
        });
    }
);

}; 
  
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
        <div className='w-32 h-32 self-center shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>
                    <img 
                        src={ imageFileUrl || currentUser.profilePicture} 
                        alt="user" 
                        className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' 
                    />
        </div>
        {imageFileUploadError && ( <Alert color='failure'>{imageFileUploadError}</Alert>)}
        <TextInput type='text' id='companyname' placeholder='CompanyName' defaultValue={currentUser.companyname} onChange={handleChange}/>
        <TextInput type='text' id='username' placeholder='UserName' defaultValue={currentUser.username} onChange={handleChange}/>
        <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} onChange={handleChange}/>
        <TextInput type='password' id='password' placeholder='Password' onChange={handleChange}/>
        <TextInput type='text' id='role' placeholder='Role' defaultValue={currentUser.role} onChange={handleChange}/>
        <Textarea id='address' rows={3} placeholder='Address' defaultValue={currentUser.address} onChange={handleChange}/>
        <Textarea id='description' rows={3} placeholder='Description' defaultValue={currentUser.description} onChange={handleChange}/>
        <TextInput id='contactno' type='text' placeholder='Contact No' defaultValue={currentUser.contactno} onChange={handleChange}/>
        <Button
          type="submit"
          className="w-full rounded-full p-1" gradientDuoTone='purpleToBlue' disabled={loading}>
          {loading ? 'Loading...': 'Update the detail'}
          
        </Button>
        {currentUser.role=="seller" && (
          <Link to={'/createproduct'}>
            <Button type='button' gradientDuoTone='purpleToPink' className='w-full rounded-full p-1'>
              Create the Product
            </Button>
          </Link>
        )}
      </form>
      <div className='text-red-500 flex justify-between mt-3'>
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete the Account</span>
        <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess && ( <Alert color='success' className='mt-5'> {updateUserSuccess} </Alert> )}
      {updateUserError && ( <Alert color='failure' className='mt-5'> {updateUserError} </Alert> )}
      {error && ( <Alert color='failure' className='mt-5'> {error} </Alert> )}
      <Modal
             show={showModal}
             onClose={() => setShowModal(false)}
             popup
             size='md'>
                <Modal.Header />
                <Modal.Body>
                   <div className='text-center'>
                     <HiOutlineExclamationCircle className='w-14 h-14 text-gray-500 dark:text-gray-200 mb-4 mx-auto' />
                     <h3 className='mb=5 text-lg text-gray-500 dark:text-gray-200'>
                        Are you sure you want to delete your account?
                     </h3>
                     <div className='flex justify-center gap-4'>
                       <Button color='failure' onClick={handleDeleteUser} className='bg-red-500'>
                           Yes, I'm sure
                       </Button>
                       <Button color='gray' onClick={() => setShowModal(false)}>
                           No, cancel
                       </Button>
                     </div>
                   </div>
                </Modal.Body>
            </Modal>
    </div>
  )
}
