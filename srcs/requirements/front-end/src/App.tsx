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
import { UserProvider } from "./contexts/User.context";
import WrapContext from "./contexts/wrap.context";
import { GlobalFeatures } from "./components/communs/GlobalFeatures";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* <UserProvider> */}

        <Route path="/" element={<Navigate to="/home"/>} />
        <Route path="/register" element={<Register  />} />
        <Route path="/signin" element={<SignIn />} />


            <Route path="/home" element={
                <WrapContext components={
                    <PrivateRoute>
                        <GlobalFeatures>
                            <Home/>
                        </GlobalFeatures>
                    </PrivateRoute>
                }/>
            } />
            <Route path="/friends" element={
                <WrapContext components={
                    <PrivateRoute>
                        <GlobalFeatures>
                            <Friends/>
                        </GlobalFeatures>
                    </PrivateRoute>
                }/>
            } />
            <Route path="/profile" element={
                <WrapContext components={
                    <PrivateRoute>
                            <GlobalFeatures>
                        <Profile/>
                            </GlobalFeatures>
                    </PrivateRoute>
                } />
            } />
            <Route path='/search' element={
                <WrapContext components={
                    <PrivateRoute>
                        <GlobalFeatures>
                            <Result/>
                        </GlobalFeatures>
                    </PrivateRoute>
                } />
            }/>
        {/* </UserProvider> */}

        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </div>
  );
}

export default App;
