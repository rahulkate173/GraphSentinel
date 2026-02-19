/**
 * API client for RingForge AML Backend.
 * In dev, empty base = use Vite proxy to localhost:8000. Set VITE_API_URL in .env for production.
 */
const raw = (import.meta.env.VITE_API_URL ?? '').toString().replace(/\/$/, '');
const API_BASE_URL = raw || '';

class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async analyzeAnomalies(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/api/v1/anomalies/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(error.detail || 'Failed to analyze anomalies');
    }

    return response.json();
  }

  async getResults() {
    const response = await fetch(`${this.baseUrl}/api/v1/anomalies/results`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch results');
    }

    return response.json();
  }

  async downloadResults() {
    const response = await fetch(`${this.baseUrl}/api/v1/anomalies/download`);

    if (!response.ok) {
      throw new Error('Failed to download results');
    }

    return response.blob();
  }

  async getRings() {
    const response = await fetch(`${this.baseUrl}/api/v1/rings/`);
    if (!response.ok) throw new Error('Failed to fetch rings');
    return response.json();
  }

  async getAccounts() {
    const response = await fetch(`${this.baseUrl}/api/v1/accounts/`);
    if (!response.ok) throw new Error('Failed to fetch accounts');
    return response.json();
  }
}

const apiClient = new ApiClient();
export default apiClient;
