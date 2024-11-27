import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import PhotosUploader from "../PhotosUploader";
import AdminNav from "./AdminNav";

export default function DegreeForm() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [field, setField] = useState('');
  const [description, setDescription] = useState('');
  const [emptySlots, setEmptySlots] = useState('');
  const [photos, setPhotos] = useState([]);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/admin/degrees/' + id).then(response => {
      const { data } = response;
      setTitle(data.title);
      setField(data.field);
      setDescription(data.description);
      setPhotos(data.photos);
      setEmptySlots(data.emptySlots);
    });
  }, [id]);

  function inputHeader(text) {
    return <h2 className="text-2xl font-semibold text-gray-700">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <div className="mb-4">
        {inputHeader(header)}
        {inputDescription(description)}
      </div>
    );
  }

  async function saveDegree(ev) {
    ev.preventDefault();
    const degreeData = { 
      title, 
      field, 
      description, 
      emptySlots,
      photos 
    };
    if (id) {
      await axios.put(`/admin/degree/${id}`, degreeData);
    } else {
      await axios.post('/admin/degree', degreeData);
    }
    setRedirect(true);
  }

  if (redirect) {
    return <Navigate to={'/admin'} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 mt-5">
      <AdminNav />
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl">
          <div className="text-center text-2xl font-bold text-gray-700 mb-6">Degree Form</div>
          <form onSubmit={saveDegree} className="space-y-5">
            {preInput('Title', 'Title of the degree')}
            <input
              type="text"
              value={title}
              onChange={ev => setTitle(ev.target.value)}
              placeholder="Title"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {preInput('Field', 'Set field of study')}
            <input
              type="text"
              value={field}
              onChange={ev => setField(ev.target.value)}
              placeholder="Field"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {preInput('Description', 'Description of the degree')}
            <textarea
              value={description}
              onChange={ev => setDescription(ev.target.value)}
              placeholder="Description"
              className="w-full p-2 border border-gray-300 rounded-md resize-none"
              rows="4"
            />
            {preInput('Empty slots', 'Set empty slots')}
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={emptySlots}
              onChange={ev => setEmptySlots(ev.target.value)}
              placeholder="Empty slots"
            />
            {preInput('Photos', 'Upload photos')}
            <PhotosUploader photos={photos} onChange={setPhotos} />
            <div className="flex justify-center">
              <button 
                type="submit" 
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg py-3 px-12 min-w-[200px] rounded-full font-semibold text-sm transition-all duration-300 ease-out flex items-center justify-center"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

