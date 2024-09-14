'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from 'sonner';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const EnterpriseFormPopover = () => {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await fetch('/api/user-email');
        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.email || '');
        }
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    fetchUserEmail();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus('submitting');

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/enterprise-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        (event.target as HTMLFormElement).reset();
        toast.success("Thank you for your interest, we'll be in touch soon.");
      } else {
        setSubmitStatus('error');
        toast.error('Error submitting form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      toast.error('Error submitting form. Please try again.');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="relative mb-4 text-stone-100 dark:text-stone-900 bg-stone-900 dark:bg-stone-100 from-neutral-800 via-neutral-800 to-black px-6 py-2 rounded-lg group transition-[width] duration-100 ease-[cubic-bezier(0.64_0.57_0.67_1.53)] text-lg flex items-center mx-auto w-auto shadow-[0_1px_5px_rgba(0,0,0,0.2)]">
          Contact Us
          <div className="w-0 opacity-0 group-hover:w-[16px] group-hover:opacity-100 ml-1 overflow-hidden duration-100 ease-[cubic-bezier(0.64_0.57_0.67_1.53)] transition-[width]">
            →
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Enterprise Inquiry</h4>
            <p className="text-sm text-muted-foreground">
              Please provide your information and we'll be in touch.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                className="col-span-2 h-8"
                required
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                className="col-span-2 h-8"
                required
                defaultValue={userEmail}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                className="col-span-2 h-8"
                required
              />
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={submitStatus === 'submitting'}
            className="bg-stone-900 dark:bg-transparent dark:hover:text-stone-900 text-stone-100 hover:bg-stone-800 dark:hover:bg-stone-100"
          >
            {submitStatus === 'submitting' ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default EnterpriseFormPopover;