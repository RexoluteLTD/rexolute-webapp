import { Fragment, useEffect, useState } from "react";
import type { ReactNode } from "react";

const NoSSR = ({ children }: { children: ReactNode }) => {
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <Fragment>{children}</Fragment>;
};

export default NoSSR;
