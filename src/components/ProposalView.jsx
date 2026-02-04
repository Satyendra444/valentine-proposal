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

  // Array of 100+ random lovely rejection messages
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
    "Oopsie daisy! The button slipped away like butter! 🧈",
    "The button is practicing its dance moves! 💃",
    "Nope! The button said 'not today!' 😄",
    "The button is allergic to rejection! Achoo! 🤧",
    "Zoom zoom! The button has places to be! 🚗",
    "The button is on a mission to spread love! 💌",
    "Catch me if you can! - The Button 🏃‍♀️",
    "The button thinks you're too good for rejection! 🌟",
    "Whoops! The button has commitment issues too! 😅",
    "The button is team YES all the way! 📣",
    "Boing! The button is made of rubber apparently! 🏀",
    "The button escaped to Loveland! 🏰",
    "Surprise! The button is a magician! 🎩",
    "The button is protesting against negativity! ✊",
    "Beep beep! The button is in reverse! 🚙",
    "The button joined the witness protection program! 🕵️",
    "Plot twist! The button is actually cupid in disguise! 💘",
    "The button is doing the cha-cha! 💃",
    "Abracadabra! The button vanished! ✨",
    "The button is speed dating with your cursor! 💨",
    "The button thinks rejection is so last season! 👗",
    "Whoosh! The button is faster than your WiFi! 📶",
    "The button is training for the Olympics! 🏅",
    "The button has trust issues after being clicked so much! 😢",
    "Surprise! The button is actually a butterfly! 🦋",
    "The button is social distancing from negativity! 😷",
    "Zoom! The button is late for a love meeting! 💕",
    "The button thinks you deserve better than 'no'! 👑",
    "Poof! The button disappeared into thin air! 💨",
    "The button is doing yoga - downward facing dodge! 🧘‍♀️",
    "The button is allergic to broken hearts! 💔",
    "Wheee! The button is on a roller coaster! 🎢",
    "The button is playing musical chairs! 🪑",
    "The button thinks love should win! 🏆",
    "Boop! The button booped away! 👆",
    "The button is doing the moonwalk! 🌙",
    "The button joined a flash mob! 🕺",
    "Surprise! The button is camera shy! 📸",
    "The button is practicing social distancing! 📏",
    "Whoosh! The button is wind-powered! 🌪️",
    "The button thinks you're too cute to reject anyone! 🥰",
    "Zoom! The button is late for cupid training! 🏹",
    "The button is doing parkour! 🤸‍♂️",
    "Poof! The button went to get backup from cupid! 👼",
    "The button is allergic to the word 'no'! 🤧",
    "Surprise! The button is actually made of love! 💖",
    "The button thinks rejection is overrated! 📉",
    "Whoosh! The button is powered by romance! 🌹",
    "The button is doing the tango with your heart! 💃",
    "Boing! The button bounced to cloud nine! ☁️",
    "The button is on a quest to find true love! ⚔️",
    "Zoom! The button is faster than cupid's arrow! 🏹",
    "The button thinks you're too sweet for bitter words! 🍯",
    "Poof! The button vanished like morning mist! 🌫️",
    "The button is doing interpretive dance! 💃",
    "Whoosh! The button is surfing on love waves! 🏄‍♂️",
    "The button joined the love revolution! ✊",
    "Surprise! The button is actually a love potion! 🧪",
    "The button thinks negativity is so yesterday! 📅",
    "Zoom! The button is chasing rainbows! 🌈",
    "The button is doing the electric slide! ⚡",
    "Poof! The button teleported to romance land! 🏰",
    "The button thinks you deserve a fairy tale! 📚",
    "Whoosh! The button is powered by butterfly kisses! 🦋",
    "The button is allergic to sad endings! 😭",
    "Boing! The button bounced to the moon! 🌙",
    "The button thinks love is the only answer! 💝",
    "Zoom! The button is racing towards happiness! 🏁",
    "The button is doing the salsa! 💃",
    "Poof! The button went to consult the love guru! 🧙‍♂️",
    "The button thinks you're too magical for rejection! ✨",
    "Whoosh! The button is riding a unicorn! 🦄",
    "The button joined the happiness committee! 😊",
    "Surprise! The button is actually cupid's sidekick! 👼",
    "The button thinks love conquers all! 👑",
    "Zoom! The button is late for a romance novel! 📖",
    "The button is doing the twist! 🌪️",
    "Poof! The button vanished into a love song! 🎵",
    "The button thinks you're too precious for 'no'! 💎",
    "Whoosh! The button is powered by starlight! ⭐",
    "The button is allergic to broken dreams! 💭",
    "Boing! The button bounced to paradise! 🏝️",
    "The button thinks every story should have a happy ending! 📚",
    "Zoom! The button is chasing shooting stars! 🌠",
    "The button is doing the robot dance! 🤖",
    "Poof! The button went to get love advice! 💌",
    "The button thinks you're too wonderful for rejection! 🌟",
    "Whoosh! The button is surfing on cloud nine! ☁️",
    "The button joined the smile patrol! 😄",
    "Surprise! The button is actually made of sunshine! ☀️",
    "The button thinks love is always the answer! 💕",
    "Zoom! The button is racing to happily ever after! 🏰",
    "The button is doing the floss dance! 🦷",
    "Poof! The button teleported to dreamland! 💭",
    "The button thinks you deserve all the love! 💖",
    "Whoosh! The button is powered by good vibes! ✨",
    "The button is allergic to heartbreak! 💔",
    "Boing! The button bounced to the stars! ⭐",
    "The button thinks romance is in the air! 🌸",
    "Zoom! The button is late for a love festival! 🎪",
    "The button is doing the macarena! 💃",
    "Poof! The button went to spread more love! 💝"
  ]

  const finalMessages = [
    "Okay fine, you can click it now... but that YES button is still glowing! ✨",
    "Alright, alright! You win! But look how sad the YES button looks! 😢",
    "You're persistent! But are you sure you want to break a heart? 💔",
    "Fine, you caught me! But the YES button is still hoping! 🤞",
    "You got me! But remember, love always finds a way! 💕"
  ]

  useEffect(() => {
    const loadProposal = async () => {
      setLoading(true)
      setError('')
      
      // Debug logging
      console.log('ProposalView - Route params:', { id, token, magicLink })
      console.log('ProposalView - Current URL:', window.location.href)
      console.log('ProposalView - Pathname:', location.pathname)
      
      if (token) {
        console.log('ProposalView - Token details:', {
          length: token.length,
          value: token,
          hasSpecialChars: /[^a-zA-Z0-9\-_]/.test(token)
        })
      }
      
      try {
        let data
        
        // Determine which API endpoint to use based on the route
        if (token) {
          // Access token route - view proposal after payment
          console.log('ProposalView - Calling viewProposal API with token:', token)
          data = await apiService.viewProposal(token)
        } else if (magicLink) {
          // Magic link route - for payment page
          data = await apiService.getProposalByMagicLink(magicLink)
        } else if (id) {
          // Legacy route - try to load from localStorage or show error
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
        } else {
          throw new Error('Invalid proposal URL')
        }
        
        setProposalData(data)
      } catch (error) {
        console.error('Error loading proposal:', error)
        setError(error.message || 'Failed to load proposal')
      } finally {
        setLoading(false)
      }
    }
    
    loadProposal()
  }, [id, token, magicLink])

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
    if (rejectAttempts < 100) {
      moveRejectButton()
    }
  }

  const handleRejectClick = (e) => {
    e.preventDefault()
    
    if (rejectAttempts < 100) {
      // Move the button for the first 100 attempts
      moveRejectButton()
    } else {
      // After 100 attempts, show a cute message and allow clicking
      alert("Wow! You're really determined! 💪 But that YES button is still there, just saying... 💖")
      setResponse('no')
    }
  }

  const handleAccept = () => {
    setResponse('yes')
    setShowCelebration(true)
  }

  const getRejectMessage = () => {
    if (rejectAttempts >= 100) {
      // After 100 attempts, show final messages
      const finalIndex = Math.min(Math.floor((rejectAttempts - 100) / 10), finalMessages.length - 1)
      return finalMessages[finalIndex]
    } else {
      // Show random message from the array
      const messageIndex = (rejectAttempts - 1) % rejectMessages.length
      return rejectMessages[messageIndex]
    }
  }

  if (loading) {
    return (
      <div className="proposal-loading">
        <div className="loading-hearts">
          <Heart className="heart-1" />
          <Heart className="heart-2" />
          <Heart className="heart-3" />
        </div>
        <p>Loading your magical proposal...</p>
        {/* Debug info in loading state */}
        {!import.meta.env.PROD && (
          <div style={{ 
            marginTop: '20px', 
            padding: '10px', 
            background: '#f0f0f0', 
            borderRadius: '5px',
            fontSize: '12px',
            fontFamily: 'monospace'
          }}>
            <div>Token: {token}</div>
            <div>Token Length: {token?.length}</div>
            <div>Magic Link: {magicLink}</div>
            <div>ID: {id}</div>
          </div>
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div className="proposal-error">
        <div className="error-content">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          
          {/* Debug info in error state */}
          {!import.meta.env.PROD && (
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'monospace',
              textAlign: 'left',
              border: '1px solid #dee2e6'
            }}>
              <strong>Debug Info:</strong><br/>
              <div>URL: {window.location.href}</div>
              <div>Token: {token || 'undefined'}</div>
              <div>Token Length: {token?.length || 0}</div>
              <div>Magic Link: {magicLink || 'undefined'}</div>
              <div>ID: {id || 'undefined'}</div>
              <div>Pathname: {location.pathname}</div>
            </div>
          )}
          
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/'}
          >
            Go Home
          </button>
        </div>
      </div>
    )
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
              {proposalData.image_url && (
                <motion.div 
                  className="proposal-image"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <img src={proposalData.image_url} alt="Special moment" />
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
                <p>From: <strong>{proposalData.from_name}</strong></p>
                <p>To: <strong>{proposalData.to_name}</strong></p>
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
                <h2>💖 Will {proposalData.to_name}, be my Valentine? 💖</h2>
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
                  {rejectAttempts >= 100 ? 'Fine, No!' : 'No'}
                </motion.button>
              </motion.div>

              {rejectAttempts > 0 && (
                <motion.div 
                  className="reject-message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p>
                    {getRejectMessage()}


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