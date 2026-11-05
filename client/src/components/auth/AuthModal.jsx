import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth.js';

function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register, authError } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthModalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeAuthModal();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const updateField = (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (mode === 'login') {
      await login({ email: form.email, password: form.password });
    } else {
      await register({ name: form.name, email: form.email, password: form.password });
    }

    setIsSubmitting(false);
  };

  const switchMode = () => {
    setMode((currentMode) => (currentMode === 'login' ? 'register' : 'login'));
    setForm({ name: '', email: '', password: '' });
  };

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4"
      role="dialog"
    >
      <div className="relative w-full max-w-md rounded-luxury bg-allavanchy-ivory p-8 shadow-luxury-soft">
        <button
          aria-label="Close"
          className="absolute right-2 top-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-allavanchy-ash transition duration-300 hover:bg-allavanchy-mist hover:text-allavanchy-ink"
          onClick={closeAuthModal}
          type="button"
        >
          <X aria-hidden="true" size={18} strokeWidth={1.5} />
        </button>

        <p className="av-eyebrow">ALLAVANCHY</p>
        <h2 className="av-heading-lg mt-2">
          {mode === 'login' ? 'Sign in to continue' : 'Create your account'}
        </h2>
        <p className="av-body mt-2 text-sm">
          {mode === 'login'
            ? 'Sign in to add items to your cart or wishlist.'
            : 'Create an account to start shopping.'}
        </p>

        <form className="mt-6 space-y-4" onSubmit={submitForm}>
          {authError && (
            <p className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{authError}</p>
          )}

          {mode === 'register' && (
            <label className="block">
              <span className="av-caption">Name</span>
              <input
                autoComplete="name"
                className="av-input mt-2"
                name="name"
                onChange={updateField}
                required
                type="text"
                value={form.name}
              />
            </label>
          )}

          <label className="block">
            <span className="av-caption">Email</span>
            <input
              autoComplete="email"
              className="av-input mt-2"
              name="email"
              onChange={updateField}
              required
              type="email"
              value={form.email}
            />
          </label>

          <label className="block">
            <span className="av-caption">Password</span>
            <input
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="av-input mt-2"
              name="password"
              onChange={updateField}
              required
              type="password"
              value={form.password}
            />
          </label>

          <button className="av-button-primary w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <button className="av-link mt-6 block text-center text-sm" onClick={switchMode} type="button">
          {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}

export default AuthModal;
