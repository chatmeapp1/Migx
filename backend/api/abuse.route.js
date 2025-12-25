const express = require('express');
const router = express.Router();
const db = require('../db/db');

// POST /api/abuse/report - Submit abuse report
router.post('/report', async (req, res) => {
  try {
    const { reporter, target, roomId, reason, messageText, timestamp } = req.body;

    // Validate required fields
    if (!target || !roomId || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Valid reasons
    const validReasons = ['spam', 'harassment', 'porn', 'scam'];
    if (!validReasons.includes(reason)) {
      return res.status(400).json({ error: 'Invalid reason' });
    }

    // Insert into abuse_reports table
    const result = await db.query(
      `INSERT INTO abuse_reports (reporter_username, target_username, room_id, message_text, reason, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING id, created_at`,
      [reporter || 'anonymous', target, roomId, messageText || null, reason]
    );

    res.status(201).json({
      success: true,
      reportId: result.rows[0].id,
      createdAt: result.rows[0].created_at,
      message: 'Report submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting abuse report:', error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

module.exports = router;
