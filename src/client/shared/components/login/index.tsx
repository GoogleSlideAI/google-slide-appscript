import { GoogleLogin } from "@react-oauth/google";


type LoginProps = {
  onLoginSuccess: () => void;
}

const Login = (props: LoginProps) => {
  const { onLoginSuccess } = props;
  return (
    <div className="flex justify-center items-center h-screen">
    <GoogleLogin
      onSuccess={credentialResponse => {
        console.log(credentialResponse);
        onLoginSuccess();
      }}
      onError={() => {
        console.log('Login Failed');
      }}
    />
    </div>
  );
};

export default Login;
