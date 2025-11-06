// UWM Treasure Hunt - Server
// Educational demonstration of rapid web development and deployment

const express = require('express');
const QRCode = require('qrcode');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Get the base URL for QR code generation
// In production (Render), use the RENDER_EXTERNAL_URL, otherwise localhost
const BASE_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Location data - Each location contains the clue to find the NEXT location
const locations = [
  {
    id: 1,
    name: "Panther Statue (Enderis Hall)",
    clue: "Seek the golden tower of wisdom where millions of stories await and late-night scholars unite",
    funFact: "The iconic Panther statue has been a symbol of UWM pride since the 1960s and is a favorite photo spot for students and alumni.",
    startClue: "Begin your quest where the bronze beast has prowled for 50 years of Panther pride"
  },
  {
    id: 2,
    name: "Golda Meir Library",
    clue: "Find where Panthers gather to make a splash in the center of campus life",
    funFact: "At 14 stories tall, the Golda Meir Library is one of Milwaukee's most recognizable buildings and houses over 2 million items."
  },
  {
    id: 3,
    name: "UWM Fountain Courtyard",
    clue: "Journey to where films are born and dancers leap through history's halls",
    funFact: "The fountain courtyard is a popular gathering spot during warm weather and hosts various campus events throughout the year."
  },
  {
    id: 4,
    name: "Mitchell Hall",
    clue: "Strike your way to where Panthers unite, grab a bite, and community comes alive",
    funFact: "Mitchell Hall is home to UWM's Peck School of the Arts, including the Film, Video, Animation & New Genres department and the Dance department."
  },
  {
    id: 5,
    name: "UWM Student Union",
    clue: "Navigate to where four towers stand tall and Panthers rest their heads each night",
    funFact: "The Student Union features a bowling alley, movie theater, dining options, and is the social hub of campus life."
  },
  {
    id: 6,
    name: "Sandburg Residence Halls",
    clue: "Venture into where ancient oaks whisper secrets and nature's path winds through time",
    funFact: "The Sandburg Halls complex consists of four towers and houses over 2,000 students, making it one of Wisconsin's largest residence hall communities."
  },
  {
    id: 7,
    name: "Downer Woods Natural Area",
    clue: "Return to the heart where all paths converge and campus life pulses with energy",
    funFact: "Downer Woods is a preserved 9-acre forest in the heart of campus with oak trees over 150 years old, providing a natural escape for students."
  },
  {
    id: 8,
    name: "Spaights Plaza",
    clue: "Look up to find where stars shine bright even in daylight, under cosmic domes",
    funFact: "Spaights Plaza is the central gathering point on campus, named after UWM's first African American student who graduated in 1957."
  },
  {
    id: 9,
    name: "UWM Planetarium",
    clue: "Complete your quest where future deals are made and innovation meets ambition",
    funFact: "The Manfred Olson Planetarium, built in 1968, features one of the finest planetarium projection systems and hosts public shows throughout the year."
  },
  {
    id: 10,
    name: "Lubar Entrepreneurship Center",
    clue: "Congratulations! You've completed the UWM Treasure Hunt!",
    funFact: "The Lubar Entrepreneurship Center supports student innovation and startups, providing resources, mentorship, and funding opportunities for aspiring entrepreneurs.",
    isLast: true
  }
];

// API Endpoints

// Get all locations (for admin page)
app.get('/api/locations', (req, res) => {
  res.json(locations);
});

// Get specific location by ID
app.get('/api/location/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const location = locations.find(loc => loc.id === id);

  if (!location) {
    return res.status(404).json({ error: 'Location not found' });
  }

  res.json(location);
});

// Verify location scan (could be used for additional validation)
app.post('/api/verify/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const location = locations.find(loc => loc.id === id);

  if (!location) {
    return res.status(404).json({ error: 'Invalid location' });
  }

  res.json({
    success: true,
    location: location,
    nextLocation: id < locations.length ? locations[id].name : null
  });
});

// Generate QR code for a specific location
app.get('/api/qr/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (id < 1 || id > locations.length) {
    return res.status(404).json({ error: 'Invalid location ID' });
  }

  try {
    // Generate QR code that links to the location verification page
    const qrUrl = `${BASE_URL}/location/${id}`;
    const qrCode = await QRCode.toDataURL(qrUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',  // UWM Black
        light: '#FFFFFF'
      }
    });

    res.json({
      qrCode: qrCode,
      url: qrUrl,
      location: locations[id - 1]
    });
  } catch (error) {
    console.error('QR Code generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Generate all QR codes at once (for admin page)
app.get('/api/qr/all', async (req, res) => {
  try {
    const qrCodes = await Promise.all(
      locations.map(async (location) => {
        const qrUrl = `${BASE_URL}/location/${location.id}`;
        const qrCode = await QRCode.toDataURL(qrUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        return {
          id: location.id,
          name: location.name,
          qrCode: qrCode,
          url: qrUrl
        };
      })
    );

    res.json(qrCodes);
  } catch (error) {
    console.error('QR Code generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR codes' });
  }
});

// Route for when QR codes are scanned outside the app
// This redirects to the main page with the location ID as a parameter
app.get('/location/:id', (req, res) => {
  const id = req.params.id;
  res.redirect(`/?location=${id}`);
});

// Serve the admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Health check endpoint (useful for Render)
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎮 UWM Treasure Hunt Server running on port ${PORT}`);
  console.log(`📱 Access the game at: ${BASE_URL}`);
  console.log(`🔧 Admin panel at: ${BASE_URL}/admin`);
});
