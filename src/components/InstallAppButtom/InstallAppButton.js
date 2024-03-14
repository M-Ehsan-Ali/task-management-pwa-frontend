import React, { useEffect, useState } from "react";

const InstallAppButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      event.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if the screen size is small enough to be considered mobile
    const mobileMediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mobileMediaQuery.matches);

    // Listen for changes in screen size
    const handleScreenResize = (e) => {
      setIsMobile(e.matches);
    };

    mobileMediaQuery.addListener(handleScreenResize);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      mobileMediaQuery.removeListener(handleScreenResize);
    };
  }, []);

  const handleInstallButtonClick = () => {
    if (deferredPrompt) {
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        // Clear the deferredPrompt object
        setDeferredPrompt(null);
      });
    }
  };

  const handleContinueUsingBrowserClick = () => {
    // Hide the button
    setShowButton(false);
  };

  return (
    deferredPrompt &&
    isMobile &&
    showButton && (
      <div className="w-full fixed bottom-0 p-2 flex justify-between bg-gray-200">
        <button
          onClick={handleContinueUsingBrowserClick}
          className="text-red-500 px-4 py-2 rounded mr-2 text-sm sm:text-base"
        >
          Continue Using Browser
        </button>
        <button
          onClick={handleInstallButtonClick}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow mr-2"
        >
          Install App
        </button>
      </div>
    )
  );
};

export default InstallAppButton;
