const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token || !process.env.JWT_SECRET) return res.status(401).json({ error: 'Authentication required.' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'nova-lift-api', audience: 'nova-lift' }); return next(); }
  catch { return res.status(401).json({ error: 'Invalid or expired token.' }); }
};
