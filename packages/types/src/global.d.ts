import "react";

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

declare module "pdfjs-dist/build/pdf.worker.entry" {
  const worker: string;
  export default worker;
}
