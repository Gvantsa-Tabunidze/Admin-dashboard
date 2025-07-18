import React, { useState } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel:React.FC<TabPanelProps> = ({children, index, value, ...rest})=>{
  return(
   <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...rest}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const generateAccessabilityProps = (index:number)=> {
   return {
    id: `auth-tab-${index}`,
    'aria-controls': `auth-tabpanel-${index}`,
  };
}

const roleList = ['admin', 'user', 'courier', ];


const AuthTabs:React.FC = () => {




  return (
    <div>
     
    </div>
  )
}

export default AuthTabs
