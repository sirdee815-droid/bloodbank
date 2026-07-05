import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './supabase';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';

// Admin pages
import Donors from './pages/admin/Donors';
import AddDonor from './pages/admin/AddDonor';
import Requests from './pages/admin/Requests';
import ManageDonors from './pages/admin/ManageDonors';
import BloodInventory from './pages/admin/BloodInventory';
import BloodGroups from './pages/admin/BloodGroups';
import PatientManagement from './pages/admin/PatientManagement';
import Reports from './pages/admin/Reports';
import UserManagement from './pages/admin/UserManagement';

// Donor pages
import DonorDashboard from './pages/donor/DonorDashboard';
import DonorProfile from './pages/donor/DonorProfile';
import DonationAppointment from './pages/donor/DonationAppointment';
import DonationHistory from './pages/donor/DonationHistory';
import DonorNotifications from './pages/donor/DonorNotifications';
import MyPortal from './pages/donor/MyPortal';

// Patient pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientRequest from './pages/patient/PatientRequest';
import RequestStatus from './pages/patient/RequestStatus';
import PatientProfile from './pages/patient/PatientProfile';
import PatientNotifications from './pages/patient/PatientNotifications';

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [donors, setDonors] = useState([]);
  const [donations, setDonations] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [recoveryMode, setRecoveryMode] = useState(false);

  const role = user?.user_metadata?.role || user?.role || 'donor';
  const isAdmin = role === 'admin';
  const isDonor = role === 'donor';
  const isPatient = role === 'patient';
  const donorRecord = isDonor ? donors.find((donor) => donor.email === user.email) : null;
  const donorDonations = donorRecord ? donations.filter((donation) => donation.donor_id === donorRecord.id) : [];

  const getDefaultPath = () =>
    isAdmin ? '/admin/manage-donors' : isDonor ? '/donor' : '/patient';

  const roleGuard = (allowedRoles, element) =>
    allowedRoles.includes(role) ? element : <Navigate to={getDefaultPath()} replace />;

  const triggerFeedback = (message) => {
    setFeedbackMsg(message);
    window.setTimeout(() => setFeedbackMsg(null), 3200);
  };

  const loadData = async () => {
    setDataLoading(true);
    try {
      const donorsResponse = await supabase.from('donors').select();
      const donationsResponse = await supabase.from('donations').select();
      const inventoryResponse = await supabase.from('blood_inventory').select();
      const requestsResponse = await supabase.from('blood_requests').select();

      setDonors(donorsResponse.data || []);
      setDonations(donationsResponse.data || []);
      setInventory(inventoryResponse.data || []);
      setRequests(requestsResponse.data || []);
    } catch (err) {
      console.error('load data failed', err);
      triggerFeedback('Unable to load application data.');
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
          await loadData();
        }
      } catch (err) {
        console.error('auth check failed', err);
      } finally {
        setLoadingAuth(false);
      }
    };
    initAuth();

    // When a user returns via a password-reset email, Supabase fires
    // PASSWORD_RECOVERY — show the "set new password" screen instead of the app.
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true);
        setLoadingAuth(false);
      }
    });
    return () => authListener?.subscription?.unsubscribe?.();
  }, []);

  const handleLogin = async ({ email, password }) => {
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message);
        return;
      }
      if (data?.user) {
        await loadData();
        setUser(data.user);
        triggerFeedback('Welcome back!');
        const newRole = data.user?.user_metadata?.role || data.user?.role || 'donor';
        const defaultPath = newRole === 'admin' ? '/admin/manage-donors' : newRole === 'donor' ? '/donor' : '/patient';
        navigate(defaultPath, { replace: true });
      }
    } catch (err) {
      console.error('login failed', err);
      setAuthError('Unable to sign in.');
    }
  };

  const handleSignUp = async ({ fullName, email, password, selectedRole }) => {
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: selectedRole,
          },
        },
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      if (data?.user) {
        await loadData();
        setUser(data.user);
        triggerFeedback('Account created successfully. Welcome!');
        const newRole = data.user?.user_metadata?.role || data.user?.role || 'donor';
        const defaultPath = newRole === 'admin' ? '/admin/manage-donors' : newRole === 'donor' ? '/donor' : '/patient';
        navigate(defaultPath, { replace: true });
        return;
      }

      triggerFeedback('Account created. Please check your inbox to confirm your email.');
    } catch (err) {
      console.error('sign up failed', err);
      setAuthError('Unable to register.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setDonors([]);
    setDonations([]);
    setInventory([]);
    setRequests([]);
  };

  const handleForgotPassword = async (email) => {
    setAuthError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) {
        setAuthError(error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('reset password request failed', err);
      setAuthError('Unable to send reset link. Please try again.');
      return false;
    }
  };

  const handleUpdatePassword = async (newPassword) => {
    setAuthError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setAuthError(error.message);
        return;
      }
      await supabase.auth.signOut();
      setRecoveryMode(false);
      setUser(null);
      triggerFeedback('Password updated. Please sign in with your new password.');
      navigate('/', { replace: true });
    } catch (err) {
      console.error('update password failed', err);
      setAuthError('Unable to update password. Please try again.');
    }
  };

  const handleAddDonor = async (form) => {
    if (!form.fullName || !form.email || !form.bloodType || !form.phoneNo) {
      triggerFeedback('Please complete all donor fields.');
      return false;
    }

    try {
      const donorData = {
        full_name: form.fullName,
        blood_type: form.bloodType,
        email: form.email,
        phone_no: form.phoneNo,
        address: form.address || '',
        last_donation_date: form.lastDonationDate || null,
      };

      const { error } = await supabase.from('donors').insert([donorData]);
      if (error) {
        triggerFeedback(error.message || 'Could not save donor.');
        return false;
      }

      await loadData();
      triggerFeedback('Donor registered successfully.');
      return true;
    } catch (err) {
      console.error('add donor failed', err);
      triggerFeedback('Unable to save donor.');
      return false;
    }
  };

  const handleRequestBlood = async (requestForm) => {
    if (!requestForm.hospitalName || !requestForm.patientName || !requestForm.bloodType || !requestForm.unitsRequested) {
      triggerFeedback('Please complete all request fields.');
      return false;
    }

    try {
      const requestData = {
        hospital_name: requestForm.hospitalName,
        patient_name: requestForm.patientName,
        blood_type: requestForm.bloodType,
        units_requested: Number(requestForm.unitsRequested),
        urgency: requestForm.urgency || 'normal',
        status: 'pending',
        requested_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('blood_requests').insert([requestData]);
      if (error) {
        triggerFeedback(error.message || 'Could not place request.');
        return false;
      }

      await loadData();
      triggerFeedback('Blood request submitted.');
      return true;
    } catch (err) {
      console.error('request blood failed', err);
      triggerFeedback('Unable to submit request.');
      return false;
    }
  };

  const handleFulfillRequest = async (request) => {
    const inventoryItem = inventory.find((item) => item.blood_type === request.blood_type);
    if (!inventoryItem || inventoryItem.units_available < request.units_requested) {
      triggerFeedback('Not enough blood available to fulfill this request.');
      return;
    }

    try {
      // The mock auto-decrements inventory when a request is fulfilled via side effect.
      // For real Supabase, add a DB trigger or update inventory explicitly here.
      await supabase.from('blood_requests').update({ status: 'fulfilled' }).eq('id', request.id);
      await loadData();
      triggerFeedback('Request fulfilled. Inventory updated.');
    } catch (err) {
      console.error('fulfill request failed', err);
      triggerFeedback('Unable to fulfill request.');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await supabase.from('blood_requests').update({ status: 'rejected' }).eq('id', requestId);
      await loadData();
      triggerFeedback('Request rejected.');
    } catch (err) {
      console.error('reject request failed', err);
      triggerFeedback('Unable to reject request.');
    }
  };

  const handleAdjustInventory = async (bloodType, change) => {
    try {
      const inventoryItem = inventory.find((item) => item.blood_type === bloodType);
      if (!inventoryItem) {
        triggerFeedback('Blood type not found in inventory.');
        return;
      }

      const updatedUnits = Math.max(0, inventoryItem.units_available + change);
      await supabase.from('blood_inventory').update({ units_available: updatedUnits }).eq('blood_type', bloodType);
      await loadData();
      triggerFeedback('Inventory updated.');
    } catch (err) {
      console.error('adjust inventory failed', err);
      triggerFeedback('Unable to update inventory.');
    }
  };

  if (loadingAuth) {
    return (
      <div className="auth-wrapper">
        <div className="glass-card">Loading…</div>
      </div>
    );
  }

  if (recoveryMode) {
    return <ResetPassword authError={authError} onUpdatePassword={handleUpdatePassword} />;
  }

  if (!user) {
    return <Login authError={authError} onLogin={handleLogin} onSignUp={handleSignUp} onForgotPassword={handleForgotPassword} />;
  }

  return (
    <div className="app-container">
      {feedbackMsg && <div className="toast">{feedbackMsg}</div>}
      <Sidebar user={user} role={role} onLogout={handleLogout} />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={roleGuard(['admin'],
              <Dashboard
                donors={donors}
                donations={donations}
                inventory={inventory}
                requests={requests}
                isAdmin={isAdmin}
                onAdjustInventory={handleAdjustInventory}
                isLoading={dataLoading}
              />
            )}
          />

          {/* Admin routes */}
          <Route path="/admin/manage-donors" element={roleGuard(['admin'], <ManageDonors donors={donors} />)} />
          <Route path="/admin/inventory" element={roleGuard(['admin'], <BloodInventory inventory={inventory} onAdjustInventory={handleAdjustInventory} />)} />
          <Route path="/admin/requests" element={roleGuard(['admin'], <Requests requests={requests} onRequestSubmit={handleRequestBlood} onFulfillRequest={handleFulfillRequest} onRejectRequest={handleRejectRequest} />)} />
          <Route path="/admin/blood-groups" element={roleGuard(['admin'], <BloodGroups />)} />
          <Route path="/admin/patients" element={roleGuard(['admin'], <PatientManagement requests={requests} />)} />
          <Route path="/admin/reports" element={roleGuard(['admin'], <Reports donors={donors} inventory={inventory} requests={requests} />)} />
          <Route path="/admin/users" element={roleGuard(['admin'], <UserManagement user={user} />)} />
          <Route path="/donors" element={roleGuard(['admin'], <Donors donors={donors} />)} />
          <Route path="/add-donor" element={roleGuard(['admin'], <AddDonor onAddDonor={handleAddDonor} />)} />
          <Route path="/requests" element={roleGuard(['admin'], <Requests requests={requests} onRequestSubmit={handleRequestBlood} onFulfillRequest={handleFulfillRequest} onRejectRequest={handleRejectRequest} />)} />

          {/* Donor routes */}
          <Route path="/donor" element={roleGuard(['donor'], <DonorDashboard donorRecord={donorRecord} donorDonations={donorDonations} />)} />
          <Route path="/donor/profile" element={roleGuard(['donor'], <DonorProfile donorRecord={donorRecord} />)} />
          <Route path="/donor/appointments" element={roleGuard(['donor'], <DonationAppointment />)} />
          <Route path="/donor/history" element={roleGuard(['donor'], <DonationHistory donorDonations={donorDonations} />)} />
          <Route path="/donor/notifications" element={roleGuard(['donor'], <DonorNotifications />)} />
          <Route path="/my-portal" element={roleGuard(['donor'], <MyPortal donorRecord={donorRecord} donorDonations={donorDonations} />)} />

          {/* Patient routes */}
          <Route path="/patient" element={roleGuard(['patient'], <PatientDashboard requests={requests} inventory={inventory} />)} />
          <Route path="/patient/request" element={roleGuard(['patient'], <PatientRequest onRequestSubmit={handleRequestBlood} />)} />
          <Route path="/patient/status" element={roleGuard(['patient'], <RequestStatus requests={requests} />)} />
          <Route path="/patient/profile" element={roleGuard(['patient'], <PatientProfile user={user} />)} />
          <Route path="/patient/notifications" element={roleGuard(['patient'], <PatientNotifications />)} />

          <Route path="*" element={<Navigate to={getDefaultPath()} replace />} />
        </Routes>
      </main>
    </div>
  );
}
