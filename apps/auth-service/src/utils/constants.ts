export const redis_keys = {
  otp: 'otp:',
  otp_lock: 'otp_lock:',
  otp_spam_lock: 'otp_spam_lock:',
  otp_cooldown: 'otp_cooldown:',
  otp_request_count: 'otp_request_count:',
  otp_attempts: 'otp_attempts:',
} as const;
