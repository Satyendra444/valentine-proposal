import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Sparkles, Gift, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import './LandingPage.css'

const LandingPage = () => {
  const [hearts, setHearts] = useState([])

  const createHeart = (e) => {
    const heart = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    }
    setHearts(prev => [...prev, heart])
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== heart.id))
    }, 2000)
  }

  return (
    <div className="landing-page" onClick={createHeart}>
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          className="floating-heart"
          initial={{ x: heart.x, y: heart.y, scale: 0, opacity: 1 }}
          animate={{ y: heart.y - 100, scale: 1.5, opacity: 0 }}
          transition={{ duration: 2 }}
          style={{ position: 'fixed', pointerEvents: 'none', zIndex: 1000 }}
        >
          ❤️
        </motion.div>
      ))}
      
      <div className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-icons">
            <Heart className="heart-icon floating" size={40} />
            <Sparkles className="sparkle-icon floating" size={35} />
            <Gift className="gift-icon floating" size={38} />
          </div>
          
          <h1 className="hero-title">
            💕 Create Your Perfect Valentine's Proposal 💕
          </h1>
          
          <p className="hero-subtitle">
            Send a magical, personalized Valentine's Day proposal that will make their heart skip a beat! 
            Create beautiful memories with our enchanting proposal experience.
          </p>
          
          <div className="features-grid">
            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Heart className="feature-icon" />
              <h3>Personalized Messages</h3>
              <p>Craft the perfect romantic message with your photos and heartfelt words</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="feature-icon" />
              <h3>Beautiful Animations</h3>
              <p>Stunning visual effects and animations to make your proposal unforgettable</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Gift className="feature-icon" />
              <h3>Shareable Magic Link</h3>
              <p>Get a unique link to share your proposal that creates a magical experience</p>
            </motion.div>
          </div>
          
          <motion.div 
            className="cta-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Link to="/create" className="btn btn-primary cta-button">
              Create Your Proposal <ArrowRight size={20} />
            </Link>
            <Link to="/demo-proposal" className="btn btn-secondary demo-button">
              👀 View Live Demo
            </Link>
            <p className="price-text">Only ₹29 - Make this Valentine's Day Special!</p>
          </motion.div>
        </motion.div>
      </div>
      
      <div className="decorative-hearts">
        <div className="heart-1">💖</div>
        <div className="heart-2">💕</div>
        <div className="heart-3">💗</div>
        <div className="heart-4">💝</div>
        <div className="heart-5">💘</div>
      </div>
    </div>
  )
}

export default LandingPage