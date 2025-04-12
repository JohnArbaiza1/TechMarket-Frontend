import './App.css'
// Importamos el RouterProvider para usar el router creado
import { RouterProvider } from 'react-router-dom'
// Importamos el archivo del router 
import router from './Routes/Router' 
import { AuthProvider } from './Auth/AuthContext'
import LoaderPages from './Components/Loader'
import { Toaster } from "sonner";


function App() {
  return (
    <>
      <LoaderPages delay={3000} />
      <AuthProvider> 
        <RouterProvider router={router} />
      </AuthProvider>
      <Toaster />
    </>
    
  )
}

export default App
