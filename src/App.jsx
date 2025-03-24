import './App.css'
// Importamos el RouterProvider para usar el router creado
import { RouterProvider } from 'react-router-dom'
// Importamos el archivo del router 
import router from './Routes/Router' 
import { AuthProvider } from './Auth/AuthContext'


function App() {
  return (
    <AuthProvider> 
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
