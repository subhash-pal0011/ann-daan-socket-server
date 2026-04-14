#  Ann Daan Socket Server

This is the real-time socket server for the **Ann Daan Food Donation Platform**.

It handles live communication between users (donors & NGOs), enabling instant updates for donation status, notifications, and user activity.

---

## ⚙️ Tech Stack

- Node.js
- Socket.IO
- Express.js

---

## 🔥 Features

- 🔔 Instant notifications for donation updates
- 📦 Live status updates (Accepted → Picked → Delivered)
- 👥 User online/offline tracking
- 🔄 Event-based architecture

---

## 🧠 How it works

- Client connects via Socket.IO
- Events are emitted on actions like:
  - donation accepted
  - food picked
  - food delivered
- Server broadcasts updates to relevant users in real-time

---

##  Getting Started

### 1. Install dependencies
```bash
npm install
