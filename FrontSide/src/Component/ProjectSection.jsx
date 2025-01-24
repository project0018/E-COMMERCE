import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, FileInput, Label, Modal, Textarea, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import Project  from './Project.jsx';

export default function ProjectSection({ projectId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [project, setProject] = useState({ title: '', description: '', location: '', image: '' });
  const [projectError, setProjectError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const navigate = useNavigate();

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
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
            setProject((prev) => ({ ...prev, image: downloadURL }));
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/project/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          description: project.description,
          location: project.location,
          image: project.image,
          userId: currentUser._id, 
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setProjects([data, ...projects]); 
        setProject(''); 
        setShowModal(false); 
      } else {
        const errorData = await res.json();
        setProjectError(errorData.message || 'Failed to create project');
      }
    } catch (error) {
      setProjectError('Something went wrong');
      console.error(error);
    }
  };


  useEffect(() => {
      const getProjects = async () => {
        try {
          const res = await fetch(`/api/project/getProjectDetail/${projectId}`);
          if (res.ok) {
            const data = await res.json();
            setProjects(data);
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      getProjects();
    }, [projectId]);

  return (
    <div>
      <div>
      <div className="flex flex-row justify-between mb-5">
        <Label className="text-3xl">Project Details</Label>
        {currentUser && currentUser._id === projectId && (
          <Button gradientDuoTone="purpleToBlue" onClick={() => setShowModal(true)}>
            Update New Project Detail
          </Button>
        )}
      </div>
      <div>
        { projects.length === 0 ? (
          <p>No projects detail not yet</p>
        ):(
          <>
          { projects.map((project) =>(
            <Project key={project._id}
                     image={project.image}
                     title={project.title}
                     location={project.location}
                     description={project.description} 
                      />
          ))}
          </>
        )}
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div>
              <Label>Project Image:</Label>
              <FileInput type="file" className="mt-1 w-full p-2" onChange={(e) => setFile(e.target.files[0])} />
              <Button onClick={handleUploadImage} className="my-2 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200">
                Upload Image
              </Button>
              {imageUploadProgress && <p>Uploading: {imageUploadProgress}%</p>}
              {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
              {project.image && <img src={project.image} alt="Project" className="w-full h-72 object-cover my-2" />}
              <div className='flex flex-col'>
              <Label>Project Title:</Label>
              <TextInput
                type="text"
                className="mt-1 w-full p-2"
                value={project.title}
                onChange={(e) => setProject({ ...project, title: e.target.value })}
                required
              />
              </div>
              <div className='flex flex-col'>
              <Label>Project Location:</Label>
              <TextInput
                type="text"
                className="mt-1 w-full p-2"
                value={project.location}
                onChange={(e) => setProject({ ...project, location: e.target.value })}
                required
              />
              </div>
              <div className='flex flex-col'>
              <Label>Project Description:</Label>
              <Textarea
                className="mt-1 w-full p-2 h-48"
                value={project.description}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
                required
              />
              </div>
              <div className="flex justify-between mt-4">
                <Button className='text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300' type="submit">
                  Submit
                </Button>
                <Button className='text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300' onClick={() => setShowModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </form>
          {projectError && <Alert color="failure" className="mt-4">{projectError}</Alert>}
        </Modal.Body>
      </Modal>
    </div>
  );
}
