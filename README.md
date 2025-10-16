# Mikee AI Websites Backup

This repository contains all the mikee.ai website files, including the main site and all subdomains.

## Sites Included

- **mikee.ai** - Main landing page
- **coaching.mikee.ai** - 1-on-1 AI Automation Coaching
- **blog.mikee.ai** - AI Automation Knowledge Base
- **sms-ai.mikee.ai** - Free Go High Level AI Workflow
- **masterclass-mikee-ai** - Free Masterclass
- **strategy-session-mikee-ai** - 30-Minute Strategy Session
- **workshop-mikee-ai** - AI Agents Income Workshop

## Shared Navigation

All sites use a shared navigation component located at:
- `mikee-ai/shared/nav.js`

This navigation includes:
- Logo and branding
- Navigation links to all mikee.ai sites
- **Phone number: +1 971 299 7981** (to get AI Help Now)
- CTA button for custom quotes

## Recent Updates

### October 15, 2025
- Added phone number **+1 971 299 7981** with "to get AI Help Now" text to navigation
- Updated shared nav.js to version 2.1
- Applied navigation updates across all mikee.ai sites
- Updated cache-busting version parameter to v=5

## Deployment Instructions

### Prerequisites
- Web server (Apache/Nginx)
- Node.js (for React-based sites)
- Access to DNS configuration

### Deploying to a New Server

1. **Clone this repository:**
   ```bash
   git clone https://github.com/mikee-ai/mikee-ai-websites.git
   cd mikee-ai-websites
   ```

2. **Copy files to web server:**
   ```bash
   sudo cp -r mikee-ai /var/www/
   sudo cp -r coaching-mikee-ai /var/www/
   sudo cp -r blog-mikee-ai /var/www/
   sudo cp -r sms-ai-mikee-ai /var/www/
   sudo cp -r masterclass-mikee-ai /var/www/
   sudo cp -r strategy-session-mikee-ai /var/www/
   sudo cp -r workshop-mikee-ai /var/www/
   ```

3. **Set proper permissions:**
   ```bash
   sudo chown -R www-data:www-data /var/www/*mikee-ai*
   sudo chmod -R 755 /var/www/*mikee-ai*
   ```

4. **Configure web server (Nginx example):**
   Create server blocks for each subdomain pointing to the respective directories.

5. **Update DNS records:**
   Point all subdomains to the new server IP address.

## File Structure

```
mikee-ai-backup/
├── mikee-ai/                    # Main site (mikee.ai)
│   ├── index.html
│   ├── assets/
│   └── shared/
│       └── nav.js              # Shared navigation component
├── coaching-mikee-ai/           # Coaching site
├── blog-mikee-ai/               # Blog site
├── sms-ai-mikee-ai/            # SMS AI workflow site
├── masterclass-mikee-ai/        # Masterclass site
├── strategy-session-mikee-ai/   # Strategy session site
└── workshop-mikee-ai/           # Workshop site
```

## Updating the Phone Number

To update the phone number across all sites:

1. Edit `mikee-ai/shared/nav.js`
2. Update the `phone` configuration object:
   ```javascript
   phone: {
     number: '+1 971 299 7981',
     text: 'to get AI Help Now',
     url: 'tel:+19712997981'
   }
   ```
3. Increment the version number in all HTML files that reference nav.js
4. Push changes to GitHub
5. Deploy to server

## Backup Schedule

This repository should be updated whenever changes are made to any mikee.ai website.

## Support

For questions or issues, visit [https://help.manus.im](https://help.manus.im)

## License

© 2025 Mikee AI. All rights reserved.

