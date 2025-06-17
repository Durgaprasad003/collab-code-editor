import './App.css';
import{ BrowserRouter,Routes,Route } from 'react-router-dom';
import Homes from './pages/Homes';
import Editorpage from './pages/Editorpage';
import { Toaster } from 'react-hot-toast';
function App() {
  return (
   <>
   <div>
    <Toaster position='top-right' toastOptions={{
      success: {
        duration: 2000,
        style: {
          // background: '#4ea8de',
          color: '#000',
        },
        theme: {
          primary: '#4aed88',
          secondary: '#fff',
        },
      },
    }}></Toaster>
   </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homes/>} />
        <Route path="/editor/:roomid" element={<Editorpage/>} />
      </Routes>
      </BrowserRouter>
   </>
  );
}

export default App;
