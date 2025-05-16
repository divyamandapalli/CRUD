import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Users() {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    axios.get("http://localhost:3010/users")
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios.delete(`http://localhost:3010/deleteUsers/${id}`)
        .then(() => fetchUsers())
        .catch(err => console.log(err));
    }
  };

  return (
    <div>
      <center><h2>User List</h2></center>
      <Link to="/CreateUsers">
        <button style={{ margin: 10 }}>+ Add User</button>
      </Link>
      <table border="1" cellPadding={10} cellSpacing={0} style={{ margin: 'auto', width: '90%', maxWidth: '900px' }}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Image</th>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan={6} style={{ textAlign: 'center' }}>No users found</td></tr>
          ) : users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>
                {user.profile ? (
                  <img 
                    src={`http://localhost:3010/uploads/${user.profile}`} 
                    alt={user.name} 
                    width={50} 
                    height={50} 
                    // style={{ borderRadius: '50%' }}
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.email}</td>
              <td>
                <Link to={`/UpdateUsers/${user._id}`}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => handleDelete(user._id)} style={{ marginLeft: 5 }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;