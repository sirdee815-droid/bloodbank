import React, { useState } from 'react';

const DEFAULT_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodGroups() {
  const [groups, setGroups] = useState(DEFAULT_GROUPS);
  const [newGroup, setNewGroup] = useState('');

  const handleAddGroup = () => {
    const normalized = newGroup.trim().toUpperCase();
    if (!normalized || groups.includes(normalized)) return;
    setGroups((current) => [...current, normalized]);
    setNewGroup('');
  };

  return (
    <div className="glass-card animate-slide-up">
      <h2>Blood Group Management</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Maintain the list of blood groups available for stock and requests.</p>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <input
          className="form-control"
          placeholder="Add new blood group"
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
          style={{ minWidth: '220px' }}
        />
        <button className="btn btn-primary" type="button" onClick={handleAddGroup}>
          Add Group
        </button>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'grid', gap: '0.75rem' }}>
        {groups.map((group) => (
          <div key={group} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
            <div>
              <strong>{group}</strong>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Used for inventory and request matching.</p>
            </div>
            <span className="badge badge-normal">Active</span>
          </div>
        ))}
      </div>
    </div>
  );
}
