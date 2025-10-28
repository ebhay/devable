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
// Admin Registration
// ------------------------
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  try {
    const existingAdmin = await prisma.admin.findUnique({ where: { email } })
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profilePic: "https://github.com/shadcn.png"
      }
    })

    const token = generateToken({
      adminId: admin.id,
      email: admin.email,
      name: admin.name,
      profilePic: admin.profilePic
    })

    res.status(201).json({ message: "Admin created successfully", token, admin })
  } catch (err) {
    console.error("Admin registration error:", err)
    res.status(500).json({ message: "Internal server error" })
  }
})

// ------------------------
// Admin Login (Email/Password)
// ------------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin) return res.status(401).json({ message: "Invalid credentials" })

    const isValid = await verifyPassword(password, admin.password)
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" })

    const token = generateToken({
      adminId: admin.id,
      email: admin.email,
      name: admin.name,
      profilePic: admin.profilePic
    })

    res.status(200).json({ message: "Login successful", token, admin })
  } catch (err) {
    console.error("Admin login error:", err)
    res.status(500).json({ message: "Internal server error" })
  }
})

// ------------------------
// Admin Google Login
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

    let admin = await prisma.admin.findUnique({ where: { googleId } })

    // if not found by googleId, check by email (user might have registered manually before)
    if (!admin && email) {
      admin = await prisma.admin.findUnique({ where: { email } })
    }

    if (!admin) {
      admin = await prisma.admin.create({
        data: {
          name,
          email,
          googleId,
          profilePic: picture || "https://github.com/shadcn.png"
        }
      })
    } else if (!admin.googleId) {
      // link googleId if admin existed before
      admin = await prisma.admin.update({
        where: { id: admin.id },
        data: { googleId, profilePic: picture || admin.profilePic }
      })
    }

    const jwtToken = generateToken({
      adminId: admin.id,
      email: admin.email,
      name: admin.name,
      profilePic: admin.profilePic
    })

    res.status(200).json({ message: "Google login successful", token: jwtToken, admin })
  } catch (err) {
    console.error("Admin Google login error:", err)
    res.status(401).json({ message: "Google login failed", error: err.message })
  }
})

// ------------------------
// Delete Admin Account
// ------------------------
router.delete('/delete-account', async (req, res) => {
  console.log("DELETE /admin/delete-account route hit");
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]

    console.log("Auth header:", authHeader);
    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" })
    }

    // Verify token and get admin ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log("Decoded token:", decoded);
    
    if (!decoded.adminId) {
      return res.status(403).json({ message: "Invalid token: Admin ID not found" })
    }

    console.log("Deleting admin with ID:", decoded.adminId);

    // Delete admin and all related data
    await prisma.course.deleteMany({
      where: { adminId: decoded.adminId }
    })

    await prisma.admin.delete({
      where: { id: decoded.adminId }
    })

    console.log("Admin account deleted successfully");
    res.status(200).json({ message: "Account deleted successfully" })
  } catch (err) {
    console.error("Delete admin account error:", err)
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: "Invalid token" })
    }
    res.status(500).json({ message: "Internal server error" })
  }
})

export default router
