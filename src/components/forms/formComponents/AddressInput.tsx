import axiosLocation from '../../../http/AxiosGeoLocation';
import TextFieldItem from '../formelements/TextFieldItem';
import { useEffect, useMemo, useState} from 'react';
import debounce from 'lodash.debounce';
import { InputAdornment } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';



interface  AddressInputs {
  value: string | undefined;
  onChange: (val: string) => void;
  onLocation: (location: { lat: number; lng: number }, fullAddress: string) => void;
};

const AddressInput = ({value, onChange, onLocation}: AddressInputs) => {
  //state for successfull helper text 
const [isValid, setIsValid] = useState<boolean>();

 const geoCodeAddress = async (address:string)=> {
   if (!address.trim()) return;

const LOCATION_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  try {
     const response = await axiosLocation.get('', {
        params : {
            address: address,
            key: LOCATION_API_KEY
        }
    })
     const result = response.data?.results?.[0];
     console.log(result)
     if(result) {
        const {lat, lng} = result.geometry.location
        const fullAddress = result.formatted_address;
        onLocation({ lat, lng }, fullAddress);
        setIsValid(true)
     }
    //  else {
    //     console.warn('No geocoding result found');
    //     setIsValid(false)
    //   }


  } catch (error) {
    console.error('Geocoding failed:', error);
    setIsValid(false);
  }
 }

const debouncedGeocode = useMemo(() => debounce(geoCodeAddress, 5000), []);
useEffect(() => {
  return () => {
    debouncedGeocode.cancel(); 
  };
}, [debouncedGeocode]);


 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    setIsValid(false);
    debouncedGeocode(e.target.value);
  };


   return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
     
        <TextFieldItem
            label="Address"
            value={value}
            onChange={handleChange}
            fullWidth
           InputProps={{
            endAdornment:  isValid ? (
              <InputAdornment position="end">
              <CheckCircleIcon color="success" />
            </InputAdornment>
          ) : null
           }}
            
        />
    </div>
  );
}

export default AddressInput
