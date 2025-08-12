const jwt = require("jsonwebtoken");

const authMiddleware = (role = "Admin") => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== role)
        return res.status(403).json({ message: "Access denied" });
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

// const jwt = require("jsonwebtoken");

// const authMiddleware = (role = "admin") => {
//   return (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "No token provided" });

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       if (decoded.role !== role)
//         return res.status(403).json({ message: "Access denied" });

//       req.user = decoded;
//       next();
//     } catch (err) {
//       res.status(401).json({ message: "Invalid token" });
//     }
//   };
// };

module.exports = authMiddleware;
