const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

function base64url(str) {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function getAccessToken(keyData) {
  return new Promise((resolve, reject) => {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const claimSet = {
      iss: keyData.client_email,
      scope: 'https://www.googleapis.com/auth/devstorage.read_only',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    };

    const encodedHeader = base64url(JSON.stringify(header));
    const encodedClaimSet = base64url(JSON.stringify(claimSet));
    const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

    const signer = crypto.createSign('RSA-SHA256');
    signer.update(signatureInput);
    const signature = base64url(signer.sign(keyData.private_key));
    const jwt = `${signatureInput}.${signature}`;

    const postData = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;
    
    const req = https.request('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.access_token);
        } catch(e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function fallbackLocal(res) {
  const fallbackPath = path.join(process.cwd(), "public", "rolling_paper_2026.json");
  if (fs.existsSync(fallbackPath)) {
    const content = fs.readFileSync(fallbackPath, "utf8");
    return res.status(200).send(content);
  }
  return res.status(404).json({ error: "2026 data not found" });
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    let keyData = null;
    const keyPath = path.join(process.cwd(), "gcs-key.json");

    if (fs.existsSync(keyPath)) {
      keyData = JSON.parse(fs.readFileSync(keyPath, "utf8"));
    } else if (process.env.GCS_PRIVATE_KEY_JSON) {
      keyData = JSON.parse(process.env.GCS_PRIVATE_KEY_JSON);
    }

    if (keyData) {
      const token = await getAccessToken(keyData);
      const gcsReq = https.request('https://storage.googleapis.com/storage/v1/b/yuyeon-private-bucket/o/rolling_paper_2026.json?alt=media', {
        headers: { Authorization: `Bearer ${token}` }
      }, gcsRes => {
        let body = '';
        gcsRes.on('data', c => body += c);
        gcsRes.on('end', () => {
          if (gcsRes.statusCode === 200) {
            return res.status(200).send(body);
          } else {
            return fallbackLocal(res);
          }
        });
      });
      gcsReq.on('error', () => fallbackLocal(res));
      return gcsReq.end();
    }
  } catch (err) {
    console.error("GCS Serverless Proxy Error:", err);
  }

  return fallbackLocal(res);
};
