import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateUsers() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3010/getUsers/${id}`)
      .then(res => {
        const user = res.data;
        setName(user.name);
        setEmail(user.email);
        setAge(user.age);
        setPreview(user.profile ? `http://localhost:3010/uploads/${user.profile}` : null);
      })
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    return () => {
      if (preview && file) {
        URL.revokeObjectURL(preview); 
      }
    };
  }, [preview, file]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!name || !email || !age) {
      alert("Please fill all the fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("age", age);
    if (file) {
      formData.append("profile", file);
    }

    axios.put(`http://localhost:3010/UpdateUsers/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(() => navigate('/'))
      .catch(err => alert("Failed to update user"));
  };

  return (
    <form onSubmit={handleUpdate} encType="multipart/form-data" style={{ maxWidth: 400, margin: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2>Update User</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={e => setAge(e.target.value)}
        min={1}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          width={100}
          style={{ borderRadius: '8px', objectFit: 'cover' }}
        />
      )}
      <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Update User</button>
    </form>
  );
}

export default UpdateUsers;
