import UserType from './type'; 

export const validateRegister = (options: UserType) => {
  if(
    !options.email.includes('@')
  ) {
    return {
      field: "email",
      message: "Invalid email",
    };
  }
  if(
    options.username.length <= 2
  ) {
    return {
      field: "username",
      message: "Length must be greater than 2",
    };
  }
  if(
    options.password.length <= 3
  ) {
    return {
      field: "password",
      message: "Length must be greater than 3",
    };
  }
  return null;
}