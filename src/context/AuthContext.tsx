import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthProps } from "../interfaces/AuthProps";
import { useNavigate } from "react-router-dom";
import $axios from "../http/AxiosPost";


interface IAuthContext{
    submitForm: (formData: AuthProps) => Promise<void>;
    logout: () => void;
    user: AuthProps | null;
    isAuthenticated: boolean;
}

const AuthContext= createContext<IAuthContext | undefined>(undefined);



 

export const AuthContextProvider:React.FC<{children:ReactNode}> = ({children})=> {  
const navigate = useNavigate()
const [user, setUser] = useState<AuthProps | null >(()=> {
  const savedUser = localStorage.getItem('user')
  return savedUser? JSON.parse(savedUser) : null
})

const submitForm = async (formData:AuthProps)=> {
  const role =formData.role as 'admin' | 'user' | 'courier';
  if (!role) return console.error('Role is required');

  try {
   const payload = { data: [formData] };
   await $axios.post('/users', payload)

   //save user to local storage
   setUser(formData)
   localStorage.setItem('user', JSON.stringify(formData))

   //Navigate based on role
   switch (role) {
        case 'admin': navigate('/admin')
        break;
        case 'user': navigate('/user')
        break;
        case 'courier' : navigate('/courier')
        break;
        default: console.warn('Unknown role')
   }

  } catch (error) {
    console.error("Form submission error:", error);
  }
}

  //log out
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/auth', { replace: true });
  };

  const isAuthenticated = !!user;

return (
  <AuthContext.Provider value={{ submitForm, logout, isAuthenticated, user }}>
    {children}
  </AuthContext.Provider>
);

}


export const useAuth = ()=> {
    const context = useContext(AuthContext)
    if (!context) {
    throw new Error("useAuth must be used within AuthContextProvider");
  }
  return context;
}