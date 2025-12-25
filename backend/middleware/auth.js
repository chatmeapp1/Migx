
const jwt = require('jsonwebtoken');
const db = require('../db/db');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  console.log('🔐 Auth Middleware - Headers:', {
    authorization: authHeader ? `${authHeader.substring(0, 20)}...` : 'missing',
    contentType: req.headers['content-type']
  });
  
  if (!authHeader) {
    console.log('❌ No authorization header');
    return res.status(401).json({ 
      success: false,
      error: 'Authentication token missing. Please login again.' 
    });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    console.log('❌ Invalid token format');
    return res.status(401).json({ 
      success: false,
      error: 'Invalid token format. Please login again.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'migx-secret-key-2024');
    req.user = decoded;
    console.log('✅ Token verified for user:', decoded.id || decoded.userId);
    next();
  } catch (err) {
    console.log('❌ Token verification failed:', err.message);
    return res.status(401).json({ 
      success: false,
      error: 'Invalid or expired token. Please login again.' 
    });
  }
}

async function superAdminMiddleware(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication token missing.' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token format.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'migx-secret-key-2024');
    const userId = decoded.id || decoded.userId;

    // Check if user is super_admin
    const user = await db.query('SELECT role FROM users WHERE id = $1', [userId]);
    
    if (user.rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        error: 'User not found.' 
      });
    }

    if (user.rows[0].role !== 'super_admin') {
      console.log('❌ Access denied - user is not super_admin. Role:', user.rows[0].role);
      return res.status(403).json({ 
        success: false,
        error: 'Admin access denied. Super admin role required.' 
      });
    }

    req.user = decoded;
    console.log('✅ Super admin verified for user:', userId);
    next();
  } catch (err) {
    console.error('❌ Super admin middleware error:', err.message);
    return res.status(401).json({ 
      success: false,
      error: 'Authentication failed.' 
    });
  }
}

module.exports = authMiddleware;
module.exports.superAdminMiddleware = superAdminMiddleware;
