import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

const EnvCheck = () => {
  const [envStatus, setEnvStatus] = useState({
    apiUrl: null,
    razorpayKey: null
  })

  useEffect(() => {
    // Check environment variables
    const apiUrl = import.meta.env.VITE_API_URL
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID

    setEnvStatus({
      apiUrl: {
        value: apiUrl || 'http://localhost:8000/api (default)',
        status: apiUrl ? 'configured' : 'default'
      },
      razorpayKey: {
        value: razorpayKey ? `${razorpayKey.substring(0, 12)}...` : 'Not configured',
        status: razorpayKey ? 'configured' : 'missing'
      }
    })
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'configured':
        return <CheckCircle size={16} color="#22c55e" />
      case 'default':
        return <AlertTriangle size={16} color="#f59e0b" />
      case 'missing':
        return <XCircle size={16} color="#ef4444" />
      default:
        return <AlertTriangle size={16} color="#6b7280" />
    }
  }

  // Only show in development
  if (import.meta.env.PROD) {
    return null
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'white',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontSize: '12px',
        fontFamily: 'monospace',
        border: '1px solid #e5e7eb',
        zIndex: 1000,
        minWidth: '280px'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#374151' }}>
        Environment Variables
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {getStatusIcon(envStatus.apiUrl?.status)}
          <span style={{ color: '#6b7280' }}>API_URL:</span>
          <span style={{ color: '#374151' }}>{envStatus.apiUrl?.value}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {getStatusIcon(envStatus.razorpayKey?.status)}
          <span style={{ color: '#6b7280' }}>RAZORPAY_KEY:</span>
          <span style={{ color: '#374151' }}>{envStatus.razorpayKey?.value}</span>
        </div>
      </div>
      
      {envStatus.razorpayKey?.status === 'missing' && (
        <div style={{ 
          marginTop: '8px', 
          padding: '6px', 
          background: '#fef3c7', 
          borderRadius: '4px',
          color: '#92400e',
          fontSize: '11px'
        }}>
          ⚠️ Add VITE_RAZORPAY_KEY_ID to .env file
        </div>
      )}
    </div>
  )
}

export default EnvCheck