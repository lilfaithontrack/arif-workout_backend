/**
 * Check if user has required role(s)
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const hasRole = roles.some(role => req.user.roles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Check if user is admin
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!req.user.roles.includes('admin')) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }

  next();
};

/**
 * Check if user is instructor
 */
const requireInstructor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!req.user.roles.includes('instructor')) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Instructor role required.'
    });
  }

  next();
};

/**
 * Check if user is manager
 */
const requireManager = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!req.user.roles.includes('manager') && !req.user.roles.includes('admin')) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Manager or Admin role required.'
    });
  }

  next();
};

/**
 * Check if user owns the resource or is admin
 */
const requireOwnerOrAdmin = (userIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const isAdmin = req.user.roles.includes('admin');
    const isOwner = req.params.id === req.user._id.toString() || 
                    req.body[userIdField] === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
    }

    next();
  };
};

module.exports = {
  requireRole,
  requireAdmin,
  requireInstructor,
  requireManager,
  requireOwnerOrAdmin
};
