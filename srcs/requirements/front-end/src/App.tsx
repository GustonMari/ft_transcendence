import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/home";
import PrivateRoute from "./components/routes/PrivateRoute";
import { Friends } from "./pages/friend";
import Profile from "./pages/profile";
import { Result } from "./pages/search";
import { NotFound } from "./errors/NotFound";
import WrapContext from "./contexts/wrap.context";
import { AlertProvider } from "./contexts/Alert.context";
import { Welcome } from "./pages/welcome";
import Chat from "./pages/chat";
import Pong from "./pages/pong/pong";
import { Authentification } from "./pages/authentification";
import HomePong from "./pages/pong/homePong";

function App() {
  return (
    <div className="App">
      <AlertProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" />} />

          <Route path="/welcome" element={<Welcome />} />
          <Route path="/authentification" element={<Authentification />} />

          <Route
            path="/game"
            element={
              <WrapContext
                components={
                  <PrivateRoute>
                    <HomePong />
                  </PrivateRoute>
                }
              />
            }
          />

          <Route
            path="/pong"
            element={
              <WrapContext
                components={
                  <PrivateRoute>
                    <Pong />
                  </PrivateRoute>
                }
              />
            }
          />

          <Route
            path="/friends"
            element={
              <WrapContext
                components={
                  <PrivateRoute>
                    <Friends />
                  </PrivateRoute>
                }
              />
            }
          />

          <Route
            path="/messages"
            element={
              <WrapContext
                components={
                  <PrivateRoute>
                    <Chat />
                  </PrivateRoute>
                }
              />
            }
          />
          <Route
            path="/pong"
            element={
              <PrivateRoute>
                <Pong />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <WrapContext
                components={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
            }
          />
          <Route
            path="/search"
            element={
              <WrapContext
                components={
                  <PrivateRoute>
                    <Result />
                  </PrivateRoute>
                }
              />
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AlertProvider>
    </div>
  );
}

export default App;
