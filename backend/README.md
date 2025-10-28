# Course Management System 🚀

## 🗂️ Description

The Course Management System is a comprehensive platform designed for managing courses, users, and admins. It provides a robust backend API for course creation, user registration, and admin authentication. This project aims to streamline course management processes, making it easier for admins to create and manage courses, and for users to purchase and access courses.

The system consists of a Node.js backend, utilizing Express.js, Prisma, and MongoDB to provide a scalable and efficient data storage solution. The API handles various endpoints for user and admin authentication, course management, and user-course interactions.

## ✨ Key Features

### **Authentication and Authorization** 🔒

* User registration and login
* Admin registration and login
* Token-based authentication and authorization

### **Course Management** 📚

* Course creation, updating, and deletion (admin-only)
* Course retrieval (public and user-specific)
* User-course interactions (purchase and purchase status)

### **Data Modeling** 📊

* Prisma schema defining data models for Admin, User, Course, and UserCourse

## 🗂️ Folder Structure

```mermaid
graph TD;
src-->routes;
src-->middleware;
src-->index.js;
routes-->user.js;
routes-->admin.js;
routes-->course.js;
middleware-->auth.js;
```

## 🛠️ Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)
![Express.js](https://img.shields.io/badge/Express.js-000?logo=express&logoColor=white&style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-4ea94b?logo=prisma&logoColor=white&style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4ea94b?logo=mongodb&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white&style=for-the-badge)

## ⚙️ Setup Instructions

To run the project locally:

* Clone the repository: `git clone https://github.com/ebhay/CourseManagmentSystem.git`
* Install dependencies: `npm install`
* Create a `.env` file based on the `env.template` file
* Run the application: `npm start`

## 🚨 GitHub Actions

This repository uses GitHub Actions for automated testing and deployment. The workflow is defined in the `.github/workflows/main.yml` file.

## 📝 API Endpoints

The API provides various endpoints for user and admin authentication, course management, and user-course interactions. These endpoints are defined in the `routes` directory.

## 📊 Database Schema

The database schema is defined in the `prisma/schema.prisma` file, which uses Prisma's data modeling syntax to define the data models for Admin, User, Course, and UserCourse.



<br><br>
<div align="center">
<img src="https://avatars.githubusercontent.com/u/111756624?v=4" width="120" />
<h3>Abhay Gupta</h3>
<p>Passionate developer & lifelong learner, seeking to break boundaries through code.</p>
</div>
<br>
<p align="right">
<img src="https://gitfull.vercel.app/appLogo.png" width="20"/>  <a href="https://gitfull.vercel.app">Made by GitFull</a>
</p>
    