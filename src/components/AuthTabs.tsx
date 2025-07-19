import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AdminForm from './forms/formComponents/AdminForm';
import UserForm from './forms/formComponents/UserForm';
import CourierForm from './forms/formComponents/CourierForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

//TAB PANEL
const TabPanel:React.FC<TabPanelProps> = ({children, index, value, ...rest}) => {

  return (
    <div role="tabpanel" hidden={value !== index} 
    id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...rest}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

//FUNCTION FOR ADDING ACCESSIBILITY PROPS TO EACH TAB AND CONNECTS TAB TO ITS CONTENT PANEL
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`, 
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


//TABS COMPONENT 
const AuthTabs = ()=> {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Admin" {...a11yProps(0)} />
          <Tab label="User" {...a11yProps(1)} />
          <Tab label="Courier" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
         <AdminForm />
      </TabPanel>
      <TabPanel value={value} index={1}>
         <UserForm />
        </TabPanel>
      <TabPanel value={value} index={2}>
         <CourierForm />
      </TabPanel>
    </Box>
  );
}


export default AuthTabs