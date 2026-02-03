import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Heart, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './ProposalView.css'

const ProposalView = () => {
  const { id } = useParams()
  const [proposalData, setProposalData] = useState(null)
  const [response, setResponse] = useState(null)
  const [rejectAttempts, setRejectAttempts] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [rejectButtonPosition, setRejectButtonPosition] = useState({ x: 0, y: 0 })
  const rejectButtonRef = useRef(null)
  const pageRef = useRef(null)

  useEffect(() => {
    // Mock loading proposal data
    const mockData = {
      fromName: "Alex Johnson",
      toName: "Sarah",
      message: "You light up my world like nobody else! Every moment with you feels like magic, and I can't imagine my life without your beautiful smile. You make every day feel like Valentine's Day! 💕",
      image: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=400&h=400&fit=crop&crop=face",
      createdAt: new Date().toISOString()
    }
    setProposalData(mockData)
  }, [id])

  const moveRejectButton = () => {
    if (!rejectButtonRef.current) return
    
    // Use viewport dimensions for movement within entire page
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const buttonWidth = 120 // approximate button width
    const buttonHeight = 50 // approximate button height
    
    // Calculate safe boundaries within viewport
    const maxX = viewportWidth - buttonWidth - 40
    const maxY = viewportHeight - buttonHeight - 40
    const minX = 20
    const minY = 20
    
    // Generate random position anywhere in the viewport
    const positions = [
      // Top area
      { x: minX + Math.random() * (maxX - minX), y: minY + Math.random() * 100 },
      // Bottom area  
      { x: minX + Math.random() * (maxX - minX), y: maxY - 100 + Math.random() * 100 },
      // Left area
      { x: minX + Math.random() * 150, y: minY + Math.random() * (maxY - minY) },
      // Right area
      { x: maxX - 150 + Math.random() * 150, y: minY + Math.random() * (maxY - minY) },
      // Center areas (but not too close to original position)
      { x: viewportWidth * 0.2 + Math.random() * (viewportWidth * 0.6), y: viewportHeight * 0.2 + Math.random() * (viewportHeight * 0.6) }
    ]
    
    const randomPosition = positions[Math.floor(Math.random() * positions.length)]
    
    // Set position for fixed positioning
    setRejectButtonPosition({
      x: randomPosition.x,
      y: randomPosition.y
    })
    
    setRejectAttempts(prev => prev + 1)
  }

  const handleRejectHover = () => {
    if (rejectAttempts < 5) {
      moveRejectButton()
    }
  }

  const handleRejectClick = (e) => {
    e.preventDefault()
    
    if (rejectAttempts < 5) {
      // Move the button instead of actually rejecting
      moveRejectButton()
    } else {
      // After 5 attempts, show a cute message and allow clicking
      alert("Okay, okay! I get the hint... but that YES button is still there waiting! 💖")
      setResponse('no')
    }
  }

  const handleAccept = () => {
    setResponse('yes')
    setShowCelebration(true)
  }

  const handleReject = () => {
    // This function is no longer used, replaced by handleRejectClick
  }

  if (!proposalData) {
    return (
      <div className="proposal-loading">
        <div className="loading-hearts">
          <Heart className="heart-1" />
          <Heart className="heart-2" />
          <Heart className="heart-3" />
        </div>
        <p>Loading your magical proposal...</p>
      </div>
    )
  }

  return (
    <div className="proposal-view">
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="celebration-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="celebration-content">
              <motion.div
                className="celebration-text"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <h1>🎉 YES! 🎉</h1>
                <p>You said YES! This is the beginning of something beautiful! 💕</p>
                <div className="celebration-gif">
                  <img 
                    src="https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif" 
                    alt="Celebration"
                  />
                </div>
              </motion.div>
            </div>
            <div className="confetti">
              {[...Array(50)].map((_, i) => (
                <div key={i} className={`confetti-piece confetti-${i % 5}`}></div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showCelebration && (
        <motion.div 
          className="proposal-container"
          ref={pageRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="proposal-card">
            <div className="proposal-header">
              <motion.div 
                className="hearts-decoration"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                💕💖💗💘💝
              </motion.div>
              <h1>A Special Message for You</h1>
            </div>

            <div className="proposal-content">
              {proposalData.image && (
                <motion.div 
                  className="proposal-image"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <img src={proposalData.image} alt="Special moment" />
                  <div className="image-hearts">
                    <span>💖</span>
                    <span>💕</span>
                    <span>💗</span>
                  </div>
                </motion.div>
              )}

              <motion.div 
                className="proposal-message"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <p>From: <strong>{proposalData.fromName}</strong></p>
                <p>To: <strong>{proposalData.toName}</strong></p>
                <div className="message-text">
                  {proposalData.message}
                </div>
              </motion.div>

              <motion.div 
                className="proposal-question"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 150 }}
              >
                <h2>💖 Will {proposalData.toName}, be my Valentine? 💖</h2>
              </motion.div>

              <motion.div 
                className="proposal-actions"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <motion.button
                  className="accept-btn"
                  onClick={handleAccept}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(255, 107, 157, 0.5)",
                      "0 0 40px rgba(255, 107, 157, 0.8)",
                      "0 0 20px rgba(255, 107, 157, 0.5)"
                    ]
                  }}
                  transition={{ 
                    boxShadow: { duration: 2, repeat: Infinity }
                  }}
                >
                  <Heart size={24} />
                  YES! 💕
                </motion.button>

                <motion.button
                  ref={rejectButtonRef}
                  className={`reject-btn ${rejectAttempts > 0 ? 'floating-reject' : ''}`}
                  onClick={handleRejectClick}
                  onMouseEnter={handleRejectHover}
                  onFocus={handleRejectHover}
                  animate={{
                    x: rejectAttempts > 0 ? 0 : 0,
                    y: rejectAttempts > 0 ? 0 : 0
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    duration: 0.3
                  }}
                  whileHover={rejectAttempts < 10000 ? {} : { scale: 1.05 }}
                  style={{
                    position: rejectAttempts > 0 ? 'fixed' : 'static',
                    left: rejectAttempts > 0 ? `${rejectButtonPosition.x}px` : 'auto',
                    top: rejectAttempts > 0 ? `${rejectButtonPosition.y}px` : 'auto',
                    zIndex: rejectAttempts > 0 ? 9999 : 'auto',
                    cursor: 'pointer'
                  }}
                >
                  <X size={20} />
                  {rejectAttempts >= 10000 ? 'Fine, No!' : 'No'}
                </motion.button>
              </motion.div>

              {rejectAttempts > 0 && (
                <motion.div 
                  className="reject-message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p>
                    {rejectAttempts === 1 && "Oops! The button jumped away! Try again! 🥺"}
                    {rejectAttempts === 2 && "It moved again! This button has trust issues! 💕"}
                    {rejectAttempts === 3 && "The button is playing hard to get! 😉"}
                    {rejectAttempts === 4 && "It's trying to escape! Maybe give love a chance? �"}
                    {rejectAttempts >= 5 && "Okay, you can click it now... but that YES button is still glowing! ✨"}
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          <div className="floating-hearts">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="floating-heart"
                animate={{
                  y: [-20, -100],
                  opacity: [1, 0],
                  rotate: [0, 180]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 20 + 15}px`
                }}
              >
                {['💕', '💖', '💗', '💘', '💝'][i % 5]}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ProposalView