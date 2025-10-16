'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Settings</h1>
        <p className="text-slate-600">Configure clinic preferences</p>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl text-slate-800">Clinic Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
              <SettingsIcon className="w-8 h-8 text-sky-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Settings Coming Soon
            </h3>
            <p className="text-slate-600 max-w-md">
              Configure operating hours, consultation types, and other clinic preferences.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
