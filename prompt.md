Treassure hunt web app

Create a complete QR code-based treasure hunt web application for the UWM (University of Wisconsin-Milwaukee) campus. This is for a live demo at a data science club meeting to showcase rapid project development and deployment.

**Project Requirements:**

1. **Tech Stack:**
   - Node.js/Express backend
   - HTML/CSS/JavaScript frontend (mobile-optimized)
   - QR code generation and scanning capabilities
   - Ready for deployment on Render.com

2. **Game Flow:**
   - 10 sequential locations on UWM campus
   - Each location has a unique QR code
   - Scanning a QR code reveals the clue for the NEXT location
   - Track progress and show completion message at the end
   - Include a "Start Game" screen with instructions

3. **Locations and Clues (in order):**
   
   Location 1: **Panther Statue (Enderis Hall)**
   - Clue to find this: "Begin your quest where the bronze beast has prowled for 50 years of Panther pride"
   
   Location 2: **Golda Meir Library**
   - Clue to find this: "Seek the golden tower of wisdom where millions of stories await and late-night scholars unite"
   
   Location 3: **UWM Fountain Courtyard**
   - Clue to find this: "Find where Panthers gather to make a splash in the center of campus life"
   
   Location 4: **Mitchell Hall**
   - Clue to find this: "Journey to where films are born and dancers leap through history's halls"
   
   Location 5: **UWM Student Union**
   - Clue to find this: "Strike your way to where Panthers unite, grab a bite, and community comes alive"
   
   Location 6: **Sandburg Residence Halls**
   - Clue to find this: "Navigate to where four towers stand tall and Panthers rest their heads each night"
   
   Location 7: **Downer Woods Natural Area**
   - Clue to find this: "Venture into where ancient oaks whisper secrets and nature's path winds through time"
   
   Location 8: **Spaights Plaza**
   - Clue to find this: "Return to the heart where all paths converge and campus life pulses with energy"
   
   Location 9: **UWM Planetarium**
   - Clue to find this: "Look up to find where stars shine bright even in daylight, under cosmic domes"
   
   Location 10: **Lubar Entrepreneurship Center**
   - Clue to find this: "Complete your quest where future deals are made and innovation meets ambition"

4. **Features to Include:**
   - QR code generator that creates unique codes for each location
   - Web-based QR scanner using device camera
   - Progress tracker showing completed locations
   - Mobile-responsive design with large buttons and text
   - Session storage to maintain game state
   - "Reset Game" option
   - Victory screen with confetti animation when all locations are found
   - Admin page to display/print all QR codes for setup

5. **File Structure:**
   ```
   uwm-treasure-hunt/
   ├── package.json
   ├── server.js
   ├── public/
   │   ├── index.html
   │   ├── style.css
   │   ├── script.js
   │   └── admin.html
   └── README.md
   ```

6. **Deployment Requirements:**
   - Include proper package.json with start script
   - Use process.env.PORT || 3000 for Render deployment
   - Include instructions in README for:
     - Local development
     - Deploying to Render
     - Setting up the physical QR codes on campus

7. **UI/UX Requirements:**
   - UWM colors (Black #000000, Gold #FFB81C)
   - Large, touch-friendly buttons
   - Clear instructions for first-time users
   - Loading states while camera initializes
   - Error handling for camera permissions
   - Works on both iOS and Android browsers

8. **Special Features:**
   - Each QR code should encode a URL like: `https://[app-url]/location/[location-id]`
   - When scanned outside the app, it should redirect to the main game page with the location pre-loaded
   - Include fun facts about each location after finding it
   - Time tracking to show how long the hunt took

Please create all necessary files with complete, production-ready code. Include detailed comments explaining key functionality for educational purposes during the demo. Make sure the QR scanner works reliably on mobile devices and the entire experience is polished and professional.
