import {createApp} from "./app.js";
import http from "http";
import mongoose from "mongoose";
import {env} from "./lib/config/env.js";
import {logger} from "./pkg/logger/logger.js";
const app = createApp()
const server = http.createServer(app)
server.listen(env.port , () => logger.info('Server running on port 3000'))
async function shutdown() {
    server.close(async () => {
        // db.close()
        await mongoose.disconnect();
        // process.exist(0)
        process.exit(0);
    })
}
process.on('SIGINT',shutdown);
process.on('SIGTERM' , shutdown);