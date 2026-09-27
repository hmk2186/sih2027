const API_BASE = "http://127.0.0.1:8000/api";

export const api = {
  // Auth
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },

  async getCurrentUser() {
    const res = await fetch(`${API_BASE}/auth/me`);
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  },

  async switchRole(roleName) {
    const res = await fetch(`${API_BASE}/auth/switch-role?role_name=${encodeURIComponent(roleName)}`, {
      method: "POST"
    });
    if (!res.ok) throw new Error("Failed to switch role");
    return res.json();
  },

  // Stats
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/stats/dashboard`);
    if (!res.ok) throw new Error("Failed to load dashboard stats");
    return res.json();
  },

  // Sources
  async getSources() {
    const res = await fetch(`${API_BASE}/sources/`);
    if (!res.ok) throw new Error("Failed to load sources");
    return res.json();
  },

  async getSourcePresets() {
    const res = await fetch(`${API_BASE}/sources/presets/all`);
    if (!res.ok) throw new Error("Failed to load presets");
    return res.json();
  },

  async createSource(sourceData) {
    const res = await fetch(`${API_BASE}/sources/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sourceData)
    });
    if (!res.ok) throw new Error("Failed to create source");
    return res.json();
  },

  // Generations
  async createGenerationJob(jobData) {
    const res = await fetch(`${API_BASE}/generations/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData)
    });
    if (!res.ok) throw new Error("Failed to start generation job");
    return res.json();
  },

  async getGenerationJobs() {
    const res = await fetch(`${API_BASE}/generations/`);
    if (!res.ok) throw new Error("Failed to load generation jobs");
    return res.json();
  },

  async getGenerationJob(jobId) {
    const res = await fetch(`${API_BASE}/generations/${jobId}`);
    if (!res.ok) throw new Error("Failed to load generation job");
    return res.json();
  },

  async updateOutput(outputId, updateData) {
    const res = await fetch(`${API_BASE}/generations/output/${outputId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData)
    });
    if (!res.ok) throw new Error("Failed to update output");
    return res.json();
  },

  async regenerateOutput(outputId) {
    const res = await fetch(`${API_BASE}/generations/output/${outputId}/regenerate`, {
      method: "POST"
    });
    if (!res.ok) throw new Error("Failed to regenerate output");
    return res.json();
  },

  // Reviews
  async getPendingReviews() {
    const res = await fetch(`${API_BASE}/reviews/pending`);
    if (!res.ok) throw new Error("Failed to load pending reviews");
    return res.json();
  },

  async submitReview(outputId, reviewData) {
    const res = await fetch(`${API_BASE}/reviews/${outputId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) throw new Error("Failed to submit review");
    return res.json();
  },

  // Audit Logs
  async getAuditLogs(action = "", resourceType = "", limit = 50) {
    let url = `${API_BASE}/audit/?limit=${limit}`;
    if (action) url += `&action=${encodeURIComponent(action)}`;
    if (resourceType) url += `&resource_type=${encodeURIComponent(resourceType)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch audit logs");
    return res.json();
  },

  async exportAuditTrail() {
    const res = await fetch(`${API_BASE}/audit/export`);
    if (!res.ok) throw new Error("Failed to export audit trail");
    return res.json();
  }
};
