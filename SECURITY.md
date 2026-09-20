# Security Policy

## Supported Versions

AI-PathFinder v1.0.0 is an immutable production showcase. Security vulnerabilities that affect the core codebase or packaging security are tracked and addressed.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

## Security Directives & Sovereign Runtime Guarantee

- **Local Sovereign Data**: All candidate and hiring data is strictly stored in a local SQLite database (`candidates.db`) on the user's workstation. Zero telemetry, tracking, or candidate data is transmitted to external remote servers.
- **Dynamic Path Isolation**: Runtime database and logging directories expand dynamically via `%LOCALAPPDATA%\AI-PathFinder\` without hardcoded user profile paths.
- **Input Sanitization**: Free-text resume inputs and job descriptions are parsed safely in memory without executing arbitrary commands or unsafe SQL injection.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

To report a vulnerability:
1. Use GitHub's private vulnerability reporting feature:
   `https://github.com/karansinghverma979/AI-PathFinder/security/advisories/new`
2. Maintainers will review the submission within 48 hours and coordinate a coordinated security advisory if necessary.
