import React from 'react';
import { Button } from "@/components/ui/button";
import { Info } from 'lucide-react';

interface InfoButtonProps {
  onTriggerTutorial: () => void;
}

const InfoButton: React.FC<InfoButtonProps> = ({ onTriggerTutorial }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="ml-2"
      onClick={onTriggerTutorial}
    >
      <Info className="h-4 w-4" />
    </Button>
  );
};

export default InfoButton;