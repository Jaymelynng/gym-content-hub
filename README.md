# Gym Content Management System

A comprehensive content management platform designed for a network of 10 independent gym locations, enabling centralized content creation, submission, and review workflows.

## 🏢 Organizational Structure

### Gym Network (10 Independent Locations)
- **CPF** - Central location
- **CRR** - Secondary facility  
- **CCP** - Community center partnership
- **RBA** - Regional branch A
- **RBK** - Regional branch K
- **HGA** - High-performance gym A
- **EST** - Established location
- **OAS** - Outdoor adventure sports
- **SGT** - Specialty gymnastics training
- **TIG** - Training institute for gymnastics

### Administrative Hierarchy
- **Admin Level 1**: Jayme (PIN: 1426) - Owner Admin
- **Admin Level 2**: Kim (PIN: 2222) - Secondary Admin
- **Gym Level**: Each gym has ambassador users with PIN-based access

## 💻 Technical Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Shadcn/ui component library
- **State Management**: TanStack Query for server state
- **Routing**: React Router DOM
- **Authentication**: Custom PIN-based system

### Backend Infrastructure
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage for file uploads
- **Authentication**: Supabase Auth with custom PIN logic
- **Real-time**: Supabase real-time subscriptions
- **Security**: Row Level Security (RLS) policies

### Design System
- **Color Theme**: Rose/pink palette (HSL 345° hue)
- **Layout**: Three-panel interface design
- **Typography**: Consistent font hierarchy
- **Icons**: Lucide React icon library

## 🎨 User Interface Architecture

### Three-Panel Layout System

#### Left Panel (Format Selection - 20%)
- **Content Formats Menu**: Simple sidebar navigation
- **Progress Indicators**: Completion tracking per format
- **Format Types**: Static Photo, Carousel Images, Video Reel, Story, Animated Image
- **Visual Elements**: Format icons, progress bars, completion badges

#### Center Panel (Main Workspace - 55%)
- **Three-Tab System**:
  - **Setup & Planning**: Step-by-step content planning with checklists
  - **Production Tips**: Filming/creation guidance with do's/don'ts
  - **Content Examples**: Visual inspiration and common mistakes
- **Dynamic Content**: Changes based on selected format
- **Rich Information**: Detailed planning steps, equipment lists, timelines

#### Right Panel (Upload Tracker - 25%)
- **Smart Upload Zones**: Drag-and-drop file uploads
- **Auto-Detection**: Handles images, videos, text files automatically
- **Progress Tracking**: Visual indicators for upload completion
- **Submission Management**: Review status, feedback, revision requests

## 📊 Database Schema

### Core Tables

#### `gym_profiles`
- `id` (TEXT, Primary Key)
- `gym_name` (TEXT)
- `pin_code` (TEXT, Unique) - Authentication credential
- `location` (TEXT)
- `contact_info` (JSONB)
- `created_at` (TIMESTAMP)

#### `content_formats`
- `id` (UUID, Primary Key)
- `format_key` (TEXT, Unique) - 'static-photo', 'carousel-images', etc.
- `title` (TEXT) - Display name
- `description` (TEXT)
- `format_type` (TEXT) - 'photo', 'video', 'carousel', 'story', 'animated'
- `dimensions` (TEXT) - '1080x1080', '1080x1920', etc.
- `duration` (TEXT) - Time requirements
- `total_required` (INTEGER) - Number of submissions needed
- `setup_planning` (JSONB) - Rich planning data
- `production_tips` (JSONB) - Creation guidance
- `examples` (JSONB) - Example content and mistakes

#### `format_submissions`
- `id` (UUID, Primary Key)
- `format_id` (UUID, Foreign Key)
- `gym_id` (TEXT, Foreign Key)
- `file_name` (TEXT)
- `file_path` (TEXT)
- `file_type` (TEXT) - 'photo', 'video', 'gif'
- `thumbnail_url` (TEXT)
- `status` (TEXT) - 'pending', 'approved', 'needs_revision', 'rejected'
- `feedback_notes` (TEXT)
- `admin_notes` (TEXT) - Private admin comments
- `submitted_at` (TIMESTAMP)

#### `format_progress`
- `id` (UUID, Primary Key)
- `gym_id` (TEXT, Foreign Key)
- `format_id` (UUID, Foreign Key)
- `completed_count` (INTEGER)
- `pending_count` (INTEGER)
- `revision_count` (INTEGER)
- `last_submission_date` (TIMESTAMP)

## 🔐 Authentication & Authorization

### PIN-Based Authentication System
- No traditional usernames/passwords
- Gym-specific PIN codes for access
- Admin PIN codes for administrative access
- Session management via Supabase

### Row Level Security (RLS)
- **Gym Isolation**: Gyms only see their own data
- **Admin Access**: Admins see all gym data
- **Submission Privacy**: Private admin notes hidden from gyms
- **Format Visibility**: All gyms see format requirements

## 📱 Content Format System

### Static Photo (1080x1080)
- **Purpose**: Single high-quality images
- **Requirements**: Minimum 1080x1080 resolution, good lighting
- **Target**: 12 submissions per gym
- **Planning**: Diverse photo types, clean backgrounds, proper permissions

### Carousel Images (2-10 slides)
- **Purpose**: Multi-image storytelling
- **Requirements**: Consistent dimensions, cohesive style
- **Target**: 8 submissions per gym
- **Planning**: Story sequence, visual consistency, engaging first image

### Video Reel (1080x1920, 15-60s)
- **Purpose**: Short-form vertical videos
- **Requirements**: 9:16 aspect ratio, clear audio, stable footage
- **Target**: 15 submissions per gym
- **Planning**: Hook within 3 seconds, dynamic movements, call-to-action

### Story (1080x1920, 1-15s per slide)
- **Purpose**: Temporary 24-hour content
- **Requirements**: Quick engaging content, good lighting
- **Target**: 20 submissions per gym
- **Planning**: Behind-the-scenes moments, interactive elements

### Animated Image (2-6s loops)
- **Purpose**: GIFs and motion graphics
- **Requirements**: Smooth looping, optimized file size
- **Target**: 6 submissions per gym
- **Planning**: Simple focused animations, seamless transitions

## 🎯 User Workflows

### Admin Workflow
1. Login with admin PIN (1426 or 2222)
2. Access Admin Panel with multi-gym overview
3. Review Submissions across all gyms
4. Provide Feedback and approval/revision requests
5. Track Progress and identify struggling gyms
6. Manage Content Formats and requirements

### Gym Ambassador Workflow
1. Login with gym-specific PIN
2. Select Content Format from left panel
3. Review Planning Steps in center panel tabs
4. Upload Content via smart upload zones
5. Track Progress and review feedback
6. Iterate based on admin feedback

## 🚀 Key Features & Capabilities

### Smart Upload System
- **Auto-Detection**: Recognizes file types automatically
- **Drag-and-Drop**: Intuitive file upload interface
- **Preview Generation**: Thumbnail creation for visual feedback
- **Progress Tracking**: Real-time upload status

### Comprehensive Guidance
- **Step-by-Step Planning**: Detailed checklists for each format
- **Production Tips**: Equipment lists, do's and don'ts
- **Visual Examples**: Inspiration and common mistake avoidance
- **Technical Specifications**: Exact dimensions and requirements

### Progress Analytics
- **Individual Progress**: Per-gym completion tracking
- **Format Analytics**: Success rates by content type
- **Submission Status**: Approval/revision tracking
- **Timeline Management**: Due date and deadline tracking

### Quality Control
- **Admin Review System**: Approval workflow
- **Feedback Mechanism**: Detailed revision requests
- **Version Control**: Resubmission tracking
- **Quality Standards**: Consistent output across gyms

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

## 🔧 Technical Implementation Details

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

### Data Flow
1. **Authentication** → PIN validation → Gym context setting
2. **Format Selection** → Database query → Rich content loading
3. **Content Creation** → Upload handling → Progress updating
4. **Review Process** → Admin feedback → Status updates

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd gym-content-system

# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL and anon key

# Run the development server
npm run dev
```

### Database Setup
1. Create a new Supabase project
2. Run the migration files in `supabase/migrations/`
3. Set up storage buckets for file uploads
4. Configure RLS policies

### Usage
1. **Admin Access**: Use PIN 1426 or 2222 to access admin features
2. **Gym Access**: Use gym-specific PIN codes (CPF, CRR, etc.)
3. **Content Creation**: Navigate to Content Library to start creating
4. **Upload Management**: Use the right panel for file uploads
5. **Progress Tracking**: Monitor completion across all formats

## 📝 License

This project is proprietary software developed for the gym network. All rights reserved.

## 🤝 Support

For technical support or questions about the system, please contact the development team or refer to the admin documentation.
