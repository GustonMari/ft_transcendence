import "./App.css";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/register";
import Home from "./pages/home";
import SignIn from "./pages/signin";
import PrivateRoute from "./components/PrivateRoute";
import { Friends } from "./pages/friend";
import { Profile } from "./pages/profile";
import { Result } from "./components/search/Result";

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
      </Routes>
    </div>
  );

// return (
//     <div className="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10">
//       <p className="text-3xl text-gray-700 font-bold mb-5">
//         Welcome!
//       </p>
//       <p className="text-gray-500 text-lg">
//         React and Tailwind CSS in action
//       </p>
//     </div>
//   );
}

export default App;
