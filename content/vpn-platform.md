---
slug: vpn-platform
title: Building a subscription-based VPN application
summary: Flutter mobile delivery, subscription access, and automated OpenVPN server provisioning.
period: 2022–2023
status: Archived project
role: Mobile application and server provisioning
---

# A subscription-based VPN application

I built the Flutter application for a commercial VPN service across Android and iOS. Backend APIs supplied account information, subscription state, server lists, and connection configuration.

My work covered mobile implementation, subscription integrations, and server provisioning.

## Mobile workflows

The application included email/password accounts, country and server selection, favorites, connection management, speed tests, a kill switch, and subscription management.

Free accounts could access a limited server, while paid subscriptions unlocked the wider server network. The app used backend data to determine available servers and account access.

## Subscriptions across mobile and web

I integrated RevenueCat for Apple App Store and Google Play subscriptions, along with Stripe subscriptions for web customers. Subscription status controlled the servers and features available to each account.

This required connecting mobile purchase flows to the service's account and access model across platforms.

## Automating server provisioning

I built scripts that turned newly acquired servers into usable OpenVPN nodes. The automation covered OpenVPN installation, certificates and configuration, user setup, firewall rules, routing/NAT, required ports, and registration with the platform.

This reduced repeated manual setup when adding servers.

## Release and outcome

The Android application was published on Google Play. The iOS application was developed but not released.
