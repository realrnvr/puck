import { useEffect } from "react";
import { useController } from "yet-another-react-lightbox";

export const useDisableEvent = (isOpen) => {
  const { subscribeSensors } = useController();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const unsubscribeKeyDown = subscribeSensors("onKeyDown", (event) => {
      event.stopPropagation();
    });

    const unsubscribePointerDown = subscribeSensors(
      "onPointerDown",
      (event) => {
        event.stopPropagation();
      }
    );

    const unsubscribeWheel = subscribeSensors("onWheel", (event) => {
      event.stopPropagation();
    });

    const unsubscribeGestureStart = subscribeSensors(
      "onGestureStart",
      (event) => {
        event.stopPropagation();
        event.preventDefault();
      }
    );

    return () => {
      unsubscribeKeyDown();
      unsubscribePointerDown();
      unsubscribeWheel();
      unsubscribeGestureStart();
    };
  }, [isOpen, subscribeSensors]);
};
