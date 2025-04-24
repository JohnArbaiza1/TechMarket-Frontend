import './App.css';
import { RouterProvider } from 'react-router-dom';
import router from './Routes/Router';
import { AuthProvider } from './Auth/AuthContext';
import LoaderPages from './Components/Loader';
import { Toaster } from "sonner";
import { ChatProvider } from './GlobalMessageListener'; 
import { ProfileProvider } from './Contexts/ProfileContext';

function App() {


  return (
    <>
      <LoaderPages delay={3000} />
      <AuthProvider>
        <ProfileProvider> 
            <ChatProvider>
              <RouterProvider router={router} />
            </ChatProvider> 
        </ProfileProvider>
      </AuthProvider> 
      <Toaster />
    </>
  );
}

export default App;
