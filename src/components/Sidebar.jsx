import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Activity, UserPlus, Users, FileText, Shield, LogOut, ClipboardList, Database, Search, Bell, CalendarCheck, BarChart3 } from 'lucide-react';

export default function Sidebar({ user, role, onLogout }) {
  const isAdmin = role === 'admin';
  const isDonor = role === 'donor';
  const isPatient = role === 'patient';

  const navClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <Heart className="logo-icon fill-current" />
        <span className="logo-text">REDLIFE BBMS</span>
      </div>

      <nav>
        <ul className="nav-links">
          {isAdmin && (
            <>
              <li>
                <NavLink to="/" className={navClass} end>
                  <Activity style={{ width: '1.2rem', height: '1.2rem' }} />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/manage-donors" className={navClass}>
                  <Users style={{ width: '1.2rem', height: '1.2rem' }} />
                  Manage Donors
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/inventory" className={navClass}>
                  <Database style={{ width: '1.2rem', height: '1.2rem' }} />
                  Blood Inventory
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/requests" className={navClass}>
                  <ClipboardList style={{ width: '1.2rem', height: '1.2rem' }} />
                  Blood Requests
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/blood-groups" className={navClass}>
                  <Search style={{ width: '1.2rem', height: '1.2rem' }} />
                  Blood Groups
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/patients" className={navClass}>
                  <Heart style={{ width: '1.2rem', height: '1.2rem' }} />
                  Patients
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/reports" className={navClass}>
                  <BarChart3 style={{ width: '1.2rem', height: '1.2rem' }} />
                  Reports
                </NavLink>
              </li>
              {isAdmin && (
                <li>
                  <NavLink to="/admin/users" className={navClass}>
                    <Shield style={{ width: '1.2rem', height: '1.2rem' }} />
                    User Management
                  </NavLink>
                </li>
              )}
            </>
          )}

          {isDonor && (
            <>
              <li>
                <NavLink to="/donor" className={navClass} end>
                  <Activity style={{ width: '1.2rem', height: '1.2rem' }} />
                  Donor Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/donor/profile" className={navClass}>
                  <Users style={{ width: '1.2rem', height: '1.2rem' }} />
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/donor/appointments" className={navClass}>
                  <CalendarCheck style={{ width: '1.2rem', height: '1.2rem' }} />
                  Appointments
                </NavLink>
              </li>
              <li>
                <NavLink to="/donor/history" className={navClass}>
                  <FileText style={{ width: '1.2rem', height: '1.2rem' }} />
                  History
                </NavLink>
              </li>
              <li>
                <NavLink to="/donor/notifications" className={navClass}>
                  <Bell style={{ width: '1.2rem', height: '1.2rem' }} />
                  Notifications
                </NavLink>
              </li>
            </>
          )}

          {isPatient && (
            <>
              <li>
                <NavLink to="/patient" className={navClass} end>
                  <Activity style={{ width: '1.2rem', height: '1.2rem' }} />
                  Patient Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/patient/request" className={navClass}>
                  <ClipboardList style={{ width: '1.2rem', height: '1.2rem' }} />
                  Request Blood
                </NavLink>
              </li>
              <li>
                <NavLink to="/patient/status" className={navClass}>
                  <FileText style={{ width: '1.2rem', height: '1.2rem' }} />
                  Request Status
                </NavLink>
              </li>
              <li>
                <NavLink to="/patient/profile" className={navClass}>
                  <Users style={{ width: '1.2rem', height: '1.2rem' }} />
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/patient/notifications" className={navClass}>
                  <Bell style={{ width: '1.2rem', height: '1.2rem' }} />
                  Notifications
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="user-profile-section">
        <div className="user-identity">
          <span style={{ fontWeight: '700', fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {user?.user_metadata?.full_name}
          </span>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Shield style={{ width: '0.75rem', height: '0.75rem' }} />
            {role}
          </span>
        </div>
        <button className="btn btn-secondary logout-btn" onClick={onLogout} title="Log Out">
          <LogOut style={{ width: '1rem', height: '1rem' }} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
