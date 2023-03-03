import "./App.css";
import { Route, Routes, Navigate} from "react-router-dom";
import Register from "./pages/register";
import Home from "./pages/home";
import SignIn from "./pages/signin";
import PrivateRoute from "./components/routes/PrivateRoute";
import { Friends } from "./pages/friend";
import { Profile } from "./pages/profile";
import { Result } from "./pages/search";
import { NotFound } from "./errors/NotFound";
import { UserProvider } from "./contexts/User.context";
import WrapContext from "./contexts/wrap.context";
import { GlobalFeatures } from "./components/communs/GlobalFeatures";
import PublicRoute from "./components/routes/PublicRoute";
import TFA from "./pages/tfa";
import Chat from "./pages/chat";
import { AlertProvider } from "./contexts/Alert.context";

function App() {
  return (
    <div className="App">
        <AlertProvider>
      <Routes>
        {/* <UserProvider> */}

        <Route path="/" element={<Navigate to="/home"/>} />

        <Route path="/register" element={
            <PublicRoute>
                <Register/>
            </PublicRoute>
        } />
        <Route path="/signin" element={
            <PublicRoute>
                <SignIn />
            </PublicRoute>
        } />
        <Route path="/tfa" element={
            <PublicRoute>
                <TFA />
            </PublicRoute>
        } />


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

        <Route path="/messages" element={
            <WrapContext components={
                <PrivateRoute>
                    <GlobalFeatures>
                        <Chat/>   
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
        </AlertProvider>
    </div>
  );
}

export default App;
