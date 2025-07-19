import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


interface ImageInputProps {
  onChange: (file: File | undefined) => void;
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

const ImageInput:React.FC<ImageInputProps> = ({onChange,name}) => {
  return (
    <Button
      component="label"
      role={undefined}
      variant="outlined"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload image
      <VisuallyHiddenInput
        type="file"
        name={name}
        onChange={(e) => onChange(e.target.files?.[0] ?? undefined)}
        multiple
      />
    </Button>
  );
}

export default ImageInput