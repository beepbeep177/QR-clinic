'use client';

import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function QRCodePage() {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const bookingUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/book`
    : process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/book`
    : 'https://qr-clinic.vercel.app/';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    toast.success('URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 1000;
    canvas.height = 1000;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 1000, 1000);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'clinic-booking-qr-code.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success('QR code downloaded!');
          }
        });
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Clinic Booking QR Code</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 40px;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
            }
            h1 {
              color: #0369a1;
              font-size: 32px;
              margin: 0 0 10px 0;
            }
            p {
              color: #475569;
              font-size: 18px;
              margin: 0;
            }
            .qr-container {
              display: flex;
              justify-content: center;
              margin-bottom: 30px;
            }
            .url {
              color: #64748b;
              font-size: 14px;
              text-align: center;
            }
            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Book Your Appointment</h1>
            <p>Scan the QR code to schedule a consultation</p>
          </div>
          <div class="qr-container">
            ${svgData}
          </div>
          <div class="url">
            ${bookingUrl}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">QR Code</h1>
        <p className="text-slate-600">Download and share the booking QR code</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">QR Code Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div
              ref={qrRef}
              className="bg-white p-8 rounded-lg shadow-sm border-2 border-slate-200"
            >
              <QRCodeSVG
                value={bookingUrl}
                size={300}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600 mb-2">Booking URL:</p>
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg">
                <code className="text-sm text-slate-700">{bookingUrl}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyUrl}
                  className="h-8 w-8 p-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Download QR Code</h3>
              <p className="text-sm text-slate-600 mb-3">
                Download the QR code as a high-quality PNG image for digital use.
              </p>
              <Button onClick={handleDownloadQR} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download PNG
              </Button>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-2">Print QR Code</h3>
              <p className="text-sm text-slate-600 mb-3">
                Print the QR code for display in your clinic or on promotional materials.
              </p>
              <Button onClick={handlePrint} variant="outline" className="w-full">
                Print QR Code
              </Button>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-2">How to Use</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>Download or print the QR code</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>Display it in your clinic waiting room or reception area</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>Patients can scan it with their phone camera to book appointments</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4.</span>
                  <span>Share the URL on social media, email, or your website</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
