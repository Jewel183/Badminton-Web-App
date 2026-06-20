import { createContext, useState, useContext, useCallback, useRef } from 'react';
import Popup from './popup';

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupContent, setPopupContent] = useState({
    title: '',
    message: '',
    buttonText: '',
    onConfirm: null,
    blurIntensity: 4,
    autoCloseSeconds: null,
    mandatory: false,
  });

  const timeoutRef = useRef(null);
  const showPopup = useCallback((title, message, buttonText, onConfirmCallback = null, blurValue = 4, autoCloseSeconds = null, mandatory = false) => {
    setPopupContent({
      title,
      message,
      buttonText,
      onConfirm: onConfirmCallback,
      blurIntensity: blurValue,
      autoCloseSeconds,
      mandatory,
    });
    setIsOpen(true);

    if (timeoutRef.current) 
      clearTimeout(timeoutRef.current)

    if (!onConfirmCallback && autoCloseSeconds && autoCloseSeconds > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
        timeoutRef.current = null;
      }, autoCloseSeconds * 1000);
    }
  }, []);

  const hidePopup = () => {
    if (!popupContent.mandatory)
      setIsOpen(false);
  };

  const confirmPopup = () => {
    if (popupContent.onConfirm && typeof popupContent.onConfirm === 'function')
      popupContent.onConfirm();
    setIsOpen(false);
  };

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      <Popup
        isOpen={isOpen}
        title={popupContent.title}
        message={popupContent.message}
        buttonText={popupContent.buttonText}
        onClose={hidePopup}
        onConfirm={confirmPopup}
        blurIntensity={popupContent.blurIntensity}
        mandatory={popupContent.mandatory}
      />
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};