const express = require('express');
const router = express.Router();
const { getRedisClient } = require('../redis');
const roomService = require('../services/roomService');

router.get('/list/:username', async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username is required'
      });
    }

    const redis = getRedisClient();

    // Clear and check key type first
    try {
      const keyType = await redis.type(`user:rooms:${username}`);
      if (keyType !== 'set' && keyType !== 'none') {
        console.log(`⚠️ Wrong key type for user:rooms:${username}: ${keyType}, clearing...`);
        await redis.del(`user:rooms:${username}`);
      }
    } catch (err) {
      console.log('Redis key type check error:', err.message);
    }

    const roomIds = await redis.sMembers(`user:rooms:${username}`);

    console.log(`📋 User ${username} rooms from Redis:`, roomIds);

    const rooms = [];
    for (const roomId of roomIds) {
      try {
        const room = await roomService.getRoomById(roomId);
        if (!room) {
          // Remove invalid room from set
          await redis.sRem(`user:rooms:${username}`, roomId);
          continue;
        }

        const lastMsgData = await redis.hGetAll(`room:lastmsg:${roomId}`);

        rooms.push({
          id: roomId,
          name: room.name,
          lastMessage: lastMsgData.message || 'No messages yet',
          lastUsername: lastMsgData.username || room.name,
          timestamp: lastMsgData.timestamp || Date.now().toString()
        });
      } catch (err) {
        console.error(`Error getting room ${roomId}:`, err.message);
      }
    }

    console.log(`✅ Returning ${rooms.length} rooms for ${username}`);

    res.json({
      success: true,
      rooms,
      dms: []
    });

  } catch (error) {
    console.error('Error getting chat list:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get chat list'
    });
  }
});

router.get('/joined/:username', async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username required'
      });
    }

    const redis = getRedisClient();
    const roomIds = await redis.sMembers(`user:rooms:${username}`);

    const roomsWithInfo = await Promise.all(
      roomIds.map(async (roomId) => {
        const roomInfo = await roomService.getRoomById(roomId);
        if (!roomInfo) return null;

        return {
          id: roomId,
          name: roomInfo.name,
          type: 'room'
        };
      })
    );

    const validRooms = roomsWithInfo.filter(r => r !== null);

    res.json({
      success: true,
      rooms: validRooms
    });

  } catch (error) {
    console.error('Get joined rooms error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get joined rooms'
    });
  }
});

module.exports = router;