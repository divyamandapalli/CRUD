import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateUsers() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  const submit = (e) => {
    e.preventDefault();

    if (!name || !email || !age) {
      alert("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("age", age);
    if (file) formData.append("profile", file);

    axios.post('http://localhost:3010/createusers', formData)
      .then(() => navigate('/'))
      .catch((error) => {
        alert("Failed to create user");
        console.error(error);
      });
  };

  return (
    <>
      <center><h1>Create User</h1>      </center>
      <form onSubmit={submit} encType="multipart/form-data" style={{ maxWidth: 400, margin: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
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
          required
          min={1}
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
            style={{ borderRadius: '8px', objectFit: 'cover' , left:'8px'}}
          />
        )}
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Add User</button>
      </form>
    </>
  );
}

export default CreateUsers

