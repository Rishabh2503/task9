import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const clientId = '539365207685-7e99t5gtpk8ss1m7qq7pb1c7gjodcl8q.apps.googleusercontent.com';

const Login = ({ onSuccess }) => {
  const navigate = useNavigate();

  const handleLoginSuccess = (response) => {
    onSuccess(response);
    navigate('/');
  };

  const handleLoginFailure = (response) => {
    console.error('Login failed:', response);
    alert('An error occurred during login. Please try again.');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-center">Sign in with Google</h2>
        <GoogleLogin
          clientId={clientId}
          buttonText="Login with Google"
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
          cookiePolicy={'single_host_origin'}
          className="w-full text-center"
        />
      </div>
    </div>
  );
};

export default Login;
