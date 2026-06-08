import 'dotenv/config';
import { createServer } from 'node:http';
import { app } from './app.js';
import { initializeSocketServer } from './services/socket.service.js';
const PORT = Number(process.env.PORT) || 3000;
const server = createServer(app);
initializeSocketServer(server);
server.listen(PORT, () => {
    console.log(`RUNNING ON ${PORT}`);
});
//# sourceMappingURL=index.js.map