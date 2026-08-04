module.exports = (req, res, next) => {
  if (!['payment_reviewer', 'payment_approver', 'compliance_admin'].includes(req.user?.role)) return res.status(403).json({ error: 'Payment review role required.' });
  return next();
};
