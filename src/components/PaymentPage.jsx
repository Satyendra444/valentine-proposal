import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Shield, ArrowLeft, Check, Heart, Copy, Share2, X, Smartphone, Building2, Wallet, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import apiService from '../services/api'
import razorpayService from '../services/razorpay'
import './PaymentPage.css'

const PaymentPage = () => {
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [magicLink, setMagicLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [proposalData, setProposalData] = useState(null)
  const [error, setError] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState('')

  useEffect(() => {
    // Get proposal data from localStorage
    const storedData = localStorage.getItem('proposalData')
    if (storedData) {
      setProposalData(JSON.parse(storedData))
    } else {
      // Redirect to create page if no proposal data
      navigate('/create')
    }

    // Load Razorpay payment methods
    const methods = razorpayService.getPaymentMethods()
    setPaymentMethods(methods)
    setSelectedMethod(methods[0]?.id || 'card')
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(magicLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = magicLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Valentine\'s Day Proposal 💕',
          text: 'Someone has a special question for you! 💖',
          url: magicLink,
        })
      } catch (err) {
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    if (!proposalData) return

    setIsProcessing(true)
    setError('')

    try {
      // Create Razorpay order using the correct API endpoint
      const orderData = await apiService.createRazorpayOrder(
        proposalData.proposal_id,
        29.00 // Amount in INR - corrected to ₹29
      )

      // Prepare payment data for Razorpay using API response format
      const paymentData = {
        // Data from API response
        key_id: orderData.key_id,
        amount: orderData.amount, // Already in paise from API
        currency: orderData.currency,
        order_id: orderData.order_id,

        // Additional data for checkout
        proposal_id: proposalData.proposal_id,
        customerName: proposalData.fromName,
        customerEmail: proposalData.email,
        from_name: proposalData.fromName,
        to_name: proposalData.toName,

        onSuccess: async (razorpayResponse) => {
          try {
            // Verify payment using the correct API endpoint
            const verificationData = {
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature
            }

            const verificationResult = await apiService.verifyRazorpayPayment(verificationData)

            if (verificationResult.success) {
              // Generate magic link from proposal data
              const generatedLink = `${window.location.origin}/proposal/view/${verificationResult.access_token}`

              setMagicLink(generatedLink)
              setAccessToken(verificationResult.access_token)
              setShowSuccessModal(true)

              // Store access token for later use
              localStorage.setItem('accessToken', verificationResult.access_token)
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError)
            setError('Payment completed but verification failed. Please contact support.')
          } finally {
            setIsProcessing(false)
          }
        },
        onFailure: (errorData) => {
          console.error('Payment failed:', errorData)
          setError(`Payment failed: ${errorData.description || 'Unknown error'}`)
          setIsProcessing(false)
        },
        onCancel: (message) => {
          console.log('Payment cancelled:', message)
          setError('Payment was cancelled')
          setIsProcessing(false)
        }
      }

      // Process payment with Razorpay
      await razorpayService.processPayment(paymentData)

    } catch (error) {
      console.error('Payment error:', error)
      setError(error.message || 'Payment failed. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <div className="payment-page">
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              className="success-modal"
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setShowSuccessModal(false)}
              >
                <X size={20} />
              </button>

              <div className="modal-header">
                <motion.div
                  className="success-icon"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  🎉
                </motion.div>
                <h2>Payment Successful!</h2>
                <p>Your magical Valentine's proposal is ready! 💕</p>
              </div>

              <div className="magic-link-section">
                <h3>Your Magic Link:</h3>
                <div className="link-container">
                  <div className="link-display">
                    <span className="link-text">{magicLink}</span>
                  </div>
                  <div className="link-actions">
                    <motion.button
                      className="copy-btn"
                      onClick={copyToClipboard}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Copy size={18} />
                      {copied ? 'Copied!' : 'Copy'}
                    </motion.button>
                    <motion.button
                      className="share-btn"
                      onClick={shareLink}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Share2 size={18} />
                      Share
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="modal-instructions">
                <div className="instruction-item">
                  <span className="step-number">1</span>
                  <span>Copy or share this magical link</span>
                </div>
                <div className="instruction-item">
                  <span className="step-number">2</span>
                  <span>Send it to your special someone</span>
                </div>
                <div className="instruction-item">
                  <span className="step-number">3</span>
                  <span>Wait for their heart to melt! 💖</span>
                </div>
              </div>

              <div className="modal-actions">
                <motion.button
                  className="btn btn-secondary"
                  onClick={() => navigate('/')}
                  whileHover={{ scale: 1.02 }}
                >
                  Create Another
                </motion.button>
                <motion.button
                  className="btn btn-primary"
                  onClick={() => {
                    navigate(`/proposal/view/${accessToken}`)
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  Preview Proposal
                  <Heart size={18} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="payment-container">
        {magicLink ? (
          <motion.div
            className="payment-success-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="success-header">
              <motion.div
                className="success-icon-large"
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.div>
              <h1>Proposal Created Successfully!</h1>
              <p>Your magical link is ready to share.</p>
            </div>

            <div className="magic-link-card glass-card">
              <h3>🔗 Your Magic Link</h3>
              <div className="link-display-large">
                {magicLink}
              </div>
              <div className="link-actions-large">
                <motion.button
                  className="btn btn-primary copy-btn-large"
                  onClick={copyToClipboard}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Copy size={20} />
                  {copied ? 'Copied Link!' : 'Copy Link'}
                </motion.button>
                <motion.button
                  className="btn btn-secondary share-btn-large"
                  onClick={shareLink}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 size={20} />
                  Share
                </motion.button>
              </div>
            </div>

            <div className="next-steps">
              <button className="btn btn-secondary" onClick={() => navigate('/')}>Create Another</button>
              <button className="btn btn-primary" onClick={() => window.open(magicLink, '_blank')}>View Proposal <TrendingUp size={18} /></button>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="payment-header"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <button
                className="back-button"
                onClick={() => navigate('/create')}
              >
                <ArrowLeft size={20} />
              </button>
              <h1>
                <Heart className="heart-icon" size={30} />
                Complete Your Payment
              </h1>
              <p>Just ₹29 to create your magical Valentine's proposal!</p>
            </motion.div>

            <div className="payment-content">
              <motion.div
                className="order-summary"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3>Order Summary</h3>
                <div className="summary-item">
                  <span>Valentine's Proposal Package</span>
                  <span>₹29</span>
                </div>
                <div className="summary-features">
                  <div className="feature">
                    <Check size={16} />
                    <span>Personalized proposal page</span>
                  </div>
                  <div className="feature">
                    <Check size={16} />
                    <span>Beautiful animations & effects</span>
                  </div>
                  <div className="feature">
                    <Check size={16} />
                    <span>Shareable magic link</span>
                  </div>
                  <div className="feature">
                    <Check size={16} />
                    <span>Interactive response system</span>
                  </div>
                </div>
                <div className="summary-total">
                  <span>Total: ₹29</span>
                </div>
              </motion.div>

              <motion.div
                className="payment-form-container"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="payment-methods">
                  <h3>Choose Payment Method</h3>
                  <div className="method-options">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`method-option ${selectedMethod === method.id ? 'active' : ''}`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedMethod === method.id}
                          onChange={(e) => setSelectedMethod(e.target.value)}
                        />
                        <span className="method-icon">{method.icon}</span>
                        <div className="method-info">
                          <span className="method-name">{method.name}</span>
                          <small className="method-description">{method.description}</small>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="payment-note">
                    <Shield size={16} />
                    <span>All payments are processed securely through Razorpay</span>
                  </div>
                </div>

                <form className="payment-form" onSubmit={handlePayment}>
                  {error && (
                    <div className="error-message">
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="razorpay-info">
                    <div className="info-item">
                      <Shield size={18} />
                      <div>
                        <strong>Secure Payment</strong>
                        <p>Your payment is processed securely by Razorpay with bank-level encryption</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <Heart size={18} />
                      <div>
                        <strong>Instant Access</strong>
                        <p>Get your magic link immediately after successful payment</p>
                      </div>
                    </div>
                  </div>

                  <div className="payment-summary">
                    <div className="summary-row">
                      <span>Valentine's Proposal Package</span>
                      <span>{razorpayService.formatAmount(29)}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total Amount</span>
                      <span>{razorpayService.formatAmount(29)}</span>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className="btn btn-primary pay-button"
                    disabled={isProcessing}
                    whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                  >
                    {isProcessing ? (
                      <>
                        <div className="spinner"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        Pay {razorpayService.formatAmount(29)} & Create Magic Link
                        <Heart size={20} />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </div>

      <div className="payment-decorations">
        <div className="decoration-1">💳</div>
        <div className="decoration-2">💖</div>
        <div className="decoration-3">✨</div>
      </div>
    </div>
  )
}

export default PaymentPage