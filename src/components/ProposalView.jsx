import { useState, useEffect, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { Heart, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import apiService from '../services/api'
import './ProposalView.css'

const ProposalView = () => {
  const { id, token, magicLink } = useParams()
  const location = useLocation()
  const [proposalData, setProposalData] = useState(null)
  const [response, setResponse] = useState(null)
  const [rejectAttempts, setRejectAttempts] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [rejectButtonPosition, setRejectButtonPosition] = useState({ x: 0, y: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const rejectButtonRef = useRef(null)
  const pageRef = useRef(null)

  // Array of funny/lovely rejection messages
  const rejectMessages = [
    "Oops! Missed me! 😜",
    "Thinking about it? 🤔",
    "Too slow! 🏃‍♂️",
    "Are you sure? 🥺",
    "Really? 💔",
    "Give it another shot! 🎯",
    "I'm slippery! 🧈",
    "Nope, over here! 👈",
    "Nuh-uh! ☝️",
    "You can't catch me! 🏎️",
    "Try the other button! 😉",
    "I believe in us! 💑",
    "Don't break my heart! 😿",
    "Look at that YES button! ✨",
    "It's destiny! 🌟",
    "Just click YES! 💖",
    "Percentage of No: 0% 📉",
    "Error 404: No not found 🚫",
    "Access Denied: Rejection 🔒",
    "Nice try! 😎"
  ]

  const finalMessages = [
    "Okay, I'm tired... but please say Yes? 🥺",
    "You're fast! But my love is faster! ⚡",
    "Fine, you caught me. still NO? 😭",
    "I'm out of moves! Have mercy! 🙏",
    "Resetting love matrix... please convert to YES 💕"
  ]

  useEffect(() => {
    const loadProposal = async () => {
      setLoading(true)
      setError('')

      try {
        let data

        if (token) {
          data = await apiService.viewProposal(token)
        } else if (magicLink) {
          data = await apiService.getProposalByMagicLink(magicLink)
        } else if (id) {
          // Local development/preview fallback
          const storedData = localStorage.getItem('proposalData')
          if (storedData) {
            const parsed = JSON.parse(storedData)
            data = {
              from_name: parsed.fromName,
              to_name: parsed.toName,
              email: parsed.email,
              message: parsed.message,
              image_url: parsed.image ? URL.createObjectURL(parsed.image) : null,
              created_at: parsed.createdAt || new Date().toISOString()
            }
          } else {
            throw new Error('Proposal not found')
          }
        }

        // If we still don't have data and we are in a demo mode or test
        if (!data) throw new Error('Could not load proposal data')

        setProposalData(data)
      } catch (error) {
        console.error('Error loading proposal:', error)
        // For demo purposes if API fails (since I can't check backend)
        if (window.location.pathname.includes('demo') || location.search.includes('demo')) {
          setProposalData({
            from_name: "Romeo",
            to_name: "Juliet",
            message: "Every time I see you, time stands still. You make my world brighter and my heart lighter. I can't imagine a day without your smile.",
            image_url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2070&auto=format&fit=crop"
          })
        } else {
          setError(error.message || 'Failed to load proposal')
        }
      } finally {
        setLoading(false)
      }
    }

    loadProposal()
  }, [id, token, magicLink, location])

  const moveRejectButton = () => {
    // Generate movement but keep it reasonably close to prevent user frustration/disappearing
    // Reduced distance range to keep it arguably "inside" or near the container
    const baseDistance = 50;
    const variableDistance = Math.min(rejectAttempts * 5, 100); // Cap the difficulty increase
    const maxDistance = baseDistance + variableDistance;

    // Get random coordinates but clamp them slightly to avoid going too far off screen
    // Using a simpler alternating pattern can also help keep it visible
    const randomAngle = Math.random() * 2 * Math.PI;
    const x = Math.cos(randomAngle) * maxDistance;
    const y = Math.sin(randomAngle) * maxDistance;

    setRejectButtonPosition({ x, y })
    setRejectAttempts(prev => prev + 1)
  }

  const handleRejectHover = () => {
    if (rejectAttempts < 15) { // Run away for first 15 tries aggressively
      moveRejectButton()
    }
  }

  // Double protection - move on focus/click too if they are fast
  const handleRejectInteraction = (e) => {
    if (rejectAttempts < 20) {
      e.preventDefault();
      moveRejectButton();
    } else {
      // Eventually let them click it if they are really persistent, but show alert
      if (!window.confirm("Are you absolutely, 100%, positively sure? 🥺")) {
        e.preventDefault();
      } else {
        setResponse('no');
        alert("Okay... I'll keep trying! 💔");
      }
    }
  }

  const handleAccept = () => {
    setResponse('yes')
    setShowCelebration(true)
    // Trigger confetti or fireworks here if not handled by render
  }

  const getRejectMessage = () => {
    if (rejectAttempts >= 20) {
      return finalMessages[Math.floor(Math.random() * finalMessages.length)]
    }
    return rejectMessages[rejectAttempts % rejectMessages.length]
  }

  if (loading) {
    return (
      <div className="proposal-loading">
        <div className="loading-hearts">
          <Heart className="heart-1" fill="#ff4d88" />
          <Heart className="heart-2" fill="#ff4d88" />
          <Heart className="heart-3" fill="#ff4d88" />
        </div>
        <p>Loading your surprise... 🎁</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="proposal-error glass-card">
        <X size={50} color="red" />
        <h2>Ooops!</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">Try Again</button>
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
            <div className="celebration-content glass-card">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <h1>🎉 YAY! 🎉</h1>
                <p>You made me the happiest person alive! <br /> I Love You! ❤️</p>
                <div className="celebration-gif">
                  <img
                    src="https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif"
                    alt="Celebration"
                    style={{ borderRadius: '15px', maxWidth: '100%' }}
                  />
                </div>
              </motion.div>
            </div>
            {/* Simple confetti particles */}
            <div className="confetti-container">
              {[...Array(50)].map((_, i) => (
                <span key={i} className="confetti-particle" style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)]
                }}></span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showCelebration && proposalData && (
        <motion.div
          className="proposal-container"
          ref={pageRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="proposal-card glass-card">
            <div className="proposal-header">
              <div className="stamp">
                <Heart size={30} fill="white" />
              </div>
              <motion.div
                className="hearts-decoration"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                💌
              </motion.div>
              <h1>Special Delivery!</h1>
            </div>

            <div className="proposal-content">
              {proposalData.image_url && (
                <motion.div
                  className="proposal-image-container"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <img src={proposalData.image_url} alt="Us" className="proposal-image" />
                  <div className="image-frame"></div>
                </motion.div>
              )}

              <motion.div
                className="proposal-text-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="letter-body">
                  <p className="greeting">Dearest <strong>{proposalData.to_name}</strong>,</p>
                  <p className="message-text">{proposalData.message}</p>
                  <p className="signature">With love,<br /><strong>{proposalData.from_name}</strong></p>
                </div>
              </motion.div>

              <motion.div
                className="big-question"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
              >
                Will you be my Valentine? 🌹
              </motion.div>

              <div className="action-buttons">
                <motion.button
                  className="btn btn-primary accept-btn"
                  onClick={handleAccept}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    scale: [1, 1.1, 1],
                    boxShadow: ["0 0 0px var(--primary-pink)", "0 0 20px var(--primary-pink)", "0 0 0px var(--primary-pink)"]
                  }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Heart fill="white" size={24} style={{ marginRight: '8px' }} /> YES! Absolutely!
                </motion.button>

                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <motion.button
                    ref={rejectButtonRef}
                    className="btn btn-secondary reject-btn"
                    onClick={handleRejectInteraction}
                    onMouseEnter={handleRejectHover}
                    onTouchStart={handleRejectInteraction} // For mobile
                    animate={{
                      x: rejectButtonPosition.x,
                      y: rejectButtonPosition.y,
                      rotate: rejectAttempts * 10
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ position: 'relative' }} // Changed from absolute to relative initially to sit in flow, then transform moves it
                  >
                    {rejectAttempts > 10 ? <X size={20} /> : null}
                    {rejectAttempts > 10 ? "" : "No"}
                  </motion.button>
                  {rejectAttempts > 0 && (
                    <motion.div
                      className="reject-popup"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: -40 }}
                      key={rejectAttempts} // Re-render on new attempt
                    >
                      {getRejectMessage()}
                    </motion.div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ProposalView