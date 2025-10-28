import express from 'express'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import { verifyPassword, generateToken } from '../middleware/auth.js'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'

const router = express.Router()
const prisma = new PrismaClient()
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// ------------------------
// User Registration
// ------------------------
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profilePic: "https://github.com/evilrabbit.png"
      }
    })

    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      profilePic: user.profilePic
    })

    res.status(201).json({ message: "User created successfully", token, user })
  } catch (err) {
    console.error("User registration error:", err)
    res.status(500).json({ message: "Internal server error" })
  }
})

// ------------------------
// User Login (Email/Password)
// ------------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ message: "Invalid credentials" })

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" })

    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      profilePic: user.profilePic
    })

    res.status(200).json({ message: "Login successful", token, user })
  } catch (err) {
    console.error("User login error:", err)
    res.status(500).json({ message: "Internal server error" })
  }
})

// ------------------------
// User Google Login
// ------------------------
router.post('/google-login', async (req, res) => {
  const { token } = req.body
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    const { sub: googleId, email, name, picture } = payload

    let user = await prisma.user.findUnique({ where: { googleId } })

    // Check by email if user registered manually before
    if (!user && email) {
      user = await prisma.user.findUnique({ where: { email } })
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          profilePic: picture || "https://github.com/evilrabbit.png"
        }
      })
    } else if (!user.googleId) {
      // Link existing user to Google account if needed
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId, profilePic: picture || user.profilePic }
      })
    }

    const jwtToken = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      profilePic: user.profilePic
    })

    res.status(200).json({ message: "Google login successful", token: jwtToken, user })
  } catch (err) {
    console.error("User Google login error:", err)
    res.status(401).json({ message: "Google login failed", error: err.message })
  }
})

// ------------------------
// Delete User Account
// ------------------------
router.delete('/delete-account', async (req, res) => {
  console.log("DELETE /user/delete-account route hit");
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]

    console.log("Auth header:", authHeader);
    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" })
    }

    // Verify token and get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log("Decoded token:", decoded);
    
    if (!decoded.userId) {
      return res.status(403).json({ message: "Invalid token: User ID not found" })
    }

    console.log("Deleting user with ID:", decoded.userId);

    // Delete user and all related data
    await prisma.userCourse.deleteMany({
      where: { userId: decoded.userId }
    })

    await prisma.user.delete({
      where: { id: decoded.userId }
    })

    console.log("User account deleted successfully");
    res.status(200).json({ message: "Account deleted successfully" })
  } catch (err) {
    console.error("Delete user account error:", err)
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: "Invalid token" })
    }
    res.status(500).json({ message: "Internal server error" })
  }
})

export default router
