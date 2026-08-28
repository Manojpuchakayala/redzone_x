import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, User, Building, ArrowRight, ShieldCheck, UserCheck, AlertCircle, CheckCircle2, Zap, BadgeCheck } from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignup = location.pathname === '/signup';
  const { setUser, setManagedUsers, setSearchNotification, detectUserLocation, verifyOfficialIdAutomatically } = useDisaster();

  const [formData, setFormData] = useState({
    name: '',
    organization: 'General Citizen / Resident',
    email: '',
    password: '',
    accountType: 'CITIZEN',
    requestedOfficialRole: 'Disaster Rescue Officer (NDRF / SDMA)',
    badgeId: '',
  });

  const handleInstantEmergencyPass = async () => {
    setUser({
      name: 'Emergency Evacuee (Citizen)',
      role: 'Local Citizen / Volunteer',
      organization: 'Disaster Evacuation Zone',
      email: 'citizen.sos@emergency.gov.in',
      status: 'APPROVED',
    });
    navigate('/dashboard');
    try {
      await detectUserLocation();
    } catch (e) {}
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      if (formData.accountType === 'OFFICIAL') {
        // Automatic Database Verification of Official Government ID
        const verification = verifyOfficialIdAutomatically(formData.badgeId);

        const newOfficial = {
          id: `USR-${Date.now().toString().slice(-4)}`,
          name: formData.name || 'Official Officer',
          email: formData.email,
          role: formData.requestedOfficialRole,
          organization: formData.organization || verification.dept || 'Emergency Response Authority',
          badgeId: formData.badgeId || 'NDRF-9942',
          verificationMethod: verification.verificationMethod,
          status: verification.isValid ? 'APPROVED' : 'PENDING',
          date: new Date().toISOString().split('T')[0],
        };

        if (setManagedUsers) {
          setManagedUsers(prev => [newOfficial, ...prev]);
        }

        if (verification.isValid) {
          // Instantly Verified by Database! Full Official Access Unlocked!
          setUser({
            name: formData.name || 'Official Officer',
            role: formData.requestedOfficialRole,
            organization: formData.organization,
            email: formData.email,
            badgeId: formData.badgeId,
            status: 'APPROVED',
          });
          setSearchNotification(`✓ Official ID Verified against Government Database: ${formData.badgeId} (Full Command Unlocked)`);
        } else {
          setUser({
            name: formData.name || 'Citizen User',
            role: 'Local Citizen / Volunteer',
            organization: formData.organization,
            email: formData.email,
            status: 'PENDING_OFFICIAL',
          });
          setSearchNotification("🔒 Official ID Unverified. Citizen access active until Admin review.");
        }

        navigate('/dashboard');
      } else {
        // Citizen Auto-Approved
        setUser({
          name: formData.name || 'Citizen User',
          role: 'Local Citizen / Volunteer',
          organization: 'Resident / Public User',
          email: formData.email,
          status: 'APPROVED',
        });
        setSearchNotification("✓ Citizen Account Created Successfully");
        navigate('/dashboard');
      }
    } else {
      setUser({
        name: formData.email.includes('admin') ? 'Administrator Sharma' : (formData.name || 'Duty Commander'),
        role: formData.email.includes('admin') ? 'Administrator' : 'Local Citizen / Volunteer',
        organization: formData.email.includes('admin') ? 'National Disaster Management Authority (NDMA)' : 'Public Citizen',
        email: formData.email,
        status: 'APPROVED',
      });
      navigate('/dashboard');
    }
  };

  const handleQuickDemoLogin = (roleType) => {
    if (roleType === 'Admin') {
      setUser({
        name: 'Administrator Sharma',
        role: 'Administrator',
        organization: 'National Disaster Management Authority (NDMA)',
        email: 'admin.ndma@gov.in',
        status: 'APPROVED',
      });
    } else if (roleType === 'Officer') {
      setUser({
        name: 'Commander Rathore',
        role: 'Disaster Rescue Officer (NDRF / SDMA)',
        organization: 'National Disaster Response Force (NDRF)',
        email: 'officer.ndrf@gov.in',
        status: 'APPROVED',
      });
    } else {
      setUser({
        name: 'Rahul Verma (Citizen)',
        role: 'Local Citizen / Volunteer',
        organization: 'General Public (Meppadi Ward)',
        email: 'rahul.citizen@gmail.com',
        status: 'APPROVED',
      });
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-200 font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4">
        
        {/* Instant Emergency Bypass Banner */}
        <div className="p-3.5 bg-red-950/80 border border-red-600 rounded-2xl flex items-center justify-between gap-3 shadow-lg shadow-red-950/50">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400 animate-pulse flex-shrink-0" />
            <div>
              <div className="font-black text-white text-xs">Active Disaster Emergency?</div>
              <div className="text-[10px] text-slate-300">Skip registration for instant shelter routing</div>
            </div>
          </div>
          <button
            onClick={handleInstantEmergencyPass}
            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-md transition-all active:scale-95 whitespace-nowrap"
          >
            ⚡ Instant Pass
          </button>
        </div>

        {/* Brand Header */}
        <div className="text-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-red-600/30 mb-3">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-white">RED-ZONE <span className="text-red-500">X</span></h2>
          <p className="text-xs text-slate-400 mt-0.5">Disaster Safety &amp; Command Portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {isSignup && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Full Name</label>
                <div className="relative">
                  <User className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Captain Rahul Sharma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, accountType: 'CITIZEN' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                      formData.accountType === 'CITIZEN'
                        ? 'bg-blue-950/70 border-blue-500 text-blue-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="block text-xs">👤 Citizen / Public</span>
                    <span className="text-[10px] text-slate-400 block">Instant Access</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, accountType: 'OFFICIAL' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                      formData.accountType === 'OFFICIAL'
                        ? 'bg-amber-950/70 border-amber-500 text-amber-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="block text-xs">🛡️ Agency Official</span>
                    <span className="text-[10px] text-amber-400 block">Auto-ID Verification</span>
                  </button>
                </div>
              </div>

              {formData.accountType === 'OFFICIAL' ? (
                <div className="p-3.5 bg-amber-950/30 border border-amber-800/60 rounded-2xl space-y-2.5 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                    <BadgeCheck className="h-4 w-4 flex-shrink-0" />
                    <span>Instant Database Verification: Enter Government ID (e.g. NDRF-9942, SDMA-KL-402, DHM-101)</span>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 text-[11px]">Official Government Service Badge ID</label>
                    <input
                      type="text"
                      required
                      value={formData.badgeId}
                      onChange={(e) => setFormData({ ...formData, badgeId: e.target.value })}
                      placeholder="e.g. NDRF-9942 or SDMA-KL-402"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 text-[11px]">Requested Official Role</label>
                    <select
                      value={formData.requestedOfficialRole}
                      onChange={(e) => setFormData({ ...formData, requestedOfficialRole: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Disaster Rescue Officer (NDRF / SDMA)">Disaster Rescue Officer (NDRF / SDMA)</option>
                      <option value="Emergency Control Room Operator">Emergency Control Room Operator</option>
                      <option value="Relief Camp & Shelter Manager">Relief Camp &amp; Shelter Manager</option>
                      <option value="Medical & Ambulance Coordinator">Medical &amp; Ambulance Coordinator</option>
                    </select>
                  </div>
                </div>
              ) : null}
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@domain.com or officer@gov.in"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 mt-1"
          >
            <span>{isSignup ? 'Create & Auto-Verify Account' : 'Sign In to Portal'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Quick 1-Click Evaluation Roles */}
        <div className="pt-3 border-t border-slate-800">
          <span className="block text-center text-[10px] font-bold uppercase text-slate-500 mb-2">
            1-Click Demo Evaluation Roles
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('Citizen')}
              className="py-1.5 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-bold text-slate-300 text-center"
            >
              👤 Citizen
            </button>
            <button
              onClick={() => handleQuickDemoLogin('Officer')}
              className="py-1.5 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-bold text-amber-300 text-center"
            >
              🛡️ Officer
            </button>
            <button
              onClick={() => handleQuickDemoLogin('Admin')}
              className="py-1.5 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-bold text-red-400 text-center"
            >
              👑 Admin
            </button>
          </div>
        </div>

        {/* Switch Link */}
        <div className="text-center text-xs text-slate-400">
          {isSignup ? (
            <span>Already registered? <button onClick={() => navigate('/login')} className="text-red-400 font-bold underline">Sign In</button></span>
          ) : (
            <span>New citizen or responder? <button onClick={() => navigate('/signup')} className="text-red-400 font-bold underline">Create Account</button></span>
          )}
        </div>

      </div>
    </div>
  );
}
