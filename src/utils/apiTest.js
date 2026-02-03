// API Testing Utility
// Use this in browser console to test API endpoints

import apiService from '../services/api.js'

// Test API connection
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...')
    
    // Test creating a proposal
    const testProposal = {
      fromName: 'Test User',
      toName: 'Test Recipient',
      email: 'test@example.com',
      message: 'This is a test proposal message!',
      image: null
    }
    
    const result = await apiService.createProposal(testProposal)
    console.log('✅ API Connection successful:', result)
    return result
  } catch (error) {
    console.error('❌ API Connection failed:', error.message)
    return null
  }
}

// Test payment flow
export const testPaymentFlow = async (proposalId) => {
  try {
    console.log('Testing payment flow...')
    
    // Create Razorpay order using correct endpoint
    const razorpayOrder = await apiService.createRazorpayOrder(proposalId, 29.00)
    console.log('✅ Razorpay order created:', razorpayOrder)
    
    // Check payment status
    const paymentStatus = await apiService.getPaymentStatus(proposalId)
    console.log('✅ Payment status:', paymentStatus)
    
    return { razorpayOrder, paymentStatus }
  } catch (error) {
    console.error('❌ Payment flow failed:', error.message)
    return null
  }
}

// Test Razorpay payment verification
export const testRazorpayVerification = async (paymentData) => {
  try {
    console.log('Testing Razorpay verification...')
    
    // Use correct verification format
    const verificationData = {
      razorpay_order_id: paymentData.razorpay_order_id,
      razorpay_payment_id: paymentData.razorpay_payment_id,
      razorpay_signature: paymentData.razorpay_signature
    }
    
    const verificationResult = await apiService.verifyRazorpayPayment(verificationData)
    console.log('✅ Razorpay verification:', verificationResult)
    
    return verificationResult
  } catch (error) {
    console.error('❌ Razorpay verification failed:', error.message)
    return null
  }
}

// Test proposal retrieval
export const testProposalRetrieval = async (magicLink, accessToken) => {
  try {
    console.log('Testing proposal retrieval...')
    
    if (magicLink) {
      const proposalByMagic = await apiService.getProposalByMagicLink(magicLink)
      console.log('✅ Proposal by magic link:', proposalByMagic)
    }
    
    if (accessToken) {
      const proposalByToken = await apiService.viewProposal(accessToken)
      console.log('✅ Proposal by access token:', proposalByToken)
    }
    
    return true
  } catch (error) {
    console.error('❌ Proposal retrieval failed:', error.message)
    return null
  }
}

// Run all tests
export const runAllTests = async () => {
  console.log('🧪 Running API Tests...')
  
  const proposal = await testApiConnection()
  if (proposal) {
    await testPaymentFlow(proposal.proposal_id)
    if (proposal.magic_link) {
      await testProposalRetrieval(proposal.magic_link.replace('valentine-', ''), null)
    }
  }
  
  console.log('🏁 API Tests completed')
}

// Export for console usage
window.apiTest = {
  testApiConnection,
  testPaymentFlow,
  testRazorpayVerification,
  testProposalRetrieval,
  runAllTests
}

console.log('💕 API Test utilities loaded! Use window.apiTest.runAllTests() to test all endpoints')