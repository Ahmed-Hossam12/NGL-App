// import mongoose from 'mongoose';
// import {env} from "../config/env.js";
// mongoose.connect(env.db.url)

import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from '../config/env.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);

mongoose.connect(env.db.url)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error);
    });





