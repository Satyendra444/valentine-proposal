import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, X, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './DemoProposalView.css'

const DemoProposalView = () => {
  const navigate = useNavigate()
  const [rejectAttempts, setRejectAttempts] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [rejectButtonPosition, setRejectButtonPosition] = useState({ x: 0, y: 0 })
  const rejectButtonRef = useRef(null)
  const containerRef = useRef(null)

  // Demo rejection messages
  const rejectMessages = [
    "Oops! The button jumped away! Try again! 🥺",
    "It moved again! This button has trust issues! 💕",
    "The button is playing hard to get! 😉",
    "Almost got it! One more try? 💖",
    "Aww, the button is shy! Maybe it wants you to say YES instead? 💝",
    "Whoosh! Did you see that? The button has superpowers! ✨",
    "The button is doing cardio! It's getting its steps in! 🏃‍♂️",
    "Peek-a-boo! The button is playing hide and seek! 👀",
    "The button believes in true love and won't let you say no! 💘",
    "Oopsie daisy! The button slipped away like butter! 🧈"
  ]

  const moveRejectButton = () => {
    // Generate movement but keep it reasonably close to prevent user frustration/disappearing
    const baseDistance = 50;
    const variableDistance = Math.min(rejectAttempts * 5, 100);
    const maxDistance = baseDistance + variableDistance;

    const randomAngle = Math.random() * 2 * Math.PI;
    const x = Math.cos(randomAngle) * maxDistance;
    const y = Math.sin(randomAngle) * maxDistance;

    setRejectButtonPosition({ x, y })
    setRejectAttempts(prev => prev + 1)
  }

  const handleRejectHover = () => {
    if (rejectAttempts < 10) {
      moveRejectButton()
    }
  }

  const handleRejectClick = (e) => {
    e.preventDefault()
    if (rejectAttempts < 10) {
      moveRejectButton()
    } else {
      alert("Wow! You're really determined! 💪 But this is just a demo - create your own to see the full experience! 💖")
    }
  }

  const handleAccept = () => {
    setShowCelebration(true)
    setTimeout(() => {
      setShowCelebration(false)
      setRejectAttempts(0)
      setRejectButtonPosition({ x: 0, y: 0 })
    }, 4000)
  }

  const getRejectMessage = () => {
    if (rejectAttempts === 0) return ""
    const messageIndex = (rejectAttempts - 1) % rejectMessages.length
    return rejectMessages[messageIndex]
  }

  return (
    <div className="demo-proposal-view" ref={containerRef}>
      <div className="demo-header">
        <button
          className="back-button"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={20} />
        </button>
        <h1>Live Demo - Valentine's Proposal</h1>
        <p>This is how your proposal will look to your Valentine!</p>
      </div>

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
                <p>Amazing! This is how it feels when they say YES! 💕</p>
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
          className="demo-proposal-container"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="demo-proposal-card">
            <div className="demo-proposal-header">
              <motion.div
                className="hearts-decoration"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                💕💖💗💘💝
              </motion.div>
              <h1>A Special Message for You</h1>
            </div>

            <div className="demo-proposal-content">
              <motion.div
                className="proposal-image"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=400&h=400&fit=crop&crop=face"
                  alt="Demo couple"
                />
                <div className="image-hearts">
                  <span>💖</span>
                  <span>💕</span>
                  <span>💗</span>
                </div>
              </motion.div>

              <motion.div
                className="proposal-message"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <p>From: <strong>Alex</strong></p>
                <p>To: <strong>Sarah</strong></p>
                <div className="message-text">
                  "You light up my world like nobody else! Every moment with you feels like magic, and I can't imagine my life without your beautiful smile. You make every day feel like Valentine's Day! 💕"
                </div>
              </motion.div>

              <motion.div
                className="proposal-question"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 150 }}
              >
                <h2>💖 Will Sarah, be my Valentine? 💖</h2>
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
                    x: rejectButtonPosition.x,
                    y: rejectButtonPosition.y
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 800, // Increased from 500 for even faster movement
                    damping: 15,    // Reduced from 20 for more bouncy movement
                    duration: 0.2   // Reduced from 0.3 for super fast animation
                  }}
                  style={{
                    cursor: 'pointer',
                    zIndex: 10,
                    position: 'relative' // Ensure it starts in flow
                  }}
                >
                  <X size={20} />
                  {rejectAttempts >= 10 ? 'Fine, No!' : 'No'}
                </motion.button>
              </motion.div>

              {rejectAttempts > 0 && (
                <motion.div
                  className="reject-message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p>{getRejectMessage()}</p>
                </motion.div>
              )}
            </div>
          </div>

          <div className="demo-cta-section">
            <h3>Ready to create your own magical proposal?</h3>
            <p>This is just a demo! Create your personalized version with your own photos and messages.</p>
            <motion.button
              className="btn btn-primary create-now-btn"
              onClick={() => navigate('/create')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart size={20} />
              Create Your Proposal Now (₹29)
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className="floating-hearts">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-heart"
            animate={{
              y: [-10, -80],
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
    </div>
  )
}

export default DemoProposalView