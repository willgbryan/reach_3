import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconX, IconExternalLink, IconRefresh } from "@tabler/icons-react";

interface WindowedBrowserProps {
  url: string;
  onClose: () => void;
}

const WindowedBrowser: React.FC<WindowedBrowserProps> = ({ url, onClose }) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setIframeKey(prev => prev + 1);
    setLoadError(false);
  }, [url]);

  const handleIframeError = () => {
    setLoadError(true);
  };

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
    setLoadError(false);
  };

  const openInNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed top-0 right-0 w-1/2 h-full bg-white dark:bg-neutral-800 shadow-lg z-50"
    >
      <div className="flex justify-between items-center p-2 bg-gray-200 dark:bg-neutral-700">
        <p className="truncate flex-grow">{url}</p>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-neutral-600"
            title="Refresh"
          >
            <IconRefresh className="h-5 w-5" />
          </button>
          <button
            onClick={openInNewTab}
            className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-neutral-600"
            title="Open in new tab"
          >
            <IconExternalLink className="h-5 w-5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-neutral-600"
            title="Close"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="w-full h-[calc(100%-40px)] relative">
        {loadError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-neutral-900">
            <p className="text-lg mb-4">Unable to load the content in this view.</p>
            <button
              onClick={openInNewTab}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Open in New Tab
            </button>
          </div>
        ) : (
          <iframe
            key={iframeKey}
            src={url}
            className="w-full h-full"
            onError={handleIframeError}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        )}
      </div>
    </motion.div>
  );
};

export default WindowedBrowser;