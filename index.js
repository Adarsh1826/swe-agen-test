const http = require('http');

// Use environment variables for port and hostname, with sensible defaults
const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '127.0.0.1';

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello swe-agent!\n');
});

// Handle server errors to make it more robust in production
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Error: Port ${port} is already in use.`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1); // Exit with a failure code
});

// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  console.log('To shut down, press Ctrl+C or send a SIGTERM signal.');
});

// Graceful shutdown mechanism
const shutdown = () => {
  console.log('SIGINT or SIGTERM signal received: Shutting down server...');
  server.close((err) => {
    if (err) {
      console.error('Error during server shutdown:', err);
      process.exit(1); // Exit with failure
    }
    console.log('HTTP server closed. Exiting process.');
    process.exit(0); // Exit gracefully
  });
};

process.on('SIGINT', shutdown); // Handle Ctrl+C (e.g., in development)
process.on('SIGTERM', shutdown); // Handle graceful termination from orchestrators (e.g., Docker, Kubernetes)
