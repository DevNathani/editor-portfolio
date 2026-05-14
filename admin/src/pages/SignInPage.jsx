import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Terminal, Zap, User, KeyRound } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function SignInPage() {
  const { login, verifyLogin, requestAccess, forgotPassword, resetPassword } = useUser();
  const navigate = useNavigate();

  const [view, setView] = useState('login'); // 'login' | 'login_otp' | 'register' | 'forgot_password' | 'reset_password'
  const [formData, setFormData] = useState({ username: '', email: '', password: '', otp: '', newPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (view === 'login') {
        await login(formData.email, formData.password);
        setView('login_otp');
        setSuccess('OTP sent to your email.');
      } else if (view === 'login_otp') {
        await verifyLogin(formData.email, formData.otp);
        navigate('/');
      } else if (view === 'register') {
        const res = await requestAccess(formData.username, formData.email, formData.password);
        setSuccess(res.message);
        setView('login');
      } else if (view === 'forgot_password') {
        await forgotPassword(formData.email);
        setView('reset_password');
        setSuccess('Reset code sent to your email.');
      } else if (view === 'reset_password') {
        await resetPassword(formData.email, formData.otp, formData.newPassword);
        setSuccess('Password reset successfully. Please login.');
        setView('login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/8 blur-[100px] rounded-full -z-10" />
      
      <div className="relative w-full max-w-md px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm">
            <Terminal className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs font-mono text-primary tracking-widest uppercase">Content Management System</span>
          </div>
          <h1 className="text-4xl font-heading font-extrabold text-foreground mb-2">
            Secure <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">Uplink</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            {view === 'login' && 'Authenticate to manage your portfolio.'}
            {view === 'login_otp' && 'Enter the 2FA code sent to your email.'}
            {view === 'register' && 'Request super admin access.'}
            {view === 'forgot_password' && 'Enter your email to receive a reset code.'}
            {view === 'reset_password' && 'Enter the reset code and your new password.'}
          </p>
        </div>

        <div className="relative rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl p-8 shadow-2xl">
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

          {success && (
            <div className="mb-6 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <span className="font-mono">ERR:</span><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {view === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-primary tracking-widest uppercase">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-background/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                    placeholder="admin_master"
                  />
                </div>
              </div>
            )}

            {(view === 'login' || view === 'register' || view === 'forgot_password') && (
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-primary tracking-widest uppercase">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-background/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                    placeholder="admin@portfolio.com"
                  />
                </div>
              </div>
            )}

            {(view === 'login' || view === 'register' || view === 'reset_password') && (
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-primary tracking-widest uppercase">{view === 'reset_password' ? 'New Password' : 'Password'}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={view === 'reset_password' ? formData.newPassword : formData.password}
                    onChange={e => view === 'reset_password' ? setFormData({ ...formData, newPassword: e.target.value }) : setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-background/60 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-sm text-foreground focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {(view === 'login_otp' || view === 'reset_password') && (
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-primary tracking-widest uppercase">6-Digit Access Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={formData.otp}
                    onChange={e => setFormData({ ...formData, otp: e.target.value })}
                    className="w-full bg-background/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground text-center tracking-[0.5em] font-mono focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-primary to-cyan-400 text-black font-bold text-sm rounded-xl hover:scale-[1.02] transition-all duration-200 mt-4"
            >
              {loading ? 'Processing...' : 
                view === 'register' ? 'Request Access' : 
                view === 'login_otp' ? 'Verify & Access' : 
                view === 'forgot_password' ? 'Send Reset Code' : 
                view === 'reset_password' ? 'Reset Password' : 'Login'}
            </button>
          </form>

          {view === 'login' && (
            <div className="mt-6 flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <span>Forgot password?</span>
                <button onClick={() => { setView('forgot_password'); setError(''); setSuccess(''); }} className="text-primary hover:underline">Reset it</button>
              </div>
              <div className="flex gap-2">
                <span>No authorized account?</span>
                <button onClick={() => { setView('register'); setError(''); setSuccess(''); }} className="text-primary hover:underline">Request Access</button>
              </div>
            </div>
          )}
          
          {view !== 'login' && (
             <div className="mt-6 flex items-center justify-center text-sm text-muted-foreground">
                <button onClick={() => { setView('login'); setError(''); setSuccess(''); }} className="text-primary hover:underline">Return to Login</button>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
