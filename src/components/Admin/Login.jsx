import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Droplets, Lock, Mail, AlertCircle } from 'lucide-react';
import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();

  React.useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--text-muted)]">
        {t('common.loading')}
      </div>
    );
  }

  const noAdminAccess = user && !isAdmin;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      console.error('Appwrite login error:', err);
      if (err.message?.includes('prohibited when a session is active')) {
        navigate('/admin');
      } else {
        setError(err.message || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md mb-6 flex justify-end">
        <LanguageSwitcher variant="light" />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 mb-4 sm:mb-6 shadow-lg shadow-blue-500/25">
            <Droplets className="text-white" size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-[var(--text)] mb-2">{t('admin.login.title')}</h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)]">{t('admin.login.sub')}</p>
        </div>

        <div className="ui-card p-6 sm:p-8 shadow-[var(--shadow-lg)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2 ms-1">{t('admin.login.email')}</label>
              <div className="relative">
                <Mail className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ui-input ps-12"
                  placeholder="manager@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2 ms-1">{t('admin.login.password')}</label>
              <div className="relative">
                <Lock className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ui-input ps-12"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {noAdminAccess && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-900 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{t('admin.login.noAccess')}</span>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full ui-btn ui-btn-primary min-h-12 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('admin.login.loading') : t('admin.login.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
