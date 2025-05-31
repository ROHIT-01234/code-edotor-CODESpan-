import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home.js";
import EditorPage from "./pages/EditorPage.js";
import { RecoilRoot } from "recoil";
import Auth from "./pages/Auth.js";
// import GetstartedPage from "./pages/GetstartedPage.js";

function App() {
  console.log(process.env.REACT_APP_BACKEND_URL);
  return (
    <>
      <div>
        <Toaster
          position="top-center"
          toastOptions={{
            success: {
              theme: {
                primary: "#4aed88",
              },
            },
          }}
        ></Toaster>
      </div>
      <BrowserRouter>
        <RecoilRoot>
          <Routes>
            {/* <Route path="/" element={<GetstartedPage />}></Route> */}
            <Route path="/" element={<Auth />}></Route>
            <Route path="/room" element={<Home />}></Route>
            <Route path="/editor/:roomId" element={<EditorPage />}></Route>
          </Routes>
        </RecoilRoot>
      </BrowserRouter>
    </>
  );
}

export default App;
