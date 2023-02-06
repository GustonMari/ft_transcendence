import "./App.css";
import { Route, Routes, Navigate} from "react-router-dom";
import Register from "./pages/register";
import Home from "./pages/home";
import SignIn from "./pages/signin";
import PrivateRoute from "./components/PrivateRoute";
import { Friends } from "./pages/friend";
import { Profile } from "./pages/profile";
import { Result } from "./components/search/Result";
import { NotFound } from "./error/NotFound";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/home"/>} />

        <Route path="/register" element={<Register  />} />
        <Route path="/home" element={
            <PrivateRoute>
                <Home/>
            </PrivateRoute>
        } />
        <Route path="/friends" element={
            <PrivateRoute>
                <Friends/>
            </PrivateRoute>
        } />
        <Route path="/profile" element={
            <PrivateRoute>
                <Profile/>
            </PrivateRoute>
        } />
        <Route path="/signin" element={<SignIn />} />
        {/* <Route path='/' element={<App/>}/> */}
        <Route path='/search' element={
            <PrivateRoute>
                <Result/>
            </PrivateRoute>
        }/>

        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </div>
  );
}

export default App;
