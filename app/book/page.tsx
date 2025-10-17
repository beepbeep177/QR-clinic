'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoBackButton } from '@/components/ui/go-back-button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const bookingSchema = z.object({
  patient_name: z.string().min(2, 'Name must be at least 2 characters'),
  patient_email: z.string().email('Please enter a valid email'),
  patient_phone: z.string().min(8, 'Please enter a valid phone number'),
  appointment_date: z.date({
    required_error: 'Please select a date',
  }),
  appointment_time: z.string().min(1, 'Please select a time'),
  consultation_type: z.string().min(1, 'Please select a consultation type'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30'
];

const consultationTypes = [
  'General Consultation',
  'Follow-up',
  'Specialist Consultation',
  'Emergency'
];

export default function BookAppointmentPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      patient_name: '',
      patient_email: '',
      patient_phone: '',
      appointment_time: '',
      consultation_type: '',
    },
  });

  async function onSubmit(values: BookingFormValues) {
    setIsLoading(true);
    try {
      // Validate required fields
      if (!values.appointment_date) {
        toast.error('Please select an appointment date');
        return;
      }
      if (!values.appointment_time) {
        toast.error('Please select an appointment time');
        return;
      }
      if (!values.consultation_type) {
        toast.error('Please select a consultation type');
        return;
      }

      // Fix date formatting to avoid timezone issues
      const appointmentDate = new Date(values.appointment_date);
      const formattedDate = appointmentDate.getFullYear() + '-' + 
        String(appointmentDate.getMonth() + 1).padStart(2, '0') + '-' + 
        String(appointmentDate.getDate()).padStart(2, '0');

      const appointmentData = {
        patient_name: values.patient_name.trim(),
        patient_email: values.patient_email.trim().toLowerCase(),
        patient_phone: values.patient_phone.trim(),
        appointment_date: formattedDate,
        appointment_time: values.appointment_time,
        consultation_type: values.consultation_type,
        status: 'pending',
      };

      console.log('Submitting appointment:', appointmentData);

      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Appointment created:', data);
      setIsSubmitted(true);
      toast.success('Appointment booked successfully!');
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      
      // More specific error messages
      if (error?.code === 'PGRST116') {
        toast.error('Database table not found. Please contact support.');
      } else if (error?.code === '23505') {
        toast.error('This appointment slot may already be taken.');
      } else if (error?.message?.includes('permission')) {
        toast.error('Permission denied. Please check database settings.');
      } else if (error?.message?.includes('network')) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(`Failed to book appointment: ${error?.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-500 via-pink-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-sky-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Appointment Confirmed!
            </h1>
            <p className="text-slate-600 mb-6">
              We've received your appointment request. You will receive a confirmation email shortly.
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                form.reset();
              }}
              className="w-full"
            >
              Book Another Appointment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-teal-200 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <GoBackButton to="/">Back to Home</GoBackButton>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Book an Appointment
          </h1>
          <p className="text-slate-600">
            Fill in your details to schedule a consultation
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="patient_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patient_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patient_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consultation_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultation Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select consultation type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {consultationTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointment_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Appointment Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today || date.getDay() === 0 || date.getDay() === 6;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointment_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Time</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Booking...' : 'Book Appointment'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
