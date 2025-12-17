const { getRedisClient } = require('../redis');
const { addCredits } = require('./creditService');
const { generateMessageId } = require('../utils/idGenerator');

const ACTIVE_VOUCHER_KEY = 'voucher:active';
const VOUCHER_COOLDOWN_KEY = (userId) => `voucher:cooldown:${userId}`;
const VOUCHER_CLAIMED_KEY = (code) => `voucher:claimed:${code}`;

const VOUCHER_CONFIG = {
  intervalMinutes: 30,
  expirySeconds: 60,
  minAmount: 500,
  maxAmount: 1000,
  userCooldownMinutes: 30
};

let voucherInterval = null;
let ioInstance = null;

const generateRandomCode = () => {
  return Math.floor(1000000 + Math.random() * 9000000).toString();
};

const generateRandomAmount = () => {
  const { minAmount, maxAmount } = VOUCHER_CONFIG;
  return Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount;
};

const createNewVoucher = async () => {
  try {
    const redis = getRedisClient();
    const code = generateRandomCode();
    const amount = generateRandomAmount();
    const expiresAt = Date.now() + (VOUCHER_CONFIG.expirySeconds * 1000);
    
    const voucherData = {
      code,
      amount: amount.toString(),
      expiresAt: expiresAt.toString(),
      createdAt: Date.now().toString()
    };
    
    await redis.hSet(ACTIVE_VOUCHER_KEY, voucherData);
    await redis.expire(ACTIVE_VOUCHER_KEY, VOUCHER_CONFIG.expirySeconds + 10);
    
    return { code, amount, expiresAt };
  } catch (error) {
    console.error('Error creating voucher:', error);
    return null;
  }
};

const getActiveVoucher = async () => {
  try {
    const redis = getRedisClient();
    const data = await redis.hGetAll(ACTIVE_VOUCHER_KEY);
    
    if (!data || !data.code) return null;
    
    const expiresAt = parseInt(data.expiresAt);
    if (Date.now() > expiresAt) {
      await redis.del(ACTIVE_VOUCHER_KEY);
      return null;
    }
    
    return {
      code: data.code,
      amount: parseInt(data.amount),
      expiresAt,
      remainingSeconds: Math.ceil((expiresAt - Date.now()) / 1000)
    };
  } catch (error) {
    console.error('Error getting active voucher:', error);
    return null;
  }
};

const checkUserCooldown = async (userId) => {
  try {
    const redis = getRedisClient();
    const cooldownKey = VOUCHER_COOLDOWN_KEY(userId);
    const ttl = await redis.ttl(cooldownKey);
    
    if (ttl > 0) {
      return {
        allowed: false,
        remainingMinutes: Math.ceil(ttl / 60),
        remainingSeconds: ttl
      };
    }
    
    return { allowed: true };
  } catch (error) {
    console.error('Error checking user cooldown:', error);
    return { allowed: true };
  }
};

const setUserCooldown = async (userId) => {
  try {
    const redis = getRedisClient();
    const cooldownKey = VOUCHER_COOLDOWN_KEY(userId);
    await redis.set(cooldownKey, Date.now().toString());
    await redis.expire(cooldownKey, VOUCHER_CONFIG.userCooldownMinutes * 60);
    return true;
  } catch (error) {
    console.error('Error setting user cooldown:', error);
    return false;
  }
};

const hasUserClaimed = async (code, userId) => {
  try {
    const redis = getRedisClient();
    const claimedKey = VOUCHER_CLAIMED_KEY(code);
    const isClaimed = await redis.sIsMember(claimedKey, userId.toString());
    return isClaimed;
  } catch (error) {
    console.error('Error checking if user claimed:', error);
    return false;
  }
};

const markUserClaimed = async (code, userId) => {
  try {
    const redis = getRedisClient();
    const claimedKey = VOUCHER_CLAIMED_KEY(code);
    await redis.sAdd(claimedKey, userId.toString());
    await redis.expire(claimedKey, VOUCHER_CONFIG.expirySeconds + 60);
    return true;
  } catch (error) {
    console.error('Error marking user claimed:', error);
    return false;
  }
};

const claimVoucher = async (userId, inputCode) => {
  const cooldownCheck = await checkUserCooldown(userId);
  if (!cooldownCheck.allowed) {
    return {
      success: false,
      type: 'cooldown',
      remainingMinutes: cooldownCheck.remainingMinutes
    };
  }
  
  const activeVoucher = await getActiveVoucher();
  if (!activeVoucher) {
    return {
      success: false,
      type: 'expired',
      error: 'No active voucher or voucher expired'
    };
  }
  
  if (activeVoucher.code !== inputCode) {
    return {
      success: false,
      type: 'invalid',
      error: 'Invalid code'
    };
  }
  
  const alreadyClaimed = await hasUserClaimed(inputCode, userId);
  if (alreadyClaimed) {
    return {
      success: false,
      type: 'already_claimed',
      error: 'You already claimed this voucher'
    };
  }
  
  const creditResult = await addCredits(userId, activeVoucher.amount, 'voucher_claim', `Claimed voucher: ${inputCode}`);
  if (!creditResult.success) {
    return {
      success: false,
      type: 'error',
      error: 'Failed to add credits'
    };
  }
  
  await markUserClaimed(inputCode, userId);
  await setUserCooldown(userId);
  
  return {
    success: true,
    amount: activeVoucher.amount,
    newBalance: creditResult.newBalance
  };
};

const broadcastVoucherAnnouncement = async (voucher) => {
  if (!ioInstance) {
    console.log('No IO instance for voucher broadcast');
    return;
  }
  
  const message = `🎁 FREE CREDIT!! Free IDR ${voucher.amount.toLocaleString()} for game, gift and many more! CMD /c ${voucher.code} to claim [${VOUCHER_CONFIG.expirySeconds}s]`;
  
  const announcement = {
    id: generateMessageId(),
    message,
    messageType: 'voucher',
    type: 'voucher',
    timestamp: new Date().toISOString(),
    voucherCode: voucher.code,
    voucherAmount: voucher.amount,
    expiresIn: VOUCHER_CONFIG.expirySeconds
  };
  
  ioInstance.emit('system:voucher', announcement);
  
  const redis = getRedisClient();
  try {
    const keys = await redis.keys('room:users:*');
    for (const key of keys) {
      const roomId = key.replace('room:users:', '');
      ioInstance.to(`room:${roomId}`).emit('chat:message', {
        id: generateMessageId(),
        roomId,
        message,
        messageType: 'voucher',
        type: 'voucher',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error broadcasting to rooms:', error);
  }
  
  console.log(`📢 Voucher broadcast: ${voucher.code} - IDR ${voucher.amount}`);
};

const startVoucherGenerator = (io) => {
  ioInstance = io;
  
  if (voucherInterval) {
    clearInterval(voucherInterval);
  }
  
  const generateAndBroadcast = async () => {
    const voucher = await createNewVoucher();
    if (voucher) {
      await broadcastVoucherAnnouncement(voucher);
    }
  };
  
  generateAndBroadcast();
  
  voucherInterval = setInterval(generateAndBroadcast, VOUCHER_CONFIG.intervalMinutes * 60 * 1000);
  
  console.log(`🎫 Voucher generator started - every ${VOUCHER_CONFIG.intervalMinutes} minutes`);
};

const stopVoucherGenerator = () => {
  if (voucherInterval) {
    clearInterval(voucherInterval);
    voucherInterval = null;
  }
  console.log('🎫 Voucher generator stopped');
};

const updateVoucherConfig = (config) => {
  Object.assign(VOUCHER_CONFIG, config);
  console.log('🎫 Voucher config updated:', VOUCHER_CONFIG);
};

module.exports = {
  createNewVoucher,
  getActiveVoucher,
  claimVoucher,
  startVoucherGenerator,
  stopVoucherGenerator,
  updateVoucherConfig,
  VOUCHER_CONFIG
};
