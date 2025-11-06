# 🐾 UWM Treasure Hunt

A QR code-based treasure hunt web application designed for the University of Wisconsin-Milwaukee campus. This project showcases rapid web development and deployment for live demonstrations at the UWM Data Science Club.

## 🎯 Overview

Players navigate through 10 iconic UWM campus locations by scanning QR codes. Each code reveals interesting facts about the location and provides a clue to find the next spot. The game tracks progress and completion time, creating an engaging campus exploration experience.

## ✨ Features

- 📱 **Mobile-Optimized**: Responsive design that works on all devices
- 📷 **QR Code Scanner**: Built-in camera-based scanning (no app required)
- 🎨 **UWM Branding**: Official colors (Black #000000, Gold #FFB81C)
- ⏱️ **Time Tracking**: See how fast you can complete the hunt
- 💾 **Progress Saving**: Game state persists across page reloads
- 🏆 **Victory Celebration**: Confetti animation upon completion
- 🔧 **Admin Panel**: Easy QR code generation and printing
- 🌐 **Ready for Deployment**: Configured for Render.com

## 🏛️ Campus Locations

1. **Panther Statue (Enderis Hall)** - The iconic bronze panther
2. **Golda Meir Library** - The golden tower of knowledge
3. **UWM Fountain Courtyard** - Central gathering spot
4. **Mitchell Hall** - Home of arts and performance
5. **UWM Student Union** - Hub of campus life
6. **Sandburg Residence Halls** - Four towers of student housing
7. **Downer Woods Natural Area** - Nature in the heart of campus
8. **Spaights Plaza** - Where all paths converge
9. **UWM Planetarium** - Journey to the stars
10. **Lubar Entrepreneurship Center** - Innovation and ambition

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- A smartphone with camera for testing

### Local Development

1. **Clone or download this project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`
   - Admin panel: `http://localhost:3000/admin`

5. **Test the game**
   - Open the admin panel to see QR codes
   - Use your phone's camera to scan codes for testing
   - Or use the dev tools to test the scanner functionality

## 📦 Project Structure

```
uwm-treasure-hunt/
├── package.json          # Dependencies and scripts
├── server.js            # Express server and API endpoints
├── README.md            # This file
└── public/              # Frontend files
    ├── index.html       # Main game interface
    ├── admin.html       # QR code admin panel
    ├── style.css        # UWM-themed styles
    └── script.js        # Game logic and QR scanner
```

## 🌐 Deploying to Render.com

### Step 1: Prepare Your Repository

1. Initialize git repository (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - UWM Treasure Hunt"
   ```

2. Push to GitHub/GitLab:
   ```bash
   # Create a new repository on GitHub
   git remote add origin YOUR_REPOSITORY_URL
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub/GitLab

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your repository
   - Configure settings:
     - **Name**: `uwm-treasure-hunt` (or your choice)
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Your app will be live at `https://uwm-treasure-hunt.onrender.com`

### Step 3: Test Deployment

1. Visit your deployed URL
2. Go to `/admin` to generate QR codes
3. Test scanning with your phone

## 🖨️ Setting Up Physical QR Codes

### 1. Generate QR Codes

1. Visit your deployed app's admin panel: `https://your-app.onrender.com/admin`
2. Wait for all 10 QR codes to load
3. Click "Print All QR Codes" or "Download All as Images"

### 2. Prepare Physical Signs

**Option A: Print and Laminate**
- Print each QR code on standard paper (8.5" x 11")
- Laminate for weather protection
- Mount on foam board or cardstock

**Option B: Professional Printing**
- Download QR codes as images
- Upload to a printing service (Staples, FedEx, etc.)
- Order weather-resistant signs

### 3. Installation Tips

- **Location**: Place at eye level (4-5 feet high)
- **Visibility**: Ensure QR code is clearly visible
- **Protection**: Use weatherproof materials for outdoor locations
- **Mounting**: Use removable adhesive or stands (check campus policies)
- **Testing**: Scan each code after installation to verify

### 4. Recommended Sign Format

```
┌─────────────────────────┐
│   UWM TREASURE HUNT     │
│                         │
│     [QR CODE HERE]      │
│                         │
│   Location X of 10      │
│   Scan to Continue!     │
└─────────────────────────┘
```

## 🎮 How to Play

### For Players:

1. **Start**: Visit the app URL and click "Start Hunt"
2. **Read Clue**: Get your first clue pointing to a campus location
3. **Navigate**: Walk to the location described
4. **Scan**: Use the app to scan the QR code at that location
5. **Learn**: Read fun facts about the location
6. **Continue**: Get the next clue and repeat
7. **Complete**: Find all 10 locations to win!

### For Organizers:

1. Deploy the app to Render.com
2. Print and place QR codes at all 10 locations
3. Test the complete path yourself
4. Share the app URL with participants
5. Monitor completion times on the victory screen

## 🛠️ Technical Details

### Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **QR Generation**: qrcode library
- **QR Scanning**: html5-qrcode library
- **Animations**: canvas-confetti

### Browser Support

- ✅ Chrome/Edge (Android & Desktop)
- ✅ Safari (iOS & macOS)
- ✅ Firefox (Android & Desktop)
- ⚠️ Requires camera access for QR scanning

### API Endpoints

- `GET /api/locations` - Get all locations
- `GET /api/location/:id` - Get specific location
- `GET /api/qr/:id` - Generate QR code for location
- `GET /api/qr/all` - Generate all QR codes
- `POST /api/verify/:id` - Verify location scan
- `GET /location/:id` - QR code redirect endpoint
- `GET /health` - Health check

## 🎓 Educational Use

This project demonstrates:

- **Rapid Prototyping**: From concept to deployment in hours
- **RESTful API Design**: Clean endpoint structure
- **Mobile-First Development**: Touch-friendly, responsive UI
- **State Management**: SessionStorage and LocalStorage usage
- **Camera API**: Real-world use of device hardware
- **Deployment**: Production-ready configuration
- **User Experience**: Engaging, intuitive interface

## 🔧 Customization

### Change Locations

Edit the `locations` array in [server.js:17](server.js#L17):

```javascript
const locations = [
  {
    id: 1,
    name: "Your Location Name",
    clue: "Clue to find the NEXT location",
    funFact: "Interesting fact about this location",
    startClue: "Clue to find THIS location (for first location only)"
  },
  // ... more locations
];
```

### Modify Colors

Edit UWM colors in [style.css:1](style.css#L1):

```css
/* Change from UWM colors to your school's colors */
--primary-color: #FFB81C;  /* Gold */
--secondary-color: #000000; /* Black */
```

### Add More Features

Ideas for enhancement:
- Leaderboard with database integration
- Hints system for stuck players
- Photo challenges at each location
- Multi-language support
- Team competition mode

## 🐛 Troubleshooting

### Camera Not Working

- **Check permissions**: Allow camera access when prompted
- **HTTPS required**: Camera API needs secure connection (Render provides this)
- **Try different browser**: Some browsers handle camera better than others

### QR Codes Not Scanning

- **Lighting**: Ensure adequate lighting on the QR code
- **Distance**: Hold phone 6-12 inches from code
- **Focus**: Wait for camera to focus
- **Clean lens**: Check for smudges on camera

### App Not Loading

- **Check URL**: Ensure you're using the correct deployed URL
- **Server status**: Check Render dashboard for deployment status
- **Clear cache**: Try clearing browser cache or incognito mode

### Game State Issues

- **Reset game**: Use "Reset Game" button in footer
- **Clear storage**: Clear browser's session/local storage
- **Fresh start**: Use incognito/private browsing mode

## 📱 Demo Day Tips

### Before the Demo:

- [ ] Test complete game path yourself
- [ ] Verify all QR codes are in place and working
- [ ] Check app works on different phones
- [ ] Prepare backup phones in case of issues
- [ ] Have the admin panel open on a laptop
- [ ] Take screenshots of key moments

### During the Demo:

1. **Introduction** (2 min)
   - Show the welcome screen
   - Explain the game concept
   - Highlight UWM locations

2. **Live Demo** (3 min)
   - Scan a pre-printed QR code
   - Show the clue reveal
   - Demonstrate progress tracking
   - Show admin panel

3. **Technical Walkthrough** (3 min)
   - Show code structure
   - Explain key features
   - Discuss deployment process

4. **Q&A** (2 min)
   - Answer questions
   - Share GitHub repository
   - Discuss customization options

## 📄 License

MIT License - Feel free to use this project for educational purposes!

## 🙏 Credits

Created for the UWM Data Science Club to demonstrate rapid web application development and deployment.

**Technologies Used:**
- [Express](https://expressjs.com/) - Web framework
- [qrcode](https://www.npmjs.com/package/qrcode) - QR code generation
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) - QR code scanning
- [canvas-confetti](https://www.kirilv.com/canvas-confetti/) - Victory animation
- [Render](https://render.com) - Hosting platform

---

**Made with ❤️ for UWM Data Science Club**

*Go Panthers! 🐾*
