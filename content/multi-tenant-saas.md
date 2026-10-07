---
slug: multi-tenant-saas
title: Automating tenant onboarding, domains, and SaaS billing
summary: Laravel multi-tenancy with automated store provisioning, custom domains, and Stripe subscriptions.
period: '2023'
status: Archived project
role: Team contributor with ownership of provisioning, domains, and billing
---

# Automating the infrastructure behind a commerce SaaS

This Laravel 9 platform was designed to let businesses create and operate online stores. It used database-per-tenant isolation through `stancl/tenancy`.

I worked within a development team and contributed to implementation and product design. My main ownership areas were tenant provisioning, Stripe subscription billing, domain purchasing, custom-domain onboarding, DNS automation, and SSL provisioning.

## Turning registration into a provisioned store

Merchant onboarding needed to create a usable store without manual database and environment setup.

I implemented provisioning workflows that created the tenant and dedicated database, ran migrations, seeded initial data, created the merchant administrator, assigned themes and defaults, established a platform subdomain, and configured the store environment.

Failure handling and logging were included so onboarding problems could be identified and addressed. The result was an automated path from registration to a configured tenant store.

## Purchasing and connecting domains inside the product

Domain setup was one of my largest contributions. Merchants could purchase a domain within the platform or connect one they already owned.

For new purchases, I integrated Name.com, Stripe, and Cloudflare. The workflow covered registration, zone creation, nameserver changes, DNS records, tenant mapping, custom-hostname configuration, and SSL provisioning. It also supported annual renewals and configurable auto-renewal.

For existing domains, the platform guided the merchant through changing nameservers, checked when Cloudflare became authoritative, configured records, and moved the storefront onto the custom domain.

A DNS editor inside the merchant dashboard supported A, AAAA, CNAME, MX, and TXT records. This brought store-domain management into the product instead of requiring separate manual infrastructure work for every merchant.

## Maintaining subscriptions and entitlements

I designed and implemented the Stripe subscription system across recurring billing, tiers and feature limits, upgrades, proration, scheduled downgrades, 3-D Secure, coupons, account credit, failed payments, cancellations, and webhook synchronization.

The engineering problem differed from one-off delivery payments: billing changes also affected what a merchant could access. Subscription and entitlement state needed to stay aligned across plan changes and payment events.

## Working within the wider platform

The team developed catalogs, inventory, checkout, orders, shipping, taxes, discounts, campaigns, refunds, analytics, themes, a page builder, an app marketplace, roles, permissions, and multilingual/RTL support.

I implemented selected features and contributed to planning and design across these areas. They were shared team work; the provisioning, domain, and billing systems above were my primary areas of ownership.

## Project outcome

The platform reached an advanced development stage and was later discontinued.
