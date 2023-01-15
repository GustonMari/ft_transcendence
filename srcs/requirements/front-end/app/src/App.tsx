import "./App.css";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/register";
import Home from "./pages/home";
import SignIn from "./pages/signin";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={
            <PrivateRoute>
                <Home/>
            </PrivateRoute>
        } />
        <Route path="/signin" element={<SignIn />} />
        {/* <Route path='/' element={<App/>}/> */}
      </Routes>
    </div>
  );
}

export default App;
