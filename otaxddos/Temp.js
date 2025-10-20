const { parsePhoneNumberFromString, isValidNumber, format } = require('libphonenumber-js');
const fs = require('fs');
const path = require('path');
const { default: makeWaSocket, useMultiFileAuthState } = require("@whiskeysockets/baileys"); // Import useMultiFileAuthState
const pino = require('pino');

const phoneNumberInput = process.argv[2];
const duration = parseInt(process.argv[3]);

console.log(`Menerima argumen: Nomor = ${phoneNumberInput}, Durasi = ${duration}`); // Logging

// Fungsi untuk menuliskan ke berkas log jika ada masalah.
function logToFile(message, filename = 'error.log') {
    const logFilePath = path.join(__dirname, filename);
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;

    fs.appendFileSync(logFilePath, logEntry, (err) => {
        if (err) {
            console.error("Gagal menulis ke berkas log:", err);
        }
    });
}

async function processPhoneNumber(phoneNumberInput, duration) {
    try {
        console.log("Memproses nomor telepon:", phoneNumberInput); // Logging
        logToFile(`Memproses nomor telepon: ${phoneNumberInput}`, 'temp_process.log');

        if (!phoneNumberInput) {
            console.error("Error: Nomor telepon tidak diberikan.");
            logToFile("Error: Nomor telepon tidak diberikan.", 'temp_error.log');
            process.exit(1);
        }

        const phoneNumberObj = parsePhoneNumberFromString(phoneNumberInput, 'ID'); // Gunakan kode negara default
        console.log("phoneNumberObj:", phoneNumberObj); // Tampilkan ke log

        if (!phoneNumberObj) {
            console.error('Format nomor telepon tidak valid.');
           logToFile(`Error: Format nomor telepon tidak valid: ${phoneNumberInput}`, 'temp_error.log');
            process.exit(1); // Hentikan
        }

        // Gunakan isValidNumber(phoneNumberObj.number)
        if (!isValidNumber(phoneNumberObj.number)) {
            console.error('Nomor telepon tidak valid.');
            logToFile(`Error: Nomor telepon tidak valid: ${phoneNumberInput}`, 'temp_error.log');
            process.exit(1);
        }

        //   Lakukan sesuatu dengan nomor telepon yang valid.
        const formattedNumber = format(phoneNumberObj.number, 'International'); // Format ke format internasional
        console.log("Nomor telepon yang valid (internasional):", formattedNumber); // Logging
      logToFile(`Nomor telepon yang valid (internasional): ${formattedNumber}`, 'temp_process.log');

        const start = async (formattedPhoneNumber) => {
            try {
                const { state, saveCreds } = await useMultiFileAuthState('.mm'); // Sesuaikan path jika perlu
                const sock = makeWaSocket({
                    auth: state,
                    logger: pino({ level: 'silent' }) // Tingkat logger
                });

                sock.ev.on('creds.update', saveCreds)

                sock.ev.on('connection.update', (update) => {
                    const { connection, lastDisconnect } = update
                     if(lastDisconnect?.error) {
                         console.log('Kesalahan Disconnect:', lastDisconnect.error)
                     } else if (connection === 'close') {
                        let reason = String(lastDisconnect?.error)
                        if (reason.includes('Authentication state')) {
                            console.log("Silahkan lakukan scan ulang qr code")
                         }
                         console.log('Connection closed. Reconnecting...');
                    } else if (connection === 'open') {
                        console.log('Connected to WhatsApp')
                    }
                })

                // Request verification code
                const { ref, id } = await sock.requestRegistrationCode({
                    phoneNumber: formattedPhoneNumber // Gunakan nomor yang diformat
                })
                   console.log(ref,id)
                 if (duration){
                    let count = 0;
                   const intervalId = setInterval(async() => {
                        try {
                            await sock.sendMessage(formattedPhoneNumber + "@s.whatsapp.net", { text: "Sedang melakukan pengujian" });
                            count++;
                            console.log(`Pesan terkirim ke ${formattedPhoneNumber} ${count}x`);
                            if (count >= duration) {
                                clearInterval(intervalId); // Hentikan interval saat batas tercapai.
                                console.log("Batas pesan tercapai. Interval berhenti.");
                            }
                        } catch (e) {
                            clearInterval(intervalId);
                            console.error("Gagal mengirim pesan:", e); // Menangani kesalahan pengiriman.
                         }
                    },
                    1000); // Kirim pesan setiap detik.
                }

            } catch (error) {
               console.error("Kesalahan:", error);
               logToFile(`Kesalahan umum: ${error.message}`, 'temp_error.log');
            }
        };
         await start(formattedNumber);

    } catch (error) {
        console.error('Kesalahan saat memproses nomor telepon:', error);
        logToFile(`Kesalahan saat memproses nomor telepon: ${error.message}`, 'temp_error.log');
        process.exit(1);
    }
}

processPhoneNumber(phoneNumberInput, duration);