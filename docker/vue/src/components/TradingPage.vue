<template>
  <div class="container">
    <!-- Generate QR Code -->
    <button class="btn" @click="generateQRCode">Generate QR Code</button>

    <!-- QR Code Display -->
    <div v-if="qrCodeUrl" class="qr-section">
      <img :src="qrCodeUrl" alt="Scan this QR code to join the trade">
    </div>

    <!-- QR Scanner -->
    <div class="scanner-section">
      <video ref="videoElement" class="video"></video>
      <button class="btn" @click="startScanning">Scan QR Code</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import QRCode from "qrcode"; // npm install qrcode
import QrScanner from "qr-scanner"; // npm install qr-scanner

import { API_URL } from "../config";

export default {
  data() {
    return {
      tradeCode: null, 
      qrCodeUrl: null, 
      scanner: null,
    };
  },
  methods: {
    async generateQRCode() {
      try {
        const response = await axios.post(`${API_URL}/api/startTrade`);
        this.tradeCode = response.data.tradeCode;
        console.log("Created Trade Code:", this.tradeCode);

        // Generate QR Code
        this.qrCodeUrl = await QRCode.toDataURL(this.tradeCode);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    },

    startScanning() {
      const videoElem = this.$refs.videoElement;
      if (!videoElem) {
        console.error("Video element not found!");
        return;
      }

      if (!this.scanner) {
        this.scanner = new QrScanner(
          videoElem,
          (result) => {
            console.log("Scanned Trade Code:", result.data);
            this.joinTrade(result.data);
            this.scanner.stop();
          },
          { returnDetailedScanResult: true }
        );
      }

      this.scanner.start();
    },

    async joinTrade(tradeCode) {
      try {
        await axios.post(`${API_URL}/api/joinTrade`, { tradeCode });
        alert("Successfully joined the trade!");
      } catch (error) {
        console.error("Error joining trade:", error);
      }
    },
  },
  beforeDestroy() {
    if (this.scanner) {
      this.scanner.destroy();
    }
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 10rem;
  gap: 2rem;
}

.btn {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn:hover {
  background-color: #0056b3;
}

.qr-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.qr-section img {
  max-width: 250px;
  border: 2px solid #333;
  border-radius: 12px;
  padding: 8px;
}

.scanner-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.video {
  width: 300px;
  height: 200px;
  background: black;
  border-radius: 10px;
}
</style>
