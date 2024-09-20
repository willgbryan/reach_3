import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from 'next/link';

interface UpgradeAlertProps {
  onClose: () => void;
}

export const UpgradeAlert: React.FC<UpgradeAlertProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="upgrade-alert dark:bg-[#121212] bg-stone-100 p-6 rounded-lg shadow-lg w-[400px] border-2 border-slate-900 dark:border-stone-100"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        pointerEvents: 'auto',
      }}
    >
      <Alert className="bg-brand border-none">
        <AlertTitle className="dark:text-stone-100 text-stone-900 text-[1.15rem] font-bold mb-4">
          Upgrade to Pro
        </AlertTitle>
        <AlertDescription className="dark:text-stone-100 text-stone-900">
          You've used all your free searches. Upgrade to our Pro plan for unlimited searches and advanced features.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-between mt-4">
        <Button onClick={onClose} className="text-stone-900 dark:text-stone-100 hover:text-stone-900 dark:hover:text-stone-100" variant="ghost">
          Cancel
        </Button>
        <Link href="/pricing">
          <Button className="" variant="default">
            Upgrade to Pro
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};