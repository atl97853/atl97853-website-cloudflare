---
title: How to Turn an Old Laptop into a Streaming Home Server with Debian
summary: A step-by-step guide to repurposing an old laptop into a reliable home media streaming server using Debian Linux and Jellyfin.
date: 2026-01-11
slug: debian-laptop-streaming-server
tags: [HomeLab, Debian, Jellyfin, Linux, Streaming, DIY]
---

## Introduction

As a Computer Science student (or tech enthusiast), chances are you have old hardware lying around. Instead of letting an aging laptop collect dust, you can turn it into a powerful, self-hosted alternative to Netflix for your home.

Using a laptop as a server has a surprising advantage: the built-in battery acts as a free **Uninterruptible Power Supply (UPS)**, keeping your server running during short power outages. In this guide, we’ll set up **Debian** and **Jellyfin** to stream your media to phones, TVs, and computers on your local network.

---

## Prerequisites

Before starting, make sure you have the following:

### Hardware
- An old laptop (x86_64 architecture preferred)
- Ethernet cable (Wi-Fi works, but wired connections are far more reliable for streaming)
- External storage (USB hard drive or SSD for media files)

### Software
- **Debian 12 (Bookworm)** installed  
  - A *minimal* or *netinst* installation without a heavy desktop environment (like GNOME) is recommended to save resources

### Knowledge
- Basic familiarity with the Linux command line
- Root or `sudo` access

---

## Step 1: Initial Server Setup

Log into your Debian system and update it to ensure everything is current.

```bash
sudo apt update && sudo apt upgrade -y
