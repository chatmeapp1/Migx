# Overview

This project is a cross-platform mobile chat application built with React Native and Expo, offering a classic chat experience reminiscent of early chat services. It features real-time messaging, chat rooms, private conversations, user profiles, and social networking functionalities like friends lists and online status. The application supports iOS, Android, and Web, incorporating room browsing, favorite management, user leveling, theme customization, and a credit transfer system. An admin panel is also included for content moderation and user/room management, aiming to create an engaging social platform that fosters community and interaction.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend utilizes Expo SDK 54, React Native 0.81.4, React 19.1.0, and Expo Router 6.x for navigation. It features a custom component library with themed components, SVG icons, and a comprehensive theming system supporting light, dark, and system-auto modes. React Native Gesture Handler and Reanimated are used for animations. Key features include a multi-tab chat system, dynamic room management, role-based user profiles with a level system, an in-app credit system with PIN authentication, and secure authentication flows. State management relies on React hooks and Context API.

A React + Vite admin panel (`/admin-panel`) provides management for users, rooms, and abuse reports, featuring real-time statistics and JWT-based authentication. The admin panel has a dark green theme and is responsive across desktop, tablet, and mobile, supporting features like gift management, daily login streak configuration, and room creation.

## Backend Architecture

The backend is built with Node.js and Express.js for RESTful APIs and Socket.IO for real-time communication. PostgreSQL (Neon DB) stores persistent data, while Redis Cloud manages presence, rate limiting, and caching. The backend is structured into services for users, rooms, messages, bans, credits, merchants, and games.

### Database Schema

The PostgreSQL database includes tables for `users`, `rooms`, `messages`, `private_messages`, `credit_logs`, `merchants`, `merchant_spend_logs`, `user_levels`, `room_bans`, `game_history`, `user_blocks`, `room_moderators`, and `gifts`.

### Redis Usage & Presence Management

Redis manages online user presence, banned user lists, flood control, global rate limiting, and caching. It's the source of truth for online/offline status, dynamically updating contact lists.

### Real-time Communication (Socket.IO)

The `/chat` namespace handles real-time events for room interactions, chat and private messages, credit transfers, and game interactions. Private messages are exclusively handled via Socket.IO without database persistence.

### REST API Endpoints

Key REST API endpoints cover authentication, user data, room management (including official, game, and favorite rooms), chatroom lifecycle, messages, credit transfers, merchant creation, profile management (follow/block), and admin functionalities for stats, reports, user, room, and gift management.

### Chat Commands

Users can use commands like `/f` (follow), `/uf` (unfollow), `/kick`, `/me`, `/roll`, `/goal`, `/go`, `/gift`, `/whois`, `/c` (claim credits), `/block`, `/unblock`. Admin-specific commands include `/unban`, `/suspend`, `/unsuspend`, and `/mod` and `/unmod` for room owners.

### Game and Economy Systems

The application includes an XP & Level System, a Merchant Commission System for mentors, and an Auto Voucher system for free credit codes. It also features a Daily Login Streak System with credit rewards.

# External Dependencies

## Core Expo Modules

`expo-router`, `expo-font`, `expo-splash-screen`, `expo-status-bar`, `expo-constants`, `expo-system-ui`, `expo-linking`, `expo-web-browser`, `expo-image`, `expo-blur`, `expo-haptics`, `expo-linear-gradient`.

## UI & Animation Libraries

`react-native-reanimated`, `react-native-gesture-handler`, `react-native-pager-view`, `react-native-svg`, `react-native-safe-area-context`, `react-native-screens`.

## Storage

`@react-native-async-storage/async-storage`.

## Backend Specific Dependencies

`Node.js`, `Express.js`, `Socket.IO`, `PostgreSQL (Neon DB)`, `Redis Cloud`.

## Image Upload

`Cloudinary` for gift image storage.

## API Configuration

**API Base URL**: `https://c1a0709e-b20d-4687-ab11-e0584b9914f2-00-pfaqheie55z6.pike.replit.dev` (also used for Socket.IO).