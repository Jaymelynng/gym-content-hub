# 🏢 Gym Content Management System

A comprehensive content management platform designed specifically for gym networks to streamline content creation, submission, and review processes across multiple locations.

## 🎯 Overview

This system transforms the content creation workflow from a centralized 60+ hour/week process into a distributed, efficient model that empowers each gym location to create high-quality content while maintaining consistent standards and quality control.

## 🏗️ System Architecture

### Organizational Structure
- **10 Independent Gym Locations**: CPF, CRR, CCP, RBA, RBK, HGA, EST, OAS, SGT, TIG
- **Admin Hierarchy**: 
  - Level 1: Jayme (PIN: 1426) - Owner Admin
  - Level 2: Kim (PIN: 2222) - Secondary Admin
  - Gym Level: Ambassador users with PIN-based access

### Technical Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: TanStack Query for server state
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Real-time)
- **Authentication**: Custom PIN-based system
- **Design System**: Rose/pink palette (HSL 345° hue)

## 🎨 User Interface

### Three-Panel Layout System

#### Left Panel (20%) - Format Selection
- Content formats menu with progress indicators
- 5 format types: Static Photo, Carousel Images, Video Reel, Story, Animated Image
- Visual progress tracking and completion badges
- Format-specific requirements and dimensions

#### Center Panel (55%) - Main Workspace
- **Setup & Planning**: Step-by-step content planning with checklists
- **Production Tips**: Filming/creation guidance with do's/don'ts
- **Content Examples**: Visual inspiration and common mistakes
- **Common Mistakes**: What to avoid for each format
- **Equipment & Timeline**: Required tools and 5-day planning guide

#### Right Panel (25%) - Upload Tracker
- Smart drag-and-drop file upload zones
- Auto-detection for images, videos, text files
- Progress tracking with visual indicators
- Submission management and status tracking

## 📊 Content Formats

### 1. Static Photo (1080x1080)
- **Target**: 12 submissions per gym
- **Purpose**: Single high-quality images for social media
- **Requirements**: Minimum 1080x1080 resolution, good lighting
- **Planning**: Diverse photo types, clean backgrounds, proper permissions

### 2. Carousel Images (2-10 slides)
- **Target**: 8 submissions per gym
- **Purpose**: Multi-image storytelling
- **Requirements**: Consistent dimensions, cohesive style
- **Planning**: Story sequence, visual consistency, engaging first image

### 3. Video Reel (1080x1920, 15-60s)
- **Target**: 15 submissions per gym
- **Purpose**: Short-form vertical videos
- **Requirements**: 9:16 aspect ratio, clear audio, stable footage
- **Planning**: Hook within 3 seconds, dynamic movements, call-to-action

### 4. Story (1080x1920, 1-15s per slide)
- **Target**: 20 submissions per gym
- **Purpose**: Temporary 24-hour content
- **Requirements**: Quick engaging content, good lighting
- **Planning**: Behind-the-scenes moments, interactive elements

### 5. Animated Image (2-6s loops)
- **Target**: 6 submissions per gym
- **Purpose**: GIFs and motion graphics
- **Requirements**: Smooth looping, optimized file size
- **Planning**: Simple focused animations, seamless transitions

## 🔐 Authentication & Security

### PIN-Based Authentication
- No traditional usernames/passwords
- Gym-specific PIN codes for access
- Admin PIN codes for administrative access
- Session management via Supabase

### Row Level Security (RLS)
- Gym isolation: Gyms only see their own data
- Admin access: Admins see all gym data
- Submission privacy: Private admin notes hidden from gyms
- Format visibility: All gyms see format requirements

## 🚀 Key Features

### Smart Upload System
- Auto-detection of file types
- Drag-and-drop interface
- Preview generation with thumbnails
- Real-time upload status tracking

### Comprehensive Guidance
- Step-by-step planning checklists
- Production tips with equipment lists
- Visual examples and inspiration
- Common mistakes to avoid
- Technical specifications and requirements

### Progress Analytics
- Individual progress per gym
- Format analytics and success rates
- Submission status tracking
- Timeline management

### Quality Control
- Admin review system with approval workflow
- Detailed feedback mechanism
- Version control for resubmissions
- Consistent quality standards

## 💻 Technical Implementation

### Custom Hooks
- `useAuth()` - PIN-based authentication management
- `useContentFormats()` - Format data fetching
- `useFormatSubmissions()` - Submission tracking
- `useFormatProgress()` - Progress calculations

### Component Architecture
- `AdminPanel.tsx` - Admin dashboard and multi-gym overview
- `ContentLibraryManager.tsx` - Three-panel main interface
- `FormatSidebar.tsx` - Left panel format selection
- `ContentTabs.tsx` - Center panel tabbed content
- `UploadPanel.tsx` - Right panel upload management

### Database Schema
```sql
-- Core tables for content management
gym_profiles (id, gym_name, pin_code, location, contact_info)
content_formats (id, format_key, title, description, format_type, dimensions, duration, total_required)
format_submissions (id, format_id, gym_id, file_name, file_path, file_type, status, feedback_notes)
format_progress (id, gym_id, format_id, completed_count, pending_count, revision_count)
```

## 🎯 User Workflows

### Admin Workflow
1. Login with admin PIN (1426 or 2222)
2. Access Admin Panel with multi-gym overview
3. Review submissions across all gyms
4. Provide feedback and approval/revision requests
5. Track progress and identify struggling gyms
6. Manage content formats and requirements

### Gym Ambassador Workflow
1. Login with gym-specific PIN
2. Select content format from left panel
3. Review planning steps in center panel tabs
4. Upload content via smart upload zones
5. Track progress and review feedback
6. Iterate based on admin feedback

## 📈 Business Impact

### Problem Resolution
- **Time Savings**: Reduced from 60+ hours/week to distributed model
- **Quality Improvement**: Structured guidance improves content quality
- **Stress Reduction**: 1-2 month timelines instead of weekly deadlines
- **Scalability**: System handles 10 gyms efficiently

### Operational Benefits
- **Centralized Management**: Single admin interface for all gyms
- **Standardized Quality**: Consistent content across all locations
- **Progress Visibility**: Real-time tracking of all submissions
- **Efficient Feedback**: Streamlined revision and approval process

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd gym-content-management

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL and anon key

# Start development server
npm run dev
```

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup
1. Create a new Supabase project
2. Run the provided SQL migrations
3. Set up Row Level Security policies
4. Configure authentication settings

## 📱 Usage Instructions

### For Gym Ambassadors
1. **Login**: Enter your gym's PIN code
2. **Select Format**: Choose from the 5 content formats
3. **Follow Guidance**: Use the center panel tabs for planning and tips
4. **Upload Content**: Drag and drop files into the upload zones
5. **Track Progress**: Monitor your completion status
6. **Review Feedback**: Check for admin comments and revision requests

### For Admins
1. **Login**: Use admin PIN (1426 or 2222)
2. **Dashboard**: View overall system statistics
3. **Review Submissions**: Check pending content across all gyms
4. **Provide Feedback**: Add comments and status updates
5. **Monitor Progress**: Track completion rates and identify issues
6. **Manage Formats**: Update requirements and guidance

## 🔧 Customization

### Adding New Content Formats
1. Update `src/data/contentFormats.ts`
2. Add format-specific guidance and requirements
3. Update database schema if needed
4. Add format icons and styling

### Modifying Gym Information
1. Update gym profiles in the database
2. Modify PIN codes and contact information
3. Adjust permissions and access levels

### Customizing Guidance
1. Edit content in the format data files
2. Update planning steps and production tips
3. Add new examples and common mistakes
4. Modify equipment lists and timelines

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Vercel**: Connect GitHub repository for automatic deployments
- **Netlify**: Drag and drop build folder
- **AWS S3**: Upload static files to S3 bucket
- **Custom Server**: Serve build files from any web server

### Environment Configuration
- Set production environment variables
- Configure Supabase production project
- Set up custom domain and SSL
- Configure CDN for optimal performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Contact the development team
- Submit an issue on GitHub

---

**Built with ❤️ for gym networks everywhere**
