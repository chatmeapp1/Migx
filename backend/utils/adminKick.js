const { getRedisClient } = require('../redis');

const ADMIN_KICK_COOLDOWN = 600; // 10 minutes (for kicked user)
const ADMIN_REJOIN_COOLDOWN = 180; // 3 minutes (admin cannot rejoin after kick)
const MAX_ADMIN_KICKS = 3;

async function adminKick(io, roomId, adminUsername, targetUsername, adminId) {
  const redis = getRedisClient();
  
  // Cooldown for kicked user
  const userCooldownKey = `cooldown:adminKick:${targetUsername}:${roomId}`;
  await redis.set(userCooldownKey, '1', { EX: ADMIN_KICK_COOLDOWN });

  // Track admin kick count (TOTAL across all rooms for anti-abuse)
  const adminKickCountKey = `admin:kick:count:${adminId}`;
  const adminKickCount = await redis.incr(adminKickCountKey);

  // Check if admin should be banned (exceeded max kicks)
  let adminBanned = false;
  if (adminKickCount >= MAX_ADMIN_KICKS) {
    const adminGlobalBanKey = `admin:global:banned:${adminId}`;
    await redis.set(adminGlobalBanKey, 'true');
    adminBanned = true;
  }

  // Set admin rejoin cooldown (3 minutes)
  const adminCooldownKey = `admin:rejoin:cooldown:${adminId}:${roomId}`;
  await redis.set(adminCooldownKey, '1', { EX: ADMIN_REJOIN_COOLDOWN });

  return { 
    success: true, 
    adminKickCount,
    adminBanned,
    adminUsername,
    targetUsername,
    adminCooldownSet: true
  };
}

async function isGloballyBanned(username) {
  const redis = getRedisClient();
  const globalBanKey = `ban:global:${username}`;
  const banned = await redis.get(globalBanKey);
  return banned === 'true';
}

async function isAdminGloballyBanned(adminId) {
  const redis = getRedisClient();
  const adminGlobalBanKey = `admin:global:banned:${adminId}`;
  const banned = await redis.get(adminGlobalBanKey);
  return banned === 'true';
}

async function clearGlobalBan(username) {
  const redis = getRedisClient();
  const globalBanKey = `ban:global:${username}`;
  const userKickCountKey = `user:kick:count:${username}`;
  
  await redis.del(globalBanKey);
  await redis.del(userKickCountKey);
  
  return { success: true };
}

async function clearAdminBan(adminId) {
  const redis = getRedisClient();
  const adminGlobalBanKey = `admin:global:banned:${adminId}`;
  const adminKickCountKey = `admin:kick:count:${adminId}`;
  
  await redis.del(adminGlobalBanKey);
  await redis.del(adminKickCountKey);
  
  return { success: true };
}

async function getAdminKickCount(adminId) {
  const redis = getRedisClient();
  const adminKickCountKey = `admin:kick:count:${adminId}`;
  const count = await redis.get(adminKickCountKey);
  return parseInt(count) || 0;
}

module.exports = {
  adminKick,
  isGloballyBanned,
  isAdminGloballyBanned,
  clearGlobalBan,
  clearAdminBan,
  getAdminKickCount,
  ADMIN_KICK_COOLDOWN,
  ADMIN_REJOIN_COOLDOWN,
  MAX_ADMIN_KICKS
};
