import React, { useState } from 'react';
import { 
  TrendingUp, 
  HelpCircle, 
  Compass, 
  Cpu, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ArrowRight,
  ShieldCheck,
  Layers
} from 'lucide-react';

import { supabase } from '../lib/supabase';

export const AuthPage = ({ onLoginSuccess }) => {
  const [authRole, setAuthRole] = useState('dispatcher'); // 'dispatcher' | 'driver'
  const [selectedDriverLogin, setSelectedDriverLogin] = useState('DRV-001');
  const [email, setEmail] = useState('admin@nelogi-mind.ai');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    // Bypass if Supabase is not configured yet
    if (import.meta.env.VITE_SUPABASE_URL === 'YOUR_SUPABASE_URL' || !import.meta.env.VITE_SUPABASE_URL) {
      console.warn("Supabase keys not found in .env, bypassing authentication for demo purposes.");
      setTimeout(() => {
        setIsLoading(false);
        if (authRole === 'driver') {
          onLoginSuccess({ role: 'driver', driverId: selectedDriverLogin });
        } else {
          onLoginSuccess({ role: 'dispatcher' });
        }
      }, 400);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (authRole === 'driver') {
        onLoginSuccess({ role: 'driver', driverId: selectedDriverLogin, user: data.user });
      } else {
        onLoginSuccess({ role: 'dispatcher', user: data.user });
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDriverQuickLogin = (drvId) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({ role: 'driver', driverId: drvId });
    }, 250);
  };

  return (
    <div className="auth-split-container">
      {/* Left Pane - Master Hero Showcase matching design image */}
      <div className="auth-hero-pane">
        <div className="auth-hero-overlay"></div>
        <div className="auth-hero-content">
          {/* Brand header */}
          <div className="auth-brand-badge">
            <div className="auth-logo-icon">
              <Layers size={22} />
            </div>
            <div>
              <h2 className="auth-logo-text">NE-Logi Mind AI</h2>
              <p className="auth-tagline">Smarter Routes. Safer Journeys. A Resilient Tomorrow.</p>
            </div>
          </div>

          <div className="auth-hero-text">
            <h1 className="auth-hero-title">
              AI-Powered Smart Logistics & Accessibility Intelligence
            </h1>
            <p className="auth-hero-desc">
              Predict delays. Assess risks. Recommend optimal routes. Simulate multiple scenarios.
            </p>
          </div>

          {/* 4 Core Pillars matching design reference */}
          <div className="auth-pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon pillar-predict">
                <TrendingUp size={20} />
              </div>
              <h4>Predict</h4>
              <p>Delay & duration estimation</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon pillar-explain">
                <HelpCircle size={20} />
              </div>
              <h4>Explain</h4>
              <p>Understand why it's risky</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon pillar-recommend">
                <Compass size={20} />
              </div>
              <h4>Recommend</h4>
              <p>Best route with balance</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon pillar-simulate">
                <Cpu size={20} />
              </div>
              <h4>Simulate</h4>
              <p>What-if digital twin scenarios</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Clean Sign In Form with Role Selector */}
      <div className="auth-form-pane">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2>{authRole === 'dispatcher' ? 'Dispatcher Login' : 'Driver Console Login'}</h2>
            <p>Welcome back. Please enter your credentials to continue.</p>
          </div>

          {errorMsg && (
            <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem', border: '1px solid #f87171' }}>
              {errorMsg}
            </div>
          )}

          {/* Role Mode Switcher Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            background: 'var(--bg-card-subtle)',
            padding: '0.35rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-light)'
          }}>
            <button
              type="button"
              onClick={() => setAuthRole('dispatcher')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.55rem 0.75rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: authRole === 'dispatcher' ? '#ffffff' : 'transparent',
                color: authRole === 'dispatcher' ? 'var(--primary)' : 'var(--text-secondary)',
                boxShadow: authRole === 'dispatcher' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              🏢 Fleet Dispatcher
            </button>

            <button
              type="button"
              onClick={() => setAuthRole('driver')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.55rem 0.75rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: authRole === 'driver' ? '#ffffff' : 'transparent',
                color: authRole === 'driver' ? '#10b981' : 'var(--text-secondary)',
                boxShadow: authRole === 'driver' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              🚚 Driver Login
            </button>
          </div>

          {/* DISPATCHER LOGIN FORM */}
          {authRole === 'dispatcher' ? (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Dispatcher Email</label>
                <div className="input-with-icon">
                  <Mail size={17} className="input-icon" />
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="admin@nelogi-mind.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-with-icon">
                  <Lock size={17} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="auth-options-row">
                <label className="remember-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to registered administrator."); }} className="forgot-link">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="btn btn-primary auth-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <span className="spinner-sm"></span>
                ) : (
                  <>
                    <span>Enter Central Dispatcher</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* DRIVER IN-CAB LOGIN FORM */
            <div className="driver-login-section">
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 600 }}>
                Select Your Assigned Driver Profile:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
                {[
                  { id: 'DRV-001', name: 'Biren Das', vehicle: 'Container Truck (AS-01-EC-9021)', route: 'Guwahati → Gangtok', color: '#3b82f6' },
                  { id: 'DRV-002', name: 'Wanphrang Nongrum', vehicle: 'Mini Reefer (ML-05-D-3312)', route: 'Guwahati → Shillong', color: '#10b981' },
                  { id: 'DRV-003', name: 'Luwang Singh', vehicle: 'Heavy Truck (MN-01-AA-7741)', route: 'Kohima → Imphal', color: '#f59e0b' },
                  { id: 'DRV-004', name: 'Bikash Debbarma', vehicle: 'Light Truck (TR-01-B-5561)', route: 'Agartala → Aizawl', color: '#8b5cf6' },
                ].map((drv) => (
                  <div 
                    key={drv.id}
                    onClick={() => setSelectedDriverLogin(drv.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: selectedDriverLogin === drv.id ? `2px solid ${drv.color}` : '1px solid var(--border-light)',
                      background: selectedDriverLogin === drv.id ? 'rgba(59, 130, 246, 0.05)' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: drv.color,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.9rem'
                      }}>
                        {drv.name[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                          {drv.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                          {drv.vehicle} • <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{drv.route}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-sm"
                      style={{
                        background: selectedDriverLogin === drv.id ? drv.color : 'transparent',
                        color: selectedDriverLogin === drv.id ? '#ffffff' : 'var(--text-secondary)',
                        border: selectedDriverLogin === drv.id ? 'none' : '1px solid var(--border-light)',
                        fontSize: '0.74rem',
                        padding: '0.35rem 0.65rem'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDriverQuickLogin(drv.id);
                      }}
                    >
                      Login ➔
                    </button>
                  </div>
                ))}
              </div>

              <button 
                type="button" 
                className="btn btn-primary auth-submit-btn" 
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
                disabled={isLoading}
                onClick={() => handleDriverQuickLogin(selectedDriverLogin)}
              >
                {isLoading ? (
                  <span className="spinner-sm"></span>
                ) : (
                  <>
                    <span>Enter Driver Cockpit</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>
          )}

          <div className="auth-footer-security">
            <ShieldCheck size={16} className="text-muted" />
            <span>Secure • Smart • Sustainable</span>
          </div>
        </div>
      </div>
    </div>
  );
};
