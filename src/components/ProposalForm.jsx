import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Upload, ArrowLeft, User, MessageCircle, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import apiService from '../services/api'
import './ProposalForm.css'

const ProposalForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fromName: '',
    toName: '',
    email: '',
    message: '',
    image: null
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }))
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
      const response = await apiService.createProposal(formData)
      
      // Store the proposal data for payment page
      const proposalData = {
        proposal_id: response.proposal_id,
        magic_link: response.magic_link,
        ...formData
      }
      localStorage.setItem('proposalData', JSON.stringify(proposalData))
      
      // Navigate to payment page
      navigate('/payment')
    } catch (error) {
      console.error('Error creating proposal:', error)
      setError(error.message || 'Failed to create proposal. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="proposal-form-page">
      <div className="form-container">
        <motion.div 
          className="form-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={20} />
          </button>
          <h1>
            <Heart className="heart-icon" size={30} />
            Create Your Valentine's Proposal
            <Heart className="heart-icon" size={30} />
          </h1>
          <p>Fill in the details to create a magical proposal experience</p>
        </motion.div>

        <motion.form 
          className="proposal-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fromName">
                <User size={18} />
                From (Your Name)
              </label>
              <input
                type="text"
                id="fromName"
                name="fromName"
                className="form-control"
                placeholder="Enter your beautiful name"
                value={formData.fromName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="toName">
                <Heart size={18} />
                To (Their Name)
              </label>
              <input
                type="text"
                id="toName"
                name="toName"
                className="form-control"
                placeholder="Enter their lovely name"
                value={formData.toName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={18} />
              Your Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">
              <MessageCircle size={18} />
              Your Romantic Message
            </label>
            <textarea
              id="message"
              name="message"
              className="form-control"
              placeholder="Write your heartfelt message here... Tell them how much they mean to you! 💕"
              value={formData.message}
              onChange={handleInputChange}
              rows="5"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">
              <Upload size={18} />
              Upload a Special Photo
            </label>
            <div className="image-upload-container">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
              />
              <label htmlFor="image" className="image-upload-label">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <div className="image-overlay">
                      <div className="overlay-content">
                        <Upload size={32} />
                        <span>Change Photo</span>
                        <small>Click to upload a different image</small>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon-container">
                      <Upload size={48} />
                    </div>
                    <div className="upload-text">
                      <span className="upload-title">Click to upload a photo</span>
                      <small className="upload-subtitle">JPG, PNG or GIF (Max 5MB)</small>
                      <div className="upload-hint">
                        💕 Share a beautiful memory together
                      </div>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="form-footer">
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
            
            <div className="proposal-question">
              <h3>💖 Will {formData.toName || 'you'} be my Valentine? 💖</h3>
              <p>This magical question will be presented to your special someone!</p>
            </div>
            
            <motion.button
              type="submit"
              className="btn btn-primary submit-button"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Creating Proposal...
                </>
              ) : (
                <>
                  Continue to Payment (₹29)
                  <Heart size={20} />
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>

      <div className="floating-elements">
        <div className="floating-heart-1">💕</div>
        <div className="floating-heart-2">💖</div>
        <div className="floating-heart-3">💗</div>
      </div>
    </div>
  )
}

export default ProposalForm