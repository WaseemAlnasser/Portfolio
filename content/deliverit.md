---
slug: deliverit
title: Deliverit — owning a production delivery platform
summary: Modernizing and operating a delivery marketplace across mobile, backend, payments, security, and infrastructure.
period: Late 2023 onward
status: Production platform case study
role: Primary engineer · Mobile, backend and infrastructure
---

# Deliverit: owning a production delivery platform

Deliverit is a delivery marketplace where customers create requests and drivers submit offers. I inherited the existing codebase in late 2023 and became the primary engineer responsible for its continued development, modernization, deployment, and operation.

The platform reached **25K+ app installs and 20K+ completed deliveries**.

## My role

My responsibility covered the Flutter application, customer and administrative backend services, web applications, databases, infrastructure, payments, authentication, notifications, integrations, monitoring, and releases.

During part of the project, another developer worked under my technical direction. I defined tasks, reviewed code, supported onboarding, and discussed implementation decisions with management.

## System overview

The mobile application supported customer and driver workflows. Two Node.js/TypeScript/Express services handled customer-facing and administrative functionality, backed by MySQL and Redis. Shared packages, versioned APIs, queues, background workers, caching, and integrations supported the wider system.

Web applications included a React customer app, Vue.js administration, a Next.js commerce storefront, and a WordPress public website. DigitalOcean and Docker supported backend deployments, with Firebase services for mobile messaging, configuration, crash reporting, and monitoring.

## Reducing location API costs by approximately 88%

Google Maps, Places, and related calls were costing about **$300 per month**. I revised how and when the application requested location data: caching reusable results, eliminating redundant requests, improving Places session-token usage, and moving selected operations behind backend services.

Costs fell to approximately **$36 per month**, an **88% reduction**. This was a targeted improvement to request patterns within an operating product.

## Aligning Stripe payments with delivery completion

Delivery requests can be cancelled before a driver completes the job. Capturing payment immediately creates avoidable refund work when those requests do not proceed.

I redesigned the flow to **authorize at checkout and capture after delivery completion**. For orders cancelled while payment remained uncaptured, the authorization could be cancelled instead of charging and refunding the customer.

The integration also handled verified Stripe webhooks, failed captures, synchronization between Stripe and internal payment state, eligible switches between cash and card, and separate test and live records. The result was a payment lifecycle that followed the delivery lifecycle more closely.

## Responding to production OTP abuse

I responded to a production SMS-abuse incident affecting OTP authentication, contained the immediate issue, and strengthened the login flow using Firebase App Check, request validation, and rate limiting.

## Releasing changes while older mobile apps remained in use

Mobile users do not all update at once. I used versioned APIs and backward-compatible backend changes to support older app versions while shipping new functionality.

Firebase Remote Config and feature flags allowed functionality to remain disabled for general users while being enabled for controlled validation. Developer-only activation and configurable forced updates supported release management where needed.

This allowed deployment and broad feature activation to happen separately, reducing the need to expose every new feature immediately.

## Expanding into multi-vendor commerce

I architected and led development of a commerce extension with seller onboarding, stores, product variants, inventory, commissions, checkout, orders, notifications, returns, disputes, queued imports, and Track-POD fulfillment workflows.

The challenge was connecting commerce to an existing delivery platform, including multi-seller pickup, rather than designing an isolated new application. The extension was implemented and later discontinued.

## Operating and modernizing the platform

I maintained staging and production environments, containerized backend deployments, and automated frontend delivery through GitHub Actions. Doppler supported secrets management; managed MySQL, Redis, Firebase Hosting, nginx, and TLS were part of the operational environment.

I introduced centralized Mezmo logging with Slack alerts, alongside Crashlytics, Firebase Performance Monitoring, request timing, queue monitoring, and App Check metrics. These tools helped connect production reports to relevant services and requests.

I also modernized the inherited Flutter interface incrementally, improving screens and user flows while maintaining the live platform and backend compatibility.
