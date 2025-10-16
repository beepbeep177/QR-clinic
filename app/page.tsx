'use client';

import Link from 'next/link';
import Iridescence from '@/components/backgrounds/iridescence';
import { Button } from '@/components/ui/button';
import { Calendar, Users, QrCode, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0">
        <Iridescence />
      </div>
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            Welcome to Beep's Clinic Scheduler
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Streamline your clinic appointments with ease
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-sky-600" />
            </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-3">
              Book Appointment
            </h2>
            <p className="text-slate-600 mb-6 text-center">
              Patients can easily schedule their consultations online in just a few clicks.
            </p>
            <Link href="/book">
              <Button className="w-full group">
                Book Now
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-cyan-600" />
            </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-3">
              Admin Portal
            </h2>
            <p className="text-slate-600 mb-6 text-center">
              Manage appointments, view analytics, and access QR codes for easy sharing.
            </p>
            <Link href="/admin/login">
              <Button variant="outline" className="w-full group">
                Admin Login
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <QrCode className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">
            Quick Access with QR Code
          </h3>
          <p className="text-slate-600 text-center">
            Scan our QR code to book appointments instantly from anywhere in the clinic.
            No app download required!
          </p>
        </div>
      </div>
    </div>
  );
}
