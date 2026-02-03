import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Shield, ArrowLeft, Check, Heart, Copy, Share2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './PaymentPage.css'

const PaymentPage = () => {
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [magicLink, setMagicLink] = useState('')
  const [copied, setCopied] = useState(false)

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
    setIsProcessing(true)
    
    // Mock payment processing
    setTimeout(() => {
      // Generate mock magic link
      const proposalId = Date.now().toString()
      const generatedLink = `${window.location.origin}/proposal/${proposalId}`
      
      // Store the magic link
      localStorage.setItem('magicLink', generatedLink)
      localStorage.setItem('proposalId', proposalId)
      
      setMagicLink(generatedLink)
      setIsProcessing(false)
      setShowSuccessModal(true)
    }, 3000)
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
                    const proposalId = localStorage.getItem('proposalId')
                    navigate(`/proposal/${proposalId}`)
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
                <label className={`method-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <CreditCard size={20} />
                  <span>Credit/Debit Card</span>
                </label>
                
                <label className={`method-option ${paymentMethod === 'upi' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="upi-icon">📱</span>
                  <span>UPI</span>
                </label>
              </div>
            </div>

            <form className="payment-form" onSubmit={handlePayment}>
              {paymentMethod === 'card' && (
                <div className="card-details">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="upi-details">
                  <div className="form-group">
                    <label>UPI ID</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="yourname@paytm"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="security-info">
                <Shield size={16} />
                <span>Your payment information is secure and encrypted</span>
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
                    Pay ₹29 & Create Magic Link
                    <Heart size={20} />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
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