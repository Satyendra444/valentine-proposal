// Razorpay Payment Service for Valentine's Day Proposal App

class RazorpayService {
  constructor() {
    this.keyId = import.meta.env.VITE_RAZORPAY_KEY_ID
    this.isLoaded = false
    this.loadRazorpay()
  }

  // Load Razorpay script dynamically
  async loadRazorpay() {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        this.isLoaded = true
        resolve(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        this.isLoaded = true
        resolve(true)
      }
      script.onerror = () => {
        reject(new Error('Failed to load Razorpay SDK'))
      }
      document.head.appendChild(script)
    })
  }

  // Create Razorpay order and handle payment
  async processPayment(paymentData) {
    try {
      // Ensure Razorpay is loaded
      await this.loadRazorpay()

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded')
      }

      const options = {
        key: paymentData.key_id, // Use key_id from API response
        amount: paymentData.amount, // Amount in paise from API
        currency: paymentData.currency || 'INR',
        name: 'Valentine\'s Day Proposal 💕',
        description: 'Create your magical Valentine\'s proposal',
        image: '/vite.svg', // Your app logo
        order_id: paymentData.order_id, // Order ID from backend API
        handler: (response) => {
          // Payment successful - verify on backend
          this.handlePaymentSuccess(response, paymentData.onSuccess)
        },
        prefill: {
          name: paymentData.customerName || '',
          email: paymentData.customerEmail || '',
          contact: paymentData.customerPhone || ''
        },
        notes: {
          proposal_id: paymentData.proposal_id,
          from_name: paymentData.from_name,
          to_name: paymentData.to_name
        },
        theme: {
          color: '#ff6b9d' // Valentine's pink theme
        },
        modal: {
          ondismiss: () => {
            if (paymentData.onCancel) {
              paymentData.onCancel('Payment cancelled by user')
            }
          }
        },
        retry: {
          enabled: true,
          max_count: 3
        }
      }

      const razorpay = new window.Razorpay(options)
      
      // Handle payment failure
      razorpay.on('payment.failed', (response) => {
        this.handlePaymentFailure(response, paymentData.onFailure)
      })

      // Open Razorpay checkout
      razorpay.open()

    } catch (error) {
      console.error('Razorpay payment error:', error)
      if (paymentData.onFailure) {
        paymentData.onFailure(error.message)
      }
      throw error
    }
  }

  // Handle successful payment
  handlePaymentSuccess(response, onSuccess) {
    console.log('Payment successful:', response)
    
    const paymentData = {
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature
    }

    if (onSuccess) {
      onSuccess(paymentData)
    }
  }

  // Handle payment failure
  handlePaymentFailure(response, onFailure) {
    console.error('Payment failed:', response)
    
    const errorData = {
      code: response.error.code,
      description: response.error.description,
      source: response.error.source,
      step: response.error.step,
      reason: response.error.reason,
      metadata: response.error.metadata
    }

    if (onFailure) {
      onFailure(errorData)
    }
  }

  // Verify payment on backend
  async verifyPayment(paymentData) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      })

      if (!response.ok) {
        throw new Error('Payment verification failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Payment verification error:', error)
      throw error
    }
  }

  // Get payment methods available
  getPaymentMethods() {
    return [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        icon: '💳',
        description: 'Visa, Mastercard, RuPay, etc.'
      },
      {
        id: 'netbanking',
        name: 'Net Banking',
        icon: '🏦',
        description: 'All major banks supported'
      },
      {
        id: 'upi',
        name: 'UPI',
        icon: '📱',
        description: 'PhonePe, Google Pay, Paytm, etc.'
      },
      {
        id: 'wallet',
        name: 'Wallets',
        icon: '👛',
        description: 'Paytm, Mobikwik, etc.'
      },
      {
        id: 'emi',
        name: 'EMI',
        icon: '📊',
        description: 'Easy monthly installments'
      }
    ]
  }

  // Format amount for display
  formatAmount(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }
}

// Create and export singleton instance
const razorpayService = new RazorpayService()
export default razorpayService