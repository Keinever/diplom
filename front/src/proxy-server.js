import express from 'express';
import cors from 'cors';
import net from 'net';
import { Buffer } from 'buffer';

const app = express();

const CORS_CONFIG = {
    origin: 'http://localhost:5173',
    methods: 'POST',
    allowedHeaders: ['Content-Type', 'back_url'],
    optionsSuccessStatus: 200
};

app.use(cors(CORS_CONFIG));
app.use(express.text({ type: 'text/plain' }));

app.options('/rlcp-proxy', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

const RLCP_SERVER = {
    connectTimeout: 5000,
    responseTimeout: 30000
};

app.post('/rlcp-proxy', async (req, res) => {
    const requestId = Math.random().toString(36).slice(2, 10);
    let socket = null;

    try {
        const backUrl = req.headers.back_url;
        if (!backUrl) throw new Error('Missing back_url header');

        const [host, port] = parseBackUrl(backUrl);

        res.header({
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Expose-Headers': 'Content-Length, Content-Type'
        });

        if (!req.body || typeof req.body !== 'string') {
            throw new Error('Invalid request body format');
        }

        socket = await connectToRlcp(host, port);
        await sendRlcpRequest(socket, req.body);
        const response = await readRlcpResponse(socket);

        res.type('text/plain').send(response);

    } catch (error) {
        handleError(error, res, requestId);
    } finally {
        safeSocketClose(socket, requestId);
    }
});

function parseBackUrl(backUrl) {
    const [host, port] = backUrl.split(':');
    return [host || '127.0.0.1', parseInt(port)];
}

async function connectToRlcp(host, port) {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        let timeout = false;

        const timer = setTimeout(() => {
            timeout = true;
            socket.destroy(new Error(`Connection timeout (${RLCP_SERVER.connectTimeout}ms)`));
        }, RLCP_SERVER.connectTimeout);

        socket.connect({ host, port }, () => {
            clearTimeout(timer);
            resolve(socket);
        });

        socket.on('error', err => {
            clearTimeout(timer);
            if (!timeout) {
                reject(err);
            }
        });
    });
}

async function sendRlcpRequest(socket, data) {
    return new Promise((resolve, reject) => {
        socket.write(data, 'utf8', err => {
            if (err) {
                reject(err);
                return;
            }
            socket.end(resolve);
        });
    });
}

async function readRlcpResponse(socket) {
    return new Promise((resolve, reject) => {
        let buffer = [];

        const timer = setTimeout(() => {
            socket.destroy(new Error(`Response timeout (${RLCP_SERVER.responseTimeout}ms)`));
            reject(new Error('Response timeout'));
        }, RLCP_SERVER.responseTimeout);

        const cleanup = () => {
            clearTimeout(timer);
            socket.off('data', onData);
            socket.off('end', onEnd);
            socket.off('error', onError);
        };

        const onData = chunk => buffer.push(chunk);
        const onEnd = () => {
            cleanup();
            resolve(Buffer.concat(buffer).toString('utf8'));
        };
        const onError = err => {
            cleanup();
            reject(err);
        };

        socket.on('data', onData);
        socket.on('end', onEnd);
        socket.on('error', onError);
    });
}

function handleError(error, res, requestId) {
    const status = error.message.includes('timeout') ? 504 :
        error.message.includes('ECONNREFUSED') ? 502 : 500;
    res.status(status).json({ error: 'RLCP_ERROR', message: error.message, requestId });
}

function safeSocketClose(socket) {
    try {
        if (socket && !socket.destroyed) {
            socket.destroy();
        }
    } catch (err) {
        console.error(err);
    }
}

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});