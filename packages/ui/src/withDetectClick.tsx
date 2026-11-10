import React, { FC, ReactNode, useEffect, useRef } from "react";
type WithDetectClickProps = {
  children: ReactNode;
  onClickOutside: (event: MouseEvent) => void;
};

const WithDetectClick: FC<WithDetectClickProps> = ({
  children,
  onClickOutside,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.addEventListener("mousedown", onHandleClickEvt, true);

    return () => {
      document.removeEventListener("mousedown", onHandleClickEvt, true);
    };
  });

  const onHandleClickEvt = (evt: any) => {
    evt.stopPropagation();

    if (evt.target.dataset.toggle === "true") {
      onClickOutside(evt);
      return;
    }

    if (wrapperRef.current && !wrapperRef.current.contains(evt.target)) {
      onClickOutside(evt);
      return;
    }
  };

  return (
    <div
      ref={wrapperRef}
      data-ref="container"
      className="w-100 position-relative"
    >
      {children}
    </div>
  );
};

export default WithDetectClick;
