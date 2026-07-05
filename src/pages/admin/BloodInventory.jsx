import React, { useMemo } from 'react';

export default function BloodInventory({ inventory, onAdjustInventory }) {
  const inventoryItems = useMemo(
    () => (inventory || []).map((item) => ({ blood_type: item.blood_type, units_available: item.units_available || 0 })),
    [inventory]
  );

  return (
    <div className="glass-card animate-slide-up">
      <h2>Blood Inventory Management</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Monitor stock, update quantities, and keep track of availability.</p>

      <div className="table-container" style={{ marginTop: '1.5rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Blood Group</th>
              <th>Available Units</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '1.25rem', color: 'var(--text-secondary)' }}>
                  No inventory data available.
                </td>
              </tr>
            ) : (
              inventoryItems.map((item) => (
                <tr key={item.blood_type}>
                  <td>{item.blood_type}</td>
                  <td>{item.units_available}</td>
                  <td style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" type="button" onClick={() => onAdjustInventory(item.blood_type, -1)}>
                      -1
                    </button>
                    <button className="btn btn-secondary" type="button" onClick={() => onAdjustInventory(item.blood_type, 1)}>
                      +1
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
