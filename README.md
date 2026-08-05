# SOC Simulation Dashboard

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-lpmvf2bv)

A professional, real-time Security Operations Center (SOC) simulation dashboard built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Real-time security monitoring interface with live threat stream
- Live threat alerts feed for 7 attack types (Malware, Phishing, SQL Injection, Brute Force, DDoS, Firewall, Unauthorized Access)
- Auto-updating event log table with per-row resolve actions
- Security status cards (Total Alerts, Active Threats, Resolved, System Status, Risk Score)
- Animated charts (donut, bar, area/throughput)
- Threat level indicator (Low / Medium / High / Critical)
- System health indicators
- Recommended security actions for every detected threat
- Start / Pause / Reset / Generate Random Threat controls
- Cybersecurity-themed dark UI, fully responsive

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production build outputs to `dist/`.

## GitHub Pages Deployment

This project is configured for GitHub Pages. On every push to `main`/`master`, the
GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the project and deploys
the `dist/` folder to GitHub Pages.

The Vite `base` path is set to `/soc-simulation-dashboard-3/` in production so that
assets resolve correctly under the repository subpath.

### One-time setup

1. Push the repository to GitHub.
2. In the repo, go to **Settings → Pages → Build and deployment → Source** and select
   **GitHub Actions**.
3. Push to `main` (or `master`) — the workflow builds and deploys automatically.
