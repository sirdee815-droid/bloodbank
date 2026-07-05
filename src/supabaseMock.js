// src/supabaseMock.js

const SEED_DATA = {
  profiles: [
    { id: "user-admin", email: "admin@bloodbank.org", full_name: "Dr. Sarah Jenkins", role: "admin" },
    { id: "user-donor", email: "donor@example.com", full_name: "John Doe", role: "donor", donor_id: "donor-1" },
    { id: "user-patient", email: "patient@example.com", full_name: "Patient Maya Lane", role: "patient" }
  ],
  users: [
    { id: "user-admin", email: "admin@bloodbank.org", password: "password123" },
    { id: "user-donor", email: "donor@example.com", password: "password123" },
    { id: "user-patient", email: "patient@example.com", password: "password123" }
  ],
  donors: [
    {
      id: "donor-1",
      full_name: "John Doe",
      gender: "Male",
      address: "123 Main St, Springfield",
      email: "donor@example.com",
      dob: "1990-05-15",
      blood_type: "O+",
      phone_no: "+237675123456",
      is_deferred: false,
      deferral_reason: "",
      last_donation_date: "2026-03-10",
      created_at: "2026-01-10T10:00:00Z"
    },
    {
      id: "donor-2",
      full_name: "Jane Smith",
      gender: "Female",
      address: "456 Elm St, Metropolis",
      email: "jane.smith@example.com",
      dob: "1995-09-20",
      blood_type: "A-",
      phone_no: "+237698765432",
      is_deferred: false,
      deferral_reason: "",
      last_donation_date: "2026-04-12",
      created_at: "2026-02-15T11:30:00Z"
    },
    {
      id: "donor-3",
      full_name: "Robert Johnson",
      gender: "Male",
      address: "789 Pine Rd, Riverdale",
      email: "robert.j@example.com",
      dob: "1988-11-02",
      blood_type: "AB+",
      phone_no: "+237677889900",
      is_deferred: false,
      deferral_reason: "",
      last_donation_date: null,
      created_at: "2026-03-01T08:15:00Z"
    },
    {
      id: "donor-4",
      full_name: "Emily Davis",
      gender: "Female",
      address: "101 Cedar Ln, Oakridge",
      email: "emily.d@example.com",
      dob: "2000-01-25",
      blood_type: "O-",
      phone_no: "+237690112233",
      is_deferred: true,
      deferral_reason: "Temporary deferral: Recent travel to malaria-endemic region.",
      last_donation_date: "2026-05-20",
      created_at: "2026-04-05T14:00:00Z"
    }
  ],
  donations: [
    { id: "don-1", donor_id: "donor-1", blood_type: "O+", collected_at: "2026-03-10T10:30:00Z", volume_ml: 450, status: "released", notes: "Routine donation. No issues." },
    { id: "don-2", donor_id: "donor-2", blood_type: "A-", collected_at: "2026-04-12T09:15:00Z", volume_ml: 450, status: "released", notes: "First-time donor." },
    { id: "don-3", donor_id: "donor-4", blood_type: "O-", collected_at: "2026-05-20T11:00:00Z", volume_ml: 450, status: "quarantined", notes: "Pending full screening verification." }
  ],
  blood_inventory: {
    "A+": 12,
    "A-": 4,
    "B+": 8,
    "B-": 2,
    "AB+": 5,
    "AB-": 1,
    "O+": 15,
    "O-": 6
  },
  blood_requests: [
    { id: "req-1", patient_name: "Alice Brown", blood_type: "B+", units_requested: 2, urgency: "critical", hospital_name: "City General Hospital", contact_phone: "+237678998888", status: "pending", created_at: "2026-05-26T10:30:00Z" },
    { id: "req-2", patient_name: "Michael Wilson", blood_type: "O+", units_requested: 3, urgency: "normal", hospital_name: "St. Jude Hospital", contact_phone: "+237699776666", status: "approved", created_at: "2026-05-25T14:20:00Z" },
    { id: "req-3", patient_name: "Sarah Connor", blood_type: "A-", units_requested: 1, urgency: "urgent", hospital_name: "County Memorial Hospital", contact_phone: "+237682883333", status: "fulfilled", created_at: "2026-05-24T09:00:00Z" }
  ]
};

// Initialize localStorage if not present
const initDB = () => {
  if (!localStorage.getItem("bbms_initialized")) {
    localStorage.setItem("bbms_profiles", JSON.stringify(SEED_DATA.profiles));
    localStorage.setItem("bbms_users", JSON.stringify(SEED_DATA.users));
    localStorage.setItem("bbms_donors", JSON.stringify(SEED_DATA.donors));
    localStorage.setItem("bbms_donations", JSON.stringify(SEED_DATA.donations));
    localStorage.setItem("bbms_blood_inventory", JSON.stringify(SEED_DATA.blood_inventory));
    localStorage.setItem("bbms_blood_requests", JSON.stringify(SEED_DATA.blood_requests));
    localStorage.setItem("bbms_initialized", "true");
  }
};

initDB();

// Helper to get collection from localStorage
const getTable = (name) => {
  return JSON.parse(localStorage.getItem(`bbms_${name}`) || "[]");
};

// Helper to save collection to localStorage
const saveTable = (name, data) => {
  localStorage.setItem(`bbms_${name}`, JSON.stringify(data));
};

export const supabaseMock = {
  auth: {
    getUser: () => {
      const activeUserId = localStorage.getItem("bbms_active_user_id");
      if (!activeUserId) return { data: { user: null }, error: null };
      
      const profiles = getTable("profiles");
      const userProfile = profiles.find(p => p.id === activeUserId);
      
      return {
        data: {
          user: userProfile ? { id: userProfile.id, email: userProfile.email, user_metadata: { full_name: userProfile.full_name, role: userProfile.role, donor_id: userProfile.donor_id } } : null
        },
        error: null
      };
    },
    
    signInWithPassword: async ({ email, password }) => {
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const users = getTable("users");
      const profiles = getTable("profiles");
      
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!user) {
        return { data: null, error: { message: "Invalid login credentials" } };
      }
      
      const profile = profiles.find(p => p.id === user.id);
      localStorage.setItem("bbms_active_user_id", user.id);
      
      return {
        data: {
          user: { id: user.id, email: user.email, user_metadata: { full_name: profile.full_name, role: profile.role, donor_id: profile?.donor_id } }
        },
        error: null
      };
    },
    
    signUp: async ({ email, password, options }) => {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const users = getTable("users");
      const profiles = getTable("profiles");
      
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { data: null, error: { message: "User already exists" } };
      }
      
      const newUserId = `user-${Math.random().toString(36).substr(2, 9)}`;
      const role = options?.data?.role || "donor";
      const fullName = options?.data?.full_name || email.split("@")[0];
      
      // If role is donor, we also create a donor record or link it
      let donorId = null;
      if (role === "donor") {
        donorId = `donor-${Math.random().toString(36).substr(2, 9)}`;
        const donors = getTable("donors");
        const newDonor = {
          id: donorId,
          full_name: fullName,
          gender: "Male", // Default, user can update later
          address: "Please update address",
          email: email,
          dob: "2000-01-01",
          blood_type: "O+",
          phone_no: "Not provided",
          is_deferred: false,
          deferral_reason: "",
          last_donation_date: null,
          created_at: new Date().toISOString()
        };
        donors.push(newDonor);
        saveTable("donors", donors);
      }
      
      const newUser = { id: newUserId, email, password };
      const newProfile = { id: newUserId, email, full_name: fullName, role, donor_id: donorId };
      
      users.push(newUser);
      profiles.push(newProfile);
      
      saveTable("users", users);
      saveTable("profiles", profiles);
      
      localStorage.setItem("bbms_active_user_id", newUserId);
      
      return {
        data: {
          user: { id: newUserId, email, user_metadata: { full_name: fullName, role, donor_id: donorId } }
        },
        error: null
      };
    },
    
    signOut: async () => {
      localStorage.removeItem("bbms_active_user_id");
      return { error: null };
    },

    resetPasswordForEmail: async (email) => {
      // Simulate sending a reset email (no real delivery in the mock)
      await new Promise(resolve => setTimeout(resolve, 500));
      return { data: {}, error: null };
    },

    updateUser: async ({ password }) => {
      await new Promise(resolve => setTimeout(resolve, 400));
      const activeUserId = localStorage.getItem("bbms_active_user_id");
      if (activeUserId && password) {
        const users = getTable("users");
        const idx = users.findIndex(u => u.id === activeUserId);
        if (idx !== -1) {
          users[idx].password = password;
          saveTable("users", users);
        }
      }
      return { data: { user: null }, error: null };
    },

    onAuthStateChange: () => {
      // No realtime auth events in the mock; return an unsubscribe stub
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  
  // Simulated Database queries
  from: (tableName) => {
    return {
      select: function(query = "*") {
        this.action = "select";
        this.queryFields = query;
        return this;
      },
      
      insert: function(values) {
        this.action = "insert";
        this.values = values;
        return this;
      },
      
      update: function(values) {
        this.action = "update";
        this.values = values;
        return this;
      },
      
      delete: function() {
        this.action = "delete";
        return this;
      },
      
      eq: function(field, value) {
        if (!this.filters) this.filters = [];
        this.filters.push({ type: "eq", field, value });
        return this;
      },

      match: function(obj) {
        Object.entries(obj).forEach(([field, value]) => {
          if (!this.filters) this.filters = [];
          this.filters.push({ type: "eq", field, value });
        });
        return this;
      },
      
      order: function(field, { ascending = true } = {}) {
        this.sort = { field, ascending };
        return this;
      },
      
      // Execution method
      then: async function(callback) {
        // Simulate network latency
        await new Promise(resolve => setTimeout(resolve, 200));
        
        let data = getTable(tableName);
        let error = null;
        
        try {
          if (this.action === "select") {
            // Apply filters
            if (this.filters) {
              for (const filter of this.filters) {
                if (filter.type === "eq") {
                  // Special check if table is blood_inventory (which is an object instead of array in localStorage)
                  if (tableName === "blood_inventory") {
                    const inventoryObj = JSON.parse(localStorage.getItem("bbms_blood_inventory") || "{}");
                    if (filter.field === "blood_type") {
                      data = [{ blood_type: filter.value, units_available: inventoryObj[filter.value] || 0 }];
                    }
                  } else {
                    data = data.filter(item => item[filter.field] === filter.value);
                  }
                }
              }
            }
            
            // Format blood_inventory if we are selecting all
            if (tableName === "blood_inventory" && (!this.filters || this.filters.length === 0)) {
              const inventoryObj = JSON.parse(localStorage.getItem("bbms_blood_inventory") || "{}");
              data = Object.keys(inventoryObj).map(bt => ({
                blood_type: bt,
                units_available: inventoryObj[bt]
              }));
            }
            
            // Apply sorting
            if (this.sort && Array.isArray(data)) {
              const { field, ascending } = this.sort;
              data.sort((a, b) => {
                let valA = a[field];
                let valB = b[field];
                if (typeof valA === "string") {
                  return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
                }
                return ascending ? valA - valB : valB - valA;
              });
            }
          }
          
          else if (this.action === "insert") {
            const itemsToInsert = Array.isArray(this.values) ? this.values : [this.values];
            
            if (tableName === "blood_inventory") {
              const inventoryObj = JSON.parse(localStorage.getItem("bbms_blood_inventory") || "{}");
              for (const item of itemsToInsert) {
                inventoryObj[item.blood_type] = (inventoryObj[item.blood_type] || 0) + item.units_available;
              }
              localStorage.setItem("bbms_blood_inventory", JSON.stringify(inventoryObj));
              data = itemsToInsert;
            } else {
              const currentTable = getTable(tableName);
              const processedItems = itemsToInsert.map(item => ({
                id: item.id || `${tableName.substr(0, 3)}-${Math.random().toString(36).substr(2, 9)}`,
                created_at: new Date().toISOString(),
                ...item
              }));
              
              currentTable.push(...processedItems);
              saveTable(tableName, currentTable);
              data = processedItems;
              
              // Side effect: If a donation is added and status is 'released', update blood_inventory!
              if (tableName === "donations") {
                for (const don of processedItems) {
                  if (don.status === "released") {
                    const inventoryObj = JSON.parse(localStorage.getItem("bbms_blood_inventory") || "{}");
                    inventoryObj[don.blood_type] = (inventoryObj[don.blood_type] || 0) + 1;
                    localStorage.setItem("bbms_blood_inventory", JSON.stringify(inventoryObj));
                  }
                  // Update donor last donation date
                  const donors = getTable("donors");
                  const dIdx = donors.findIndex(d => d.id === don.donor_id);
                  if (dIdx !== -1) {
                    donors[dIdx].last_donation_date = don.collected_at.split("T")[0];
                    saveTable("donors", donors);
                  }
                }
              }
            }
          }
          
          else if (this.action === "update") {
            if (tableName === "blood_inventory") {
              const inventoryObj = JSON.parse(localStorage.getItem("bbms_blood_inventory") || "{}");
              if (this.filters) {
                const btFilter = this.filters.find(f => f.field === "blood_type");
                if (btFilter) {
                  inventoryObj[btFilter.value] = this.values.units_available;
                  localStorage.setItem("bbms_blood_inventory", JSON.stringify(inventoryObj));
                  data = [{ blood_type: btFilter.value, units_available: this.values.units_available }];
                }
              } else {
                // No filter: update all (fallback)
                Object.keys(inventoryObj).forEach(bt => {
                  if (this.values.units_available !== undefined) inventoryObj[bt] = this.values.units_available;
                });
                localStorage.setItem("bbms_blood_inventory", JSON.stringify(inventoryObj));
                data = Object.keys(inventoryObj).map(bt => ({ blood_type: bt, units_available: inventoryObj[bt] }));
              }
            } else {
              const currentTable = getTable(tableName);
              let updatedCount = 0;
              
              const updatedTable = currentTable.map(item => {
                let matches = true;
                if (this.filters) {
                  for (const filter of this.filters) {
                    if (filter.type === "eq" && item[filter.field] !== filter.value) {
                      matches = false;
                    }
                  }
                }
                if (matches) {
                  updatedCount++;
                  
                  // Side effect checks:
                  // If donation status changes to 'released', increment inventory. If changed from released to expired/transfused, decrement inventory!
                  if (tableName === "donations" && this.values.status && this.values.status !== item.status) {
                    const inventoryObj = JSON.parse(localStorage.getItem("bbms_blood_inventory") || "{}");
                    if (this.values.status === "released") {
                      inventoryObj[item.blood_type] = (inventoryObj[item.blood_type] || 0) + 1;
                    } else if (item.status === "released") {
                      inventoryObj[item.blood_type] = Math.max(0, (inventoryObj[item.blood_type] || 0) - 1);
                    }
                    localStorage.setItem("bbms_blood_inventory", JSON.stringify(inventoryObj));
                  }
                  
                  // If blood request status changes to 'approved' or 'fulfilled', manage inventory
                  if (tableName === "blood_requests" && this.values.status === "fulfilled" && item.status !== "fulfilled") {
                    const inventoryObj = JSON.parse(localStorage.getItem("bbms_blood_inventory") || "{}");
                    inventoryObj[item.blood_type] = Math.max(0, (inventoryObj[item.blood_type] || 0) - item.units_requested);
                    localStorage.setItem("bbms_blood_inventory", JSON.stringify(inventoryObj));
                  }
                  
                  return { ...item, ...this.values };
                }
                return item;
              });
              
              saveTable(tableName, updatedTable);
              data = updatedTable.filter(item => {
                if (this.filters) {
                  for (const filter of this.filters) {
                    if (filter.type === "eq" && item[filter.field] !== filter.value) return false;
                  }
                }
                return true;
              });
            }
          }
          
          else if (this.action === "delete") {
            const currentTable = getTable(tableName);
            const remainingTable = currentTable.filter(item => {
              let matches = true;
              if (this.filters) {
                for (const filter of this.filters) {
                  if (filter.type === "eq" && item[filter.field] !== filter.value) {
                    matches = false;
                  }
                }
              }
              return !matches; // Keep those that don't match criteria
            });
            saveTable(tableName, remainingTable);
            data = { success: true };
          }
          
        } catch (e) {
          error = { message: e.message };
        }
        
        callback({ data, error });
        return this;
      }
    };
  }
};
