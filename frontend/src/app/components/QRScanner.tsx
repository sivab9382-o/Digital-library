import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Camera, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScanTimeRef = useRef<number>(0);
  const onScanRef = useRef(onScan);

  // Keep the ref updated with the latest prop
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.warn);
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      };

      // Try starting with environment camera, if fails try any camera
      try {
        await scanner.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            const now = Date.now();
            if (now - lastScanTimeRef.current < 2000) return;
            lastScanTimeRef.current = now;
            onScanRef.current(decodedText);
          },
          () => { }
        );
      } catch (e) {
        console.warn('Environment camera failed, trying default camera', e);
        await scanner.start(
          { facingMode: 'user' }, // fallback to user-facing or default
          config,
          (decodedText) => {
            const now = Date.now();
            if (now - lastScanTimeRef.current < 2000) return;
            lastScanTimeRef.current = now;
            onScanRef.current(decodedText);
          },
          () => { }
        );
      }

      setIsScanning(true);
    } catch (err) {
      console.error('Error starting scanner:', err);
      toast.error('Failed to start camera. Please check permissions.');
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>QR Code Scanner</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XCircle className="h-5 w-5" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div id="qr-reader" className="w-full" style={{ minHeight: isScanning ? '300px' : '0' }}></div>

        {!isScanning && (
          <Button onClick={startScanning} className="w-full">
            <Camera className="mr-2 h-4 w-4" />
            Start Camera
          </Button>
        )}

        {isScanning && (
          <Button onClick={stopScanning} variant="outline" className="w-full">
            Stop Scanning
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
