import './App.css';
import { RouterProvider } from 'react-router-dom';
import router from './Routes/Router';
import { AuthProvider } from './Auth/AuthContext';
import LoaderPages from './Components/Loader';
import { Toaster } from "sonner";
import { ChatProvider } from './GlobalMessageListener'; 

function App() {


  return (
    <>
      <LoaderPages delay={3000} />
      <AuthProvider>
        <ChatProvider>
          <RouterProvider router={router} />

        </ChatProvider> 
      </AuthProvider> 
      <Toaster />
    </>
  );
}

export default App;
