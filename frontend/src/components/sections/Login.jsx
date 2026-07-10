import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import './Login.css';

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = isSignup
        ? signup(email, password, confirmPassword)
        : login(email, password);

      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src="/logo.svg" alt="FinBulletin Logo" className="login-logo" />
          <h1>FinBulletin</h1>
          <p className="tagline">Your Financial News Hub</p>
        </div>

        <div className="login-form-wrapper">
          <h2 className="login-title">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {isSignup && (
              <div className="form-group">
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading
                ? isSignup
                  ? 'Creating Account...'
                  : 'Signing In...'
                : isSignup
                  ? 'Sign Up'
                  : 'Sign In'}
            </Button>
          </form>

          <div className="toggle-auth">
            <p>
              {isSignup
                ? 'Already have an account? '
                : "Don't have an account? "}
              <button
                type="button"
                className="toggle-button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
              >
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        <div className="login-footer">
          <p className="demo-label">Demo Credentials</p>
          <div className="demo-credentials">
            <span><strong>Email:</strong> user123@gmail.com</span>
            <span><strong>Password:</strong> user123</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
