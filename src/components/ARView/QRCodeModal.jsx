import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, ArrowRight, Wifi, Globe, Usb } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import styles from './QRCodeModal.module.css';

export function QRCodeModal() {
  const { selectedProduct, qrModalOpen, setQrModalOpen, setViewMode } = useAppStore();

  // If running on localhost, replace with local network IP (e.g. 192.168.1.5) so mobile devices on Wi-Fi can connect
  const initialHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? '192.168.1.5'
    : window.location.hostname;
  
  const initialPort = window.location.port ? `:${window.location.port}` : '';
  const initialProtocol = window.location.protocol;

  const [customHost, setCustomHost] = useState(`${initialProtocol}//${initialHost}${initialPort}`);

  if (!qrModalOpen || !selectedProduct) return null;

  const qrUrl = customHost.endsWith('/') ? customHost : `${customHost}/`;

  const handleLaunchDirectly = () => {
    setQrModalOpen(false);
    setViewMode('ar');
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={() => setQrModalOpen(false)} className={styles.closeBtn} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className={styles.header}>
          <div className={styles.iconCircle}>
            <Smartphone size={24} color="#6366f1" />
          </div>
          <h3>Experience in Real World AR</h3>
          <p>Scan this QR code using your iOS or Android mobile camera to view <strong>{selectedProduct.name}</strong>.</p>
        </div>

        <div className={styles.qrContainer}>
          <QRCodeSVG
            value={qrUrl}
            size={180}
            bgColor="#ffffff"
            fgColor="#0f172a"
            level="H"
            marginSize={2}
          />
        </div>

        <div className={styles.urlInputGroup}>
          <label className={styles.inputLabel}>Mobile Access URL (Wi-Fi / HTTPS):</label>
          <div className={styles.inputWrapper}>
            <Globe size={16} className={styles.inputIcon} />
            <input
              type="text"
              value={customHost}
              onChange={(e) => setCustomHost(e.target.value)}
              className={styles.hostInput}
            />
          </div>
          <span className={styles.inputHint}>Phone must be connected to the same Wi-Fi network</span>
        </div>

        <div className={styles.stepsList}>
          <div className={styles.step}>
            <Wifi size={16} color="#6366f1" />
            <span>Connect phone to same Wi-Fi network (192.168.1.x)</span>
          </div>
          <div className={styles.step}>
            <Usb size={16} color="#6366f1" />
            <span>Or for USB Debugging: use <code>chrome://inspect</code> port forwarding 3000 -&gt; 3000</span>
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={handleLaunchDirectly} className={styles.devBtn}>
            <span>Test WebAR component directly in this browser</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
