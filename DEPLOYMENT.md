# Deployment Guide

## Production Build

### 1. Build the Application

```bash
npm run build
```

### 2. Test Production Build Locally

```bash
npm run preview
```

### 3. Deploy to Server

#### Option A: Static Hosting (Netlify, Vercel, GitHub Pages)

1. Upload the `dist/` folder contents to your hosting provider
2. Configure redirects for SPA routing (all routes should redirect to `index.html`)

#### Option B: Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### Option C: Apache Configuration

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/dist

    # Handle SPA routing
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]

    # Cache static assets
    <LocationMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
        Header set Cache-Control "public, immutable"
    </LocationMatch>
</VirtualHost>
```

## Environment Variables

Set these environment variables in your production environment:

```bash
VITE_API_BASE_URL=https://your-production-api.com
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
```

## Performance Optimizations

1. **CDN**: Use a CDN for static assets
2. **Compression**: Enable gzip/brotli compression
3. **Caching**: Set appropriate cache headers
4. **Service Worker**: The app includes a service worker for offline functionality

## Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CSP (Content Security Policy) implemented
- [ ] Environment variables secured
- [ ] API endpoints protected
- [ ] Rate limiting implemented

## Monitoring

- Set up error tracking (Sentry, LogRocket)
- Configure analytics (Google Analytics, Mixpanel)
- Monitor performance (Web Vitals)
- Set up uptime monitoring

## Backup Strategy

- Regular database backups
- Code repository backups
- Static asset backups
- Configuration backups
