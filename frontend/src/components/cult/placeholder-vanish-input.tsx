import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";

interface PixelData {
  x: number;
  y: number;
  r: number;
  color: string;
}

export function PlaceholdersAndVanishInput({
  placeholders,
  onSubmit,
  onStartOver,
  disabled = false,
  currentStep,
  hasContent = false,
}: {
  placeholders: string[];
  onSubmit: (value: string) => void;
  onStartOver: () => void;
  disabled?: boolean;
  currentStep: string;
  hasContent?: boolean;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startPlaceholderAnimation = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 5000);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState !== "visible") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      startPlaceholderAnimation();
    }
  };

  useEffect(() => {
    startPlaceholderAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [placeholders]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<PixelData[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);

  const adjustTextareaHeight = () => {
    if (inputRef.current && !animating) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  const draw = useCallback(() => {
    if (!inputRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = inputRef.current.getBoundingClientRect();
    const computedStyles = getComputedStyle(inputRef.current);

    const width = rect.width;
    const height = inputRef.current.scrollHeight;

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    const fontFamily = computedStyles.getPropertyValue("font-family");
    const fontWeight = computedStyles.getPropertyValue("font-weight");
    const lineHeight = parseFloat(computedStyles.getPropertyValue("line-height"));
    const color = computedStyles.getPropertyValue("color");
    const paddingLeft = parseFloat(computedStyles.getPropertyValue("padding-left"));
    const paddingTop = parseFloat(computedStyles.getPropertyValue("padding-top"));

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;

    const lines = value.split("\n");

    lines.forEach((line, index) => {
      ctx.fillText(line, paddingLeft, paddingTop + (index + 0.8) * lineHeight);
    });

    const imageData = ctx.getImageData(0, 0, width, height);
    const pixelData = imageData.data;
    const newData: PixelData[] = [];

    for (let t = 0; t < height; t++) {
      let i = 4 * t * width;
      for (let n = 0; n < width; n++) {
        let e = i + 4 * n;
        if (pixelData[e + 3] !== 0) {
          newData.push({
            x: n,
            y: t,
            r: 1,
            color: `rgba(${pixelData[e]}, ${pixelData[e + 1]}, ${pixelData[e + 2]}, ${pixelData[e + 3]})`,
          });
        }
      }
    }

    newDataRef.current = newData;
  }, [value]);

  useEffect(() => {
    draw();
    adjustTextareaHeight();
  }, [value, draw]);

  const animate = (start: number, currentValue: string) => {
    const animateFrame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        const newArr: PixelData[] = [];
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i];
          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) {
              current.r = 0;
              continue;
            }
            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= 0.05 * Math.random();
            newArr.push(current);
          }
        }
        newDataRef.current = newArr;
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(pos, 0, canvas.width, canvas.height);
            newDataRef.current.forEach((t) => {
              const { x: n, y: i, r: s, color } = t;
              if (n > pos) {
                ctx.beginPath();
                ctx.rect(n, i, s, s);
                ctx.fillStyle = color;
                ctx.strokeStyle = color;
                ctx.stroke();
              }
            });
          }
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setValue("");
          setAnimating(false);
          if (inputRef.current) {
            inputRef.current.style.height = "auto";
            inputRef.current.style.minHeight = "";
            inputRef.current.style.maxHeight = "";
            adjustTextareaHeight();
          }
          onSubmit && onSubmit(currentValue);
        }
      });
    };
    animateFrame(start);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!disabled && !animating) {
      setValue(e.target.value);
      adjustTextareaHeight();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !animating && !disabled) {
      if (e.shiftKey) {
      } else {
        e.preventDefault();
        vanishAndSubmit();
      }
    }
  };

  const vanishAndSubmit = () => {
    if (disabled) return;

    if (inputRef.current) {
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      inputRef.current.style.minHeight = inputRef.current.style.height;
      inputRef.current.style.maxHeight = inputRef.current.style.height;
    }

    setAnimating(true);
    draw();

    const currentValue = inputRef.current?.value || value;
    if (currentValue && inputRef.current) {
      const maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0
      );
      animate(maxX, currentValue);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!disabled) {
      vanishAndSubmit();
    }
  };

  return (
    <form
      className={cn(
        "w-full relative max-w-3xl mx-auto bg-white dark:bg-zinc-800 rounded-lg overflow-hidden shadow transition duration-200",
        value && "bg-gray-50",
        disabled && !hasContent && "opacity-50 cursor-not-allowed"
      )}
      onSubmit={handleSubmit}
    >
      <div className="relative">
        <Textarea
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          value={value}
          disabled={disabled}
          className={cn(
            "w-full text-sm sm:text-base border-none dark:text-white bg-transparent text-black focus:outline-none focus:ring-0 p-4 pr-12 resize-none overflow-hidden",
            animating && "text-transparent dark:text-transparent",
            disabled && "cursor-not-allowed"
          )}
          rows={1}
          placeholder=""
        />
        <canvas
          className={cn(
            "absolute top-0 left-0 w-full h-full pointer-events-none",
            !animating ? "opacity-0" : "opacity-100"
          )}
          ref={canvasRef}
        />
        {currentStep !== "initial" ? (
          <div className="absolute top-4 right-4 h-6 w-6 flex items-center justify-center">
            <LoaderIcon className="animate-spin" />
          </div>
        ) : hasContent ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              onStartOver();
            }}
            className={cn(
              "absolute top-4 right-4 h-8 px-4 rounded-full",
              "bg-stone-100 dark:bg-zinc-900 text-stone-900 dark:text-stone-100",
              "transition duration-200 flex items-center justify-center",
              "hover:bg-gray-800 dark:hover:bg-zinc-700 hover:text-stone-100",
              "active:bg-gray-700 dark:active:bg-zinc-600"
            )}
          >
            Start over
          </button>
        ) : (
          <button
            disabled={!value || disabled}
            type="submit"
            className={cn(
              "absolute top-4 right-4 h-8 w-8 rounded-full",
              "disabled:bg-gray-100 bg-black dark:bg-zinc-900 dark:disabled:bg-zinc-800",
              "transition duration-200 flex items-center justify-center",
              disabled && "cursor-not-allowed"
            )}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-300 h-4 w-4"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <motion.path
                d="M5 12l14 0"
                initial={{
                  strokeDasharray: "50%",
                  strokeDashoffset: "50%",
                }}
                animate={{
                  strokeDashoffset: value && !disabled ? 0 : "50%",
                }}
                transition={{
                  duration: 0.3,
                  ease: "linear",
                }}
              />
              <path d="M13 18l6 -6" />
              <path d="M13 6l6 6" />
            </motion.svg>
          </button>
        )}
      </div>

      <div className="absolute inset-0 flex items-start pointer-events-none max-w-md md:max-w-4xl">
        <AnimatePresence mode="wait">
          {(!value || disabled) && (
            <motion.p
              initial={{
                y: 5,
                opacity: 0,
              }}
              key={`current-placeholder-${currentPlaceholder}`}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -15,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "linear",
              }}
              className={cn(
                "dark:text-neutral-500 text-sm sm:text-base font-normal text-neutral-500 p-4 sm:pl-12 text-left w-[calc(100%-2rem)] truncate",
                disabled && !hasContent && "text-stone-900 dark:text-stone-100"
              )}
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
