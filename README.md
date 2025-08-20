# Exterior Cleaning Business Landing Page

A production-ready, SEO-optimized landing page template for exterior cleaning businesses with a built-in file-based CMS admin panel.

## Features

- 🎨 **Beautiful, responsive design** optimized for exterior cleaning businesses
- 📝 **File-based CMS** - no database required
- 🔧 **Admin panel** for easy content management
- 📱 **Mobile-first responsive design**
- 🚀 **SEO optimized** with proper meta tags and static generation
- 📊 **Easy to replicate** for multiple clients
- 🎯 **Conversion optimized** with clear CTAs

## Quick Start

1. Clone this repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Access admin panel at `/admin` (passcode: `admin123`)

## Admin Panel Features

- **Site Settings**: Edit company name, tagline, contact info, service areas
- **Navigation**: Customize header/footer navigation and CTA buttons
- **Content Management**: Edit hero sections, services, testimonials, gallery
- **Design**: Customize brand colors
- **Media**: Upload and manage images

## File Structure

```
content/
├── site-config.json     # Global site settings
├── navigation.json      # Header/footer navigation
├── pages/
│   └── home.json       # Homepage content
└── blog/
    └── posts/          # Blog posts (Markdown)

public/
└── uploads/            # User-uploaded images
```

## Customization for Clients

1. Update content files in `/content/`
2. Replace images in `/public/uploads/`
3. Customize colors via admin panel
4. Deploy to Netlify

## Environment Variables

Create a `.env.local` file:

```
ADMIN_PASSCODE=your-secure-passcode
```

## Deployment

This template is optimized for Netlify deployment with static export.

1. Build: `npm run build`
2. Deploy the `out` folder to Netlify

## License

MIT License - feel free to use for client projects.