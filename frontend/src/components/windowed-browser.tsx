import { motion } from 'framer-motion';
import { IconX } from "@tabler/icons-react";

const WindowedBrowser: React.FC<{ url: string; onClose: () => void }> = ({ url, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed top-0 right-0 w-1/2 h-full bg-white dark:bg-neutral-800 shadow-lg z-50"
    >
      <div className="flex justify-between items-center p-2 bg-gray-200 dark:bg-neutral-700">
        <p className="truncate flex-grow">{url}</p>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-neutral-600"
        >
          <IconX className="h-5 w-5" />
        </button>
      </div>
      <iframe src={url} className="w-full h-[calc(100%-40px)]" />
    </motion.div>
  );
};

export default WindowedBrowser;