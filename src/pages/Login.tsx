import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import { useAppDispatch } from '../services/hooks';
import { loginUser, clearError } from '../services/auth/auth.slice';
import { RootState } from '../services/store';
import { AuthState } from '../types';
import { toast } from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useAppDispatch();
  const authState = useSelector((state: RootState) => state.auth) as AuthState;
  const { isLoading, error, isAuthenticated } = authState;
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/log-task');
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password }));
      
      if (loginUser.fulfilled.match(result)) {
        toast.success(`Welcome back, ${result.payload.user.name}!`);
        navigate('/log-task');
      } else if (loginUser.rejected.match(result)) {
        toast.error(result.payload as string);
      }
    } catch (err) {
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-excel-background flex items-center justify-center py-excel-xl px-excel-lg">
      <div className="max-w-md w-full space-y-excel-xl">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-excel-blue-500 rounded-excel flex items-center justify-center mx-auto mb-excel-lg">
            <span className="text-white font-bold text-excel-xl">O</span>
          </div>
          <h1 className="text-excel-2xl font-semibold text-excel-text-primary">
            OBS Task Manager
          </h1>
          <p className="text-excel-base text-excel-text-muted mt-excel-sm">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white border border-excel-border rounded-excel p-excel-2xl">
          <form onSubmit={handleSubmit} className="space-y-excel-xl">
            {error && (
              <Alert type="error" message={error} />
            )}

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Sign In
            </Button>
          </form>
        </div>

        <div className="bg-excel-gray-50 border border-excel-border rounded-excel p-excel-lg">
          <h3 className="text-excel-sm font-medium text-excel-text-primary mb-excel-md">
            Demo Credentials:
          </h3>
          <div className="space-y-excel-sm text-excel-sm text-excel-text-muted">
            <div><strong>DEV:</strong> usama.obs@gmail.com / 12345678</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
