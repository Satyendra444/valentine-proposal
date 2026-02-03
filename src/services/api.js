// API service for Valentine's Day Proposal App
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

class ApiService {
  // Helper method for making API requests
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Helper method for making multipart form requests
  async makeFormRequest(endpoint, formData) {
    const url = `${API_BASE_URL}${endpoint}`
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData, // Don't set Content-Type header for FormData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API form request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Create a new proposal
  async createProposal(proposalData) {
    const formData = new FormData()
    formData.append('from_name', proposalData.fromName)
    formData.append('to_name', proposalData.toName)
    formData.append('email', proposalData.email)
    formData.append('message', proposalData.message)
    
    if (proposalData.image) {
      formData.append('file', proposalData.image)
    }

    return await this.makeFormRequest('/proposals/create', formData)
  }

  // Get proposal by magic link
  async getProposalByMagicLink(magicLink) {
    return await this.makeRequest(`/proposals/magic/${magicLink}`)
  }

  // View proposal with access token
  async viewProposal(token) {
    return await this.makeRequest(`/proposals/view/${token}`)
  }

  // Create payment intent (Stripe - as per API docs)
  async createPaymentIntent(proposalId, amount) {
    return await this.makeRequest('/payments/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        proposal_id: proposalId,
        amount: amount
      })
    })
  }

  // Create Razorpay order (matching API docs)
  async createRazorpayOrder(proposalId, amount) {
    return await this.makeRequest('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({
        proposal_id: proposalId,
        amount: amount
      })
    })
  }

  // Verify Razorpay payment (matching API docs)
  async verifyRazorpayPayment(paymentData) {
    return await this.makeRequest('/payments/verify-payment', {
      method: 'POST',
      body: JSON.stringify({
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature
      })
    })
  }

  // Handle Razorpay webhook (called by backend)
  async handleRazorpayWebhook(webhookData) {
    return await this.makeRequest('/payments/webhook', {
      method: 'POST',
      headers: {
        'x-razorpay-signature': webhookData.signature,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookData.payload)
    })
  }

  // Get payment status
  async getPaymentStatus(proposalId) {
    return await this.makeRequest(`/payments/status/${proposalId}`)
  }

  // Handle Stripe payment confirmation (client-side)
  async confirmPayment(paymentIntentId, paymentMethod) {
    // This would typically use Stripe's client library
    // For now, we'll simulate the payment confirmation
    return {
      success: true,
      payment_intent: {
        id: paymentIntentId,
        status: 'succeeded'
      }
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService()
export default apiService

// Export individual methods for convenience
export const {
  createProposal,
  getProposalByMagicLink,
  viewProposal,
  createPaymentIntent,
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook,
  getPaymentStatus,
  confirmPayment
} = apiService