import jwt from 'jsonwebtoken';
import fs from 'fs';

// PRIVATE and PUBLIC keys
const privateKey = fs.readFileSync('./keys/private.key', 'utf8');
const publicKey = fs.readFileSync('./keys/public.key', 'utf8');

export function createJWT(algorithm, audience, issuer, subject, jwt_payload, key) {
    try {
        const token = jwt.sign(jwt_payload, key, {
            algorithm: algorithm,
            issuer: issuer,
            subject: subject,
            expiresIn: "4w",
            audience: audience
        });
        return token;
    } catch (e) {
        throw e;
    }
}

export function verifyJWT(token) {
    try {
        const decoded = jwt.verify(token, publicKey);
        return decoded;
    } catch (err) {
        return null;
    }
}

export function getPrivateKey() {
    return privateKey;
}

export function getPublicKey() {
    return publicKey;
}
