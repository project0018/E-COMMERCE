import { useState } from 'react';
import { Alert, Button, FileInput, Select, Textarea, TextInput } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, getStorage,  ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';




export default function CreateProduct() {
  const [file, setFile] = useState(null);
const [imageUploadProgress, setImageUploadProgress] = useState(null);
const [imageUploadError, setImageUploadError] = useState(null);
const [formData, setFormData] = useState({});
const [publishError, setPublishError] = useState(null);
const navigate = useNavigate();
console.log(formData);

const handleUploadImage = async () => {
try {
    if (!file) {
        setImageUploadError('Please select an image');
        return; 
    }
    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '-' + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask =  uploadBytesResumable(storageRef, file);
    uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImageUploadProgress(null);
              setImageUploadError(null);
              setFormData({ ...formData, image: downloadURL });
            });
          });
} catch (error) {
    setImageUploadError('Image upload failed');
    setImageUploadProgress(null);
    console.log(error);  
}
};
  
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('/api/product/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) {
      setPublishError(data.message);
      return;
    }
    if (res.ok) {
      setPublishError(null);
      navigate(`/product/${data.slug}`);
    }
  } catch (error) {
    setPublishError('Something went wrong');
  }
};
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create the Product</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
       <TextInput id='companyname' placeholder='Company Name...' required className='flex-1' onChange={(e) => setFormData({ ...formData, companyname : e.target.value })}/>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput id='productname' placeholder='product Name...' required className='flex-1' onChange={(e) => setFormData({ ...formData, title : e.target.value })}/>
          <Select onChange={(e) => setFormData({ ...formData, category : e.target.value })}>
            <option value="uncategorized"> Select the Category </option>
            <option value="stone">Rock Stone</option>
            <option value="sand">Sand</option>
            <option value="steel">Steel</option>
            <option value="cement">Cement</option>
            <option value="electrical">Electrical</option>
            <option value="pipe">Pipes</option>
            <option value="paint">Color Paint</option>
            <option value="bricks">Bricks</option>
            <option value="tiles">Tiles</option>
            <option value="kadappa-stone">Kadappa Stone</option>
            <option value="paint-brush">Paint Brush</option>
            <option value="paint-secondary-items">Paint - Secondary Item</option>
            <option value="water-tank">Water Tank</option>
            <option value="M-Sand">M Sand</option>
            <option value="construction-supporting-item">Construction - Supporting Item</option>
            <option value="icon-nails">Iron Nails</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border border-teal-400 border-double p-3">
          <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])}/>
          <Button type='button' size='sm' class="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium py-2 px-4 rounded-md text-sm hover:from-blue-500 hover:to-purple-500 focus:outline-none" onClick={handleUploadImage}>Upload Image</Button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && ( <img src={formData.image} alt='upload' className='w-full h-72 object-cover' /> )}
        <TextInput id='previousprice' placeholder='Previous Price...' required className='flex-1' onChange={(e) => setFormData({ ...formData, previousprice : e.target.value })} />
        <TextInput id='price' placeholder='Price...' required className='flex-1' onChange={(e) => setFormData({ ...formData, price : e.target.value })}/>
        <TextInput id='stock' placeholder='Stock Item...' required className='flex-1' onChange={(e) => setFormData({ ...formData, stock : e.target.value })}/>
        <Textarea id='content' placeholder='Description...' required className='flex-1' rows={5} onChange={(e) => setFormData({ ...formData, content : e.target.value })}/>
        <Button type="submit" class="bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-2 px-4 rounded-md text-base hover:from-blue-500 hover:to-green-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 flex items-center justify-center">Create Product</Button>
        {publishError && ( <Alert className='mt-5' color='failure'> {publishError} </Alert> )}
      </form>
    </div>
  )
}
