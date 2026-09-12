import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Copy, Check, QrCode, ExternalLink, Printer } from 'lucide-react';
import { toast } from 'sonner';

interface ShareAppQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppQRModal: React.FC<ShareAppQRModalProps> = ({ isOpen, onClose }) => {
  const [appUrl, setAppUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentOrigin = window.location.origin;
      setAppUrl(currentOrigin);
    }
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      toast.success('Digital Library link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Failed to copy link. Please select and copy manually.');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to print the QR poster.');
      return;
    }

    const svgElement = qrRef.current?.querySelector('svg');
    const svgHtml = svgElement ? svgElement.outerHTML : '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Digital Library QR Access Poster</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              text-align: center;
              padding: 40px 20px;
              color: #1e293b;
            }
            .poster {
              max-width: 480px;
              margin: 0 auto;
              border: 3px solid #3b82f6;
              border-radius: 20px;
              padding: 36px 24px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.08);
            }
            h1 {
              color: #1d4ed8;
              margin-bottom: 8px;
              font-size: 28px;
            }
            p.sub {
              color: #64748b;
              font-size: 16px;
              margin-bottom: 24px;
            }
            .qr-wrapper {
              background: #ffffff;
              display: inline-block;
              padding: 20px;
              border-radius: 16px;
              border: 1px solid #e2e8f0;
              margin-bottom: 20px;
            }
            .url-text {
              background: #f1f5f9;
              padding: 10px 16px;
              border-radius: 8px;
              font-family: monospace;
              font-size: 15px;
              color: #0f172a;
              word-break: break-all;
            }
            .footer-note {
              margin-top: 24px;
              font-size: 14px;
              color: #64748b;
            }
            @media print {
              body { padding: 0; }
              .poster { border: 2px solid #000; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="poster">
            <h1>📚 Digital Library System</h1>
            <p class="sub">Scan with your smartphone camera to access the library portal</p>
            <div class="qr-wrapper">
              ${svgHtml}
            </div>
            <div class="url-text">${appUrl}</div>
            <p class="footer-note">Browse books • Borrow with QR • Manage your account</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <QrCode className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-800">
            Digital Library QR Access
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Scan this QR code with any smartphone camera to open the Digital Library instantly.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-4 space-y-4">
          <div
            ref={qrRef}
            className="p-4 bg-white rounded-2xl border-2 border-primary/20 shadow-md flex items-center justify-center"
          >
            {appUrl ? (
              <QRCode
                value={appUrl}
                size={210}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                viewBox={`0 0 256 256`}
              />
            ) : (
              <div className="w-[210px] h-[210px] flex items-center justify-center text-slate-400">
                Generating QR...
              </div>
            )}
          </div>

          <div className="w-full space-y-2">
            <div className="flex items-center space-x-2">
              <Input
                value={appUrl}
                onChange={(e) => setAppUrl(e.target.value)}
                placeholder="https://your-digital-library.vercel.app"
                className="font-mono text-xs bg-slate-50"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopy}
                title="Copy URL"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Works on iOS Camera, Google Lens, and any QR scanner app.
            </p>
          </div>

          <div className="w-full grid grid-cols-2 gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="w-full flex items-center justify-center"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Poster
            </Button>
            <Button
              variant="default"
              onClick={() => window.open(appUrl, '_blank')}
              className="w-full flex items-center justify-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open In Tab
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
