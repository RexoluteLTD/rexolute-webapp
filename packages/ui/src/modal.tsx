

import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@rexolute/utils/cn";
import { Button } from "@rexolute/ui/button";
import { ModalProps } from "@rexolute/types";

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity",
        isOpen ? "opacity-100" : "opacity-0"
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full max-w-md rounded-lg bg-white p-6 shadow-lg transition-all",
          isOpen ? "scale-100" : "scale-95",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute right-4 top-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mb-4 text-center", className)}>{children}</div>;
}

export function ModalBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mb-6", className)}>{children}</div>;
}

export function ModalFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex justify-center gap-4", className)}>{children}</div>
  );
}

export function ModalIcon({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex justify-center mb-4">
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
