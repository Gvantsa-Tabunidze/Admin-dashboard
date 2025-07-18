export interface AuthProps {
    first_name:string,
    last_name:string,
    id:string,
    phone:string,
    email:string,
    password:string,
    profile_image:File | undefined,
    role:string
}