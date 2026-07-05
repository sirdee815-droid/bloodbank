import React from 'react';
import { Users, Droplet, FlaskConical, Database, Send, Lock, BarChart3, Bell } from 'lucide-react';

const MODULES = [
  {
    title: 'Donor Management',
    icon: Users,
    summary:
      'Manages donor registration, personal details, medical history, and donation records so the blood bank can maintain an accurate and secure donor database.',
    bullets: [
      'Register donors with personal and medical information',
      'Store donation history and contact details',
      'Update and retrieve donor records for follow-up',
    ],
  },
  {
    title: 'Blood Collection',
    icon: Droplet,
    summary:
      'Records blood collection events, donation dates, blood type, quantity, and screening traceability to ensure every unit is linked to the correct donor.',
    bullets: [
      'Log collection dates and volumes',
      'Track donor-linked units for traceability',
      'Document collection and screening status',
    ],
  },
  {
    title: 'Blood Testing and Screening',
    icon: FlaskConical,
    summary:
      'Captures lab screening results for blood group typing and infection tests so only safe blood units enter inventory for transfusion.',
    bullets: [
      'Record blood group identification',
      'Screen for HIV, Hepatitis B, Hepatitis C',
      'Approve only safe blood for storage',
    ],
  },
  {
    title: 'Blood Inventory Management',
    icon: Database,
    summary:
      'Monitors stock levels, blood groups, storage conditions, and expiry dates to prevent shortages and reduce waste.',
    bullets: [
      'Track available units by blood group',
      'Monitor storage and expiry information',
      'Alert administrators when stock is low',
    ],
  },
  {
    title: 'Blood Request and Distribution',
    icon: Send,
    summary:
      'Handles incoming blood requests from hospitals and patients, verifies availability, and records distribution activity for accountability.',
    bullets: [
      'Submit electronic blood requests',
      'Verify stock availability before approval',
      'Document all distribution actions',
    ],
  },
  {
    title: 'User Authentication and Security',
    icon: Lock,
    summary:
      'Manages login, user roles, and access rights to protect sensitive donor, patient, and inventory information from unauthorized access.',
    bullets: [
      'Authenticate users with secure login',
      'Assign roles like admin, staff, and donor',
      'Restrict access based on user permissions',
    ],
  },
  {
    title: 'Reporting and Record Management',
    icon: BarChart3,
    summary:
      'Generates operational reports for donor activity, blood stock levels, requests, and transfusions to support decision-making and audits.',
    bullets: [
      'Produce donor and donation reports',
      'Monitor inventory and request trends',
      'Maintain organized historical records',
    ],
  },
  {
    title: 'Notification and Communication',
    icon: Bell,
    summary:
      'Sends alerts and reminders to donors and hospitals for donation schedules, blood shortages, and emergency requests to improve responsiveness.',
    bullets: [
      'Notify donors about donation opportunities',
      'Alert hospitals when stock is low',
      'Support emergency blood request communication',
    ],
  },
];

export default function SystemModules() {
  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '2rem' }}>
        <h1>System Modules</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '720px' }}>
          The Blood Bank Management System is built around modular capabilities that work together to streamline donor care, blood safety, inventory control, distribution,
          security, reporting, and communication.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {MODULES.map((module) => {
          const Icon = module.icon;
          return (
            <article key={module.title} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', display: 'grid', placeItems: 'center', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.08)', color: 'var(--primary)' }}>
                  <Icon style={{ width: '1.4rem', height: '1.4rem' }} />
                </div>
                <div>
                  <h2 style={{ margin: 0 }}>{module.title}</h2>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{module.summary}</p>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-primary)' }}>
                {module.bullets.map((bullet) => (
                  <li key={bullet} style={{ marginBottom: '0.5rem' }}>
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
