import { useState, useLayoutEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

const createWrapperAndAppendToBody = (wrapperId: string, className: string) => {
  const wrapperElement = document.createElement("div");
  wrapperElement.setAttribute("id", wrapperId);
  className && wrapperElement.setAttribute("class", className);
  document.body.appendChild(wrapperElement);
  return wrapperElement;
};

const WithReactPortal = ({
  children,
  wrapperId = "portal-wrapper",
  className,
}: {
  children: ReactNode;
  wrapperId: string;
  className?: string | undefined;
}) => {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(
    null
  );

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);
    let systemCreated = false;
    // if element is not found with wrapperId or wrapperId is not provided,
    // create and append to body
    if (!element) {
      systemCreated = true;
      className
        ? (element = createWrapperAndAppendToBody(wrapperId, className))
        : (element = createWrapperAndAppendToBody(wrapperId, "wrapper-portal"));
    }
    setWrapperElement(element);

    return () => {
      // delete the programatically created element
      if (systemCreated && element?.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId, className]);

  // wrapperElement state will be null on very first render.
  if (wrapperElement === null) return null;

  return createPortal(children, wrapperElement);
};

export default WithReactPortal;
