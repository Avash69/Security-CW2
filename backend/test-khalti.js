const axios = require('axios');
require('dotenv').config();

async function testKhaltiConfig() {
  console.log('🧪 Testing Khalti Configuration...');
  console.log('====================================');
  
  // Check environment variables
  console.log('🔍 Environment Variables:');
  console.log('- KHALTI_SECRET_KEY:', process.env.KHALTI_SECRET_KEY ? process.env.KHALTI_SECRET_KEY.substring(0, 8) + '...' : 'Missing ❌');
  console.log('- KHALTI_GATEWAY_URL:', process.env.KHALTI_GATEWAY_URL || 'Missing ❌');
  console.log('- Using Khalti Portal: Movie Ticketing system (aghimire781@gmail.com)');
  
  if (!process.env.KHALTI_SECRET_KEY || !process.env.KHALTI_GATEWAY_URL) {
    console.log('❌ Missing required environment variables!');
    return;
  }
  
  // Test Khalti API connection
  console.log('\n🔗 Testing Khalti API Connection...');
  
  const testPayload = {
    return_url: 'https://localhost:3000/payment/success',
    website_url: 'https://localhost:3000',
    amount: 50000, // Rs. 500 in paisa (typical movie ticket price)
    purchase_order_id: 'Movie-Mitra_TEST_' + Date.now(),
    purchase_order_name: 'Movie Ticket Purchase - Movie-Mitra',
    customer_info: {
      name: 'Test Customer',
      email: 'customer@Movie-Mitra.com',
      phone: '9800000000'
    },
    product_details: [
      {
        identity: 'movie_ticket_001',
        name: 'Movie-Mitra Movie Ticket',
        total_price: 50000,
        quantity: 1,
        unit_price: 50000
      }
    ]
  };
  
  try {
    const response = await axios.post(
      `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`,
      testPayload,
      {
        headers: {
          'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Khalti API test successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Khalti API test failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error data:', error.response.data);
      
      if (error.response.status === 401) {
        console.log('\n💡 This looks like an authentication error.');
        console.log('   - Check if your KHALTI_SECRET_KEY is correct');
        console.log('   - Make sure you\'re using the right key for test/live environment');
      } else if (error.response.status === 400) {
        console.log('\n💡 This looks like a request format error.');
        console.log('   - Check the request payload format');
        console.log('   - Verify required fields are present');
      }
    } else {
      console.log('Network error:', error.message);
      console.log('\n💡 This looks like a network connectivity issue.');
      console.log('   - Check your internet connection');
      console.log('   - Verify the Khalti gateway URL is correct');
    }
  }
  
  console.log('\n🔧 Next steps:');
  console.log('1. If authentication failed, get a valid Khalti secret key');
  console.log('2. If network failed, check internet connectivity');
  console.log('3. Start the backend server: npm start');
  console.log('4. Test payment flow in the frontend');
}

testKhaltiConfig();
