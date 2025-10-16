# Twenty CRM Installation Guide

## Overview

**Twenty CRM** is now installed and running at **https://crm.mikee.ai**

Twenty is the #1 open-source CRM with 35.9k+ stars on GitHub, offering a modern alternative to Salesforce with features like:
- Contact and company management
- Deal pipeline tracking
- Task and calendar management
- Email integration
- Custom fields and workflows
- REST API access
- Self-hosted and privacy-focused

## Installation Details

### Server Location
- **Path:** `/var/www/twenty-crm/`
- **URL:** https://crm.mikee.ai
- **Internal Port:** 3050 (mapped to container port 3000)

### Docker Setup

Twenty CRM runs using Docker Compose with the following services:
- **twenty-server-1** - Main application server
- **twenty-worker-1** - Background job processor
- **twenty-db-1** - PostgreSQL database
- **twenty-redis-1** - Redis cache

### Configuration Files

#### Environment Variables (.env)
Located at `/var/www/twenty-crm/.env`

```env
TAG=latest
PG_DATABASE_USER=postgres
PG_DATABASE_PASSWORD=[SECURE_PASSWORD]
PG_DATABASE_HOST=db
PG_DATABASE_PORT=5432
REDIS_URL=redis://redis:6379
SERVER_URL=https://crm.mikee.ai
APP_SECRET=[SECURE_SECRET]
STORAGE_TYPE=local
```

#### Docker Compose
The `docker-compose.yml` file is configured to:
- Expose port 3050 to the host
- Connect to the `twenty_default` network
- Persist data in Docker volumes

### Reverse Proxy Configuration

Caddy reverse proxy configuration in `/root/reverse-proxy/Caddyfile`:

```caddyfile
# Twenty CRM - Open Source CRM
crm.mikee.ai {
	reverse_proxy twenty-server-1:3000
}
```

The reverse-proxy container is connected to the `twenty_default` network to communicate with the CRM.

### API Integration

The existing `api.mikee.ai` integration has been preserved:

```caddyfile
api.crm.mikee.ai {
	reverse_proxy ghl-crm-api:4000
}
```

## Management Commands

### Start/Stop Services

```bash
cd /var/www/twenty-crm
docker compose up -d      # Start all services
docker compose down       # Stop all services
docker compose restart    # Restart all services
```

### View Logs

```bash
docker logs twenty-server-1 -f    # Server logs
docker logs twenty-worker-1 -f    # Worker logs
docker logs twenty-db-1 -f        # Database logs
```

### Check Status

```bash
docker ps | grep twenty
```

### Backup Database

```bash
docker exec twenty-db-1 pg_dump -U postgres twenty > twenty-backup-$(date +%Y%m%d).sql
```

### Restore Database

```bash
cat backup.sql | docker exec -i twenty-db-1 psql -U postgres twenty
```

## Upgrading Twenty CRM

To upgrade to a newer version:

```bash
cd /var/www/twenty-crm
docker compose pull
docker compose up -d
```

## First-Time Setup

1. Navigate to https://crm.mikee.ai
2. Enter your email address
3. Create your workspace
4. Set up your first user account
5. Import contacts or start adding data

## Features Available

- **Companies** - Manage company records with custom fields
- **People** - Track contacts and relationships
- **Opportunities** - Sales pipeline management
- **Tasks** - Task tracking and assignment
- **Notes** - Collaborative note-taking
- **Calendar** - Schedule and manage meetings
- **API Access** - REST API for integrations
- **Webhooks** - Real-time event notifications

## Security Notes

- All data is stored locally on your server
- SSL/TLS encryption via Caddy
- Database and Redis are not exposed externally
- Strong passwords generated for database access
- APP_SECRET used for session encryption

## Troubleshooting

### CRM Not Loading

```bash
# Check if containers are running
docker ps | grep twenty

# Check server logs
docker logs twenty-server-1 --tail 50

# Restart services
cd /var/www/twenty-crm && docker compose restart
```

### Database Connection Issues

```bash
# Check database health
docker exec twenty-db-1 pg_isready -U postgres

# Restart database
docker restart twenty-db-1
```

### Reverse Proxy Issues

```bash
# Check Caddy logs
docker logs reverse-proxy --tail 50

# Reload Caddy config
docker exec reverse-proxy caddy reload --config /etc/caddy/Caddyfile
```

## Integration with Existing Systems

The Twenty CRM installation preserves all existing mikee.ai integrations:
- **api.mikee.ai** - Existing API endpoints remain functional
- **Phone number** - +1 971 299 7981 displayed on all mikee.ai sites
- **Navigation** - Shared nav.js across all subdomains

## Resources

- **Official Documentation:** https://twenty.com/developers
- **GitHub Repository:** https://github.com/twentyhq/twenty
- **Community:** https://twenty.com/community
- **API Docs:** https://twenty.com/developers/section/api

## Backup Location

All configuration files are backed up in the GitHub repository:
- **Repository:** https://github.com/mikee-ai/mikee-ai-websites
- **Path:** `/twenty-crm-config/`

---

**Installation Date:** October 16, 2025  
**Version:** Latest (v1.7.10)  
**Status:** ✅ Active and Running

