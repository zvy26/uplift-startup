import http from '@/services/api';

export const authAPI = {
  // 1️⃣ Send verification code
  sendVerificationCode: async (phone: string) => {
    const response = await http.post('/auth/send-verification-code', { phone });
    return response.data; // e.g. { message: "Verification code sent successfully" }
  },

  // 2️⃣ Verify phone with code
  verifyPhone: async (phone: string, code: string) => {
    const response = await http.post('/auth/verify-phone', { phone, code });
    return response.data; // e.g. { message: "Phone verified successfully" }
  },

  // 3️⃣ Get current user profile
  me: async () => {
    const response = await http.get('/auth/me');
    return response.data;
  },

  // 4️⃣ Google login (depends on your backend implementation)
  loginWithGoogle: async (idToken: string) => {
    // Assuming backend expects an ID token from Google
    const response = await http.post('/auth/google', { token: idToken });
    return response.data;
  },
};
