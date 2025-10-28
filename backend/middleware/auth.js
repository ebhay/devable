import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

// ------------------------
// Verify JWT for any user
// ------------------------
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" })
    }
    req.user = user
    next()
  })
}

// ------------------------
// Verify password hash
// ------------------------
export const verifyPassword = async (password, hashedPassword) => {
  if (!hashedPassword) return false // for Google sign-ins with no password
  return bcrypt.compare(password, hashedPassword)
}

// ------------------------
// Generate JWT
// ------------------------
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })
}

// ------------------------
// Admin-only route guard
// ------------------------
export const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" })
    }
    if (!user.adminId) {
      return res.status(403).json({ message: "Admin access required" })
    }
    req.user = user
    next()
  })
}
