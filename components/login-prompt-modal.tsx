"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Lock, LogIn, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPromptModal = ({ isOpen, onClose }: LoginPromptModalProps) => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    onClose();
    router.push("/api/auth/signin");
  };

  const handleClose = () => {
    onClose();
  };

  // Custom X button click handler
  const handleXButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    handleClose();
  };

  // Prevent any body clicks while modal is closing
  useEffect(() => {
    if (!isOpen) {
      // When modal closes, temporarily prevent all clicks on the body
      const preventClicks = (e: MouseEvent) => {
        e.stopImmediatePropagation();
        e.preventDefault();
      };

      document.body.addEventListener('click', preventClicks, true);
      
      const cleanup = setTimeout(() => {
        document.body.removeEventListener('click', preventClicks, true);
      }, 150);

      return () => {
        document.body.removeEventListener('click', preventClicks, true);
        clearTimeout(cleanup);
      };
    }
  }, [isOpen]);

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[425px]"
        onClick={(e) => e.stopPropagation()} 
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          setTimeout(() => {
            document.body.focus();
          }, 0);
        }}
        onPointerDownOutside={(e) => {
          e.preventDefault();
          handleClose();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          handleClose();
        }}
        onInteractOutside={(e) => {
          e.preventDefault();
          handleClose();
        }}
        showCloseButton={false}
      >
        {/* Custom X button positioned absolutely */}
        <button
          onClick={handleXButtonClick}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader>
          <DialogTitle className="flex items-center pr-8">
            <Lock className="h-5 w-5 mr-2 text-primary" />
            Login Required
          </DialogTitle>
          <DialogDescription>
            You need to be logged in to like pets and save your favorites.
            Please log in or create an account to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLoginRedirect();
            }}
          >
            <LogIn className="h-5 w-5 mr-2" />
            Login / Sign Up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPromptModal;