import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Already logged in? Skip the login page.
  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '', form: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email.';
    if (!form.password) newErrors.password = 'Password is required.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const loggedIn = await login(form.email, form.password);
      showToast(`Welcome back, ${loggedIn.name.split(' ')[0]}!`);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = () => {
    setForm({ email: 'ayesha@skillswap.com', password: 'password123' });
    setErrors({});
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue swapping skills.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {errors.form && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errors.form}
          </div>
        )}
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Your password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <Button type="submit" loading={submitting} className="w-full">
          Log in
        </Button>
        <Button type="button" variant="secondary" onClick={fillDemo} className="w-full">
          Use demo account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        New to SkillSwap?{' '}
        <Link to="/register" className="font-semibold text-brand-600 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}