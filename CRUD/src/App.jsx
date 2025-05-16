import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Users from './Users';
import CreateUsers from './CreateUsers';
import UpdateUsers from './UpdateUsers';
// import Login from './Login'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/CreateUsers" element={<CreateUsers />} />
        <Route path="/UpdateUsers/:id" element={<UpdateUsers />} />
        {/* <Route path="/login" element={<Login />} />  */}
      </Routes>
    </Router>
  );
}

export default App;
