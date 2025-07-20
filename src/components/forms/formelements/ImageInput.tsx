import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from 'react';
import axiosUpload from '../../../http/AxiosUpload';
import { Avatar } from '@mui/material';


interface ImageInputProps {
  onChange: (file: File | undefined | string ) => void;
  name: string;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ImageInput:React.FC<ImageInputProps> = ({onChange, name}) => {
  const preset_key = 'profile-img'
  const [image, setImage] = useState()



const handleFile = (e:React.ChangeEvent<HTMLInputElement>)=> {
  const file = e.target.files[0]
   if (!file) return;

  const inputData = new FormData();
  inputData.append('file', file)
  inputData.append('upload_preset', preset_key)
  //upload image tocloudinary
  axiosUpload.post('/upload', inputData)
  .then(res=> { 
    setImage(res.data.secure_url), 
    onChange(res.data.secure_url)
  })
  .catch(err=> console.log(err))

}


  return (
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <Button component="label" role={undefined} variant="outlined" tabIndex={-1} startIcon={<CloudUploadIcon />}>
          Upload image
          <VisuallyHiddenInput type="file" name={name} onChange={handleFile} multiple/>
        </Button>

        <Avatar src={image} sx={{height:'80px', width:'80px', objectFit:'cover'}} ></Avatar>
    </div>

  )
}

export default ImageInput