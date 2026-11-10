import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  Fragment,
  useEffect,
  FC,
} from "react";

import { lazy, Suspense } from "react";
import type { DocViewerProps } from "react-doc-viewer";
import { useGesture } from "@use-gesture/react";
import { animated, useSpring, SpringValue } from "@react-spring/web";
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Download,
  FileText,
} from "lucide-react";

import { Button } from "@rexolute/ui/button";
import { Card, CardContent, CardHeader } from "@rexolute/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@rexolute/ui/pagination";
import { Separator } from "@rexolute/ui/separator";

import { FileType, GalleryItem } from "@rexolute/types";
import { cn, getFileType } from "@rexolute/utils";

// Type for the animated spring values
type AnimatedStyle = {
  x: SpringValue<number>;
  y: SpringValue<number>;
  scale: SpringValue<number>;
};

interface RendererProps {
  fileUrl: string;
  filename?: string;
  state: ViewerState;
  actions: ViewerActions;
}

interface ViewerState extends AnimatedStyle {
  rotation: SpringValue<number>; // Use SpringValue for rotation for smoother animation
  numPages: number;
  pageNumber: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  fileType: FileType;
}

interface ViewerActions {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  rotate: () => void;
  nextPage: () => void;
  prevPage: () => void;
  download: () => void;
  onPDFLoad: ({ numPages }: { numPages: number }) => void;
}

interface FileGalleryProps {
  items: GalleryItem[];
  itemsPerPage?: number;
}

export type FilesProps = {
  fileUrl: string;
  filename?: string;
};

export interface FileViewerProps {
  state: ViewerState;
  actions: ViewerActions;
}

const Document = lazy(async () => {
  const mod = await import("react-pdf");
  mod.pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
  return { default: mod.Document };
});
const Page = lazy(() => import("react-pdf").then((mod) => ({ default: mod.Page })));
const DocViewer = lazy(async () => {
  const mod = await import("react-doc-viewer");
  return { default: (props: DocViewerProps) => <mod.default {...props} pluginRenderers={mod.DocViewerRenderers} /> };
});

// --- Custom Hook for Viewer Logic ---
export const useFileViewer = (fileUrl: string, filename?: string) => {
  const fileType = useMemo(() => getFileType(fileUrl), [fileUrl]);

  // State for PDF-specific features
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);

  // Spring/Gesture setup for pan/zoom/rotate
  const containerRef = useRef<HTMLDivElement>(null);
  const [{ x, y, scale, rotation }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    config: { tension: 200, friction: 30 }, // Smoother spring config
  }));

  // Action functions
  const nextPage = useCallback(() => {
    if (pageNumber < numPages) setPageNumber((p) => p + 1);
  }, [pageNumber, numPages]);

  const prevPage = useCallback(() => {
    if (pageNumber > 1) setPageNumber((p) => p - 1);
  }, [pageNumber]);

  const resetView = useCallback(
    () => api.start({ x: 0, y: 0, scale: 1, rotation: 0, immediate: false }),
    [api]
  );

  const zoomIn = useCallback(
    () => api.start({ scale: scale.get() + 0.2 }),
    [api, scale]
  );
  const zoomOut = useCallback(
    () => api.start({ scale: Math.max(0.2, scale.get() - 0.2) }),
    [api, scale]
  );

  const rotate = useCallback(() => {
    // Animate rotation by adding 90 degrees
    const nextRotation = (rotation.get() + 90) % 360;
    api.start({ rotation: nextRotation });
  }, [api, rotation]);

  const download = useCallback(() => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = filename || fileUrl.split("/").pop() || "file"; // Fallback filename from URL
    a.click();
  }, [fileUrl, filename]);

  const onPDFLoad = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  // Enable pan + scroll zoom
  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }: { offset: [number, number] }) =>
        api.start({ x: dx, y: dy }),
      onPinch: ({ offset: [d] }: { offset: [number, number] }) =>
        api.start({ scale: 1 + d / 200 }),
      onWheel: ({ event }: { event: WheelEvent }) => {
        event.preventDefault();
        api.start({
          scale: Math.min(
            Math.max(scale.get() + event.deltaY * -0.001, 0.5),
            5
          ),
        });
      },
    },
    {
      drag: { from: () => [x.get(), y.get()] },
      target: containerRef,
      eventOptions: { passive: false },
    }
  );

  const state: ViewerState = {
    x,
    y,
    scale,
    rotation,
    numPages,
    pageNumber,
    containerRef,
    fileType,
  };
  const actions: ViewerActions = {
    zoomIn,
    zoomOut,
    resetView,
    rotate,
    nextPage,
    prevPage,
    download,
    onPDFLoad,
  };

  return { state, actions };
};

// --- Renderer Components ---
export const AnimatedView: React.FC<React.PropsWithChildren<AnimatedStyle>> = ({
  children,
  x,
  y,
  scale,
}) => (
  <animated.div
    style={{ x, y, scale, touchAction: "none" }}
    className="h-full w-full flex items-center justify-center transition-transform"
    // className="flex justify-center transition-shadow"
  >
    {children}
  </animated.div>
);

export const ViewerContent: React.FC<RendererProps> = ({
  fileUrl,
  filename,
  state,
  actions,
}) => {
  const { fileType, x, y, scale, rotation, numPages } = state;
  const docViewerConfig: DocViewerProps["config"] = {
    header: { disableHeader: true },
  };

  // Use a single style object for all animated content
  const animatedStyle = useMemo(
    () => ({
      x,
      y,
      scale,
      rotate: rotation.to((r) => `${r}deg`),
    }),
    [x, y, scale, rotation]
  );

  switch (fileType) {
    /* Note: When using multi-page, pagination controls usually
     * switch the pageNumber prop, but since we're rendering ALL pages,
     * we rely on the component's internal index (i + 1)
     * */
    case "pdf":
      return (
        <Suspense fallback={<p>Loading document…</p>}><Document file={fileUrl} onLoadSuccess={actions.onPDFLoad}>
          <div className="space-y-4 pb-10">
            {Array.from(new Array(numPages), (_, i) => (
              <AnimatedView key={i} {...animatedStyle}>
                <Page
                  pageNumber={i + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </AnimatedView>
            ))}
          </div>
        </Document></Suspense>
      );

    case "image":
      return (
        <AnimatedView {...animatedStyle}>
          <img
            src={fileUrl}
            alt={filename || "image-file"}
            width={1000}
            height={1000}
            className="object-contain max-w-full max-h-full touch-manipulation"
          />
        </AnimatedView>
      );

    case "doc":
      return (
        <AnimatedView {...animatedStyle}>
          <Suspense fallback={<p>Loading document…</p>}><DocViewer
            documents={[{ uri: fileUrl }]}
            config={docViewerConfig}
          /></Suspense>
        </AnimatedView>
      );

    case "unsupported":
    default:
      return (
        <div className="flex items-center justify-center h-full flex-col p-4 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Unsupported File Type</h3>
          <p className="text-sm text-muted-foreground">
            Cannot display preview for this file type ({fileType}).
          </p>
          <Button className="mt-4" onClick={actions.download}>
            <Download className="h-4 w-4 mr-2" /> Download Anyway
          </Button>
        </div>
      );
  }
};

// --- Toolbar Component ---
const FileViewerToolbar: React.FC<FileViewerProps> = ({ state, actions }) => {
  const { fileType, pageNumber, numPages } = state;
  const isPDF = fileType === "pdf";
  const { zoomIn, zoomOut, resetView, rotate, prevPage, nextPage, download } =
    actions;

  return (
    <CardHeader className="p-3 border-b bg-muted/40">
      <div className="flex items-center gap-2">
        {/* View Controls */}
        <Button variant="ghost" size="icon" onClick={zoomIn} title="Zoom In">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={zoomOut} title="Zoom Out">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={resetView}
          title="Reset View (Pan/Zoom/Rotation)"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={rotate} title="Rotate 90°">
          <RotateCw className="h-4 w-4" />
        </Button>

        {/* Page Navigation (PDF only) */}
        {isPDF && (
          <Fragment>
            <Separator orientation="vertical" className="mx-2 h-6" />
            <Button
              variant="ghost"
              size="icon"
              onClick={prevPage}
              disabled={pageNumber <= 1}
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[70px] text-center">
              Page **{pageNumber}** / {numPages || "-"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextPage}
              disabled={pageNumber >= numPages}
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="mx-2 h-6" />
          </Fragment>
        )}

        {/* Download */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={download}
          title="Download File"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
};

// --- Main Component ---
const FileViewerClient = ({ fileUrl, filename }: FilesProps) => {
  const { state, actions } = useFileViewer(fileUrl, filename);
  const { containerRef } = state;

  return (
    <Card className="w-full border rounded-lg shadow-sm">
      {/* Toolbar */}
      <FileViewerToolbar state={state} actions={actions} />

      {/* Viewer Area */}
      <CardContent className="p-0">
        <div
          ref={containerRef}
          className="relative w-full h-[80vh] overflow-auto bg-muted touch-none"
        >
          <ViewerContent
            fileUrl={fileUrl}
            filename={filename}
            state={state}
            actions={actions}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export const DocumentViewer: FC<FilesProps> = ({ fileUrl, filename }) => {
  const { state, actions } = useFileViewer(fileUrl, filename);
  const { zoomIn, zoomOut, resetView, rotate, prevPage, nextPage, download } =
    actions;
  const { containerRef } = state;

  return (
    <div className="relative">
      <div
        className="aspect-[16/10] overflow-hidden rounded-md touch-none"
        ref={containerRef}
      >
        {/* <img
          src="/svg/placeholder.svg?height=300&width=500"
          alt="Professional License"
          width={500}
          height={300}
          className="h-full w-full object-cover"
        /> */}

        <ViewerContent
          fileUrl={fileUrl}
          filename={filename}
          state={state}
          actions={actions}
        />
      </div>

      {/* <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-2  h-8 w-8 rounded-full bg-white shadow-md"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Zoom</span>
      </Button> */}

      <div className="absolute bottom-2 right-2 flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={zoomIn}
          title="Zoom In"
          className="h-8 w-8 rounded-full bg-white shadow-md"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={zoomOut}
          title="Zoom Out"
          className="h-8 w-8 rounded-full bg-white shadow-md"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const PaginatedDocument = ({
  items,
  itemsPerPage = 3,
}: FileGalleryProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeItem = items[activeIndex];

  // 1. Pagination Logic for Thumbnails
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentThumbnails = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [currentPage, items, itemsPerPage]);

  // 2. Navigation for the Feature Preview
  const nextPreview = () => setActiveIndex((prev) => (prev + 1) % items.length);
  const prevPreview = () =>
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);

  // 3. Auto-jump pagination when active index changes via buttons
  useEffect(() => {
    const targetPage = Math.floor(activeIndex / itemsPerPage) + 1;
    setCurrentPage((page) => page === targetPage ? page : targetPage);
  }, [activeIndex, itemsPerPage]);

  if (!activeItem) return <p className="p-4 text-sm text-gray-500">No documents available.</p>;

  return (
    <Fragment>
      <DocumentViewer fileUrl={activeItem.url} filename={activeItem.title} />

      {items.length > 1 && (
        <div className="flex justify-center items-center my-4 gap-8">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={prevPreview}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <div className="flex gap-2 my-4">
            {currentThumbnails.map((item) => {
              const globalIndex = items.findIndex((i) => i.id === item.id);
              const isActive = activeIndex === globalIndex;

              return (
                <Button
                  variant="ghost"
                  className={cn(
                    "transition-all duration-200 overflow-hidden p-0 ",
                    isActive ? "bg-primary w-2 h-1" : "h-2 w-2 bg-secondary"
                  )}
                >
                  <span></span>
                </Button>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={nextPreview}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      )}

      {/* <div className="flex gap-2">
        {currentThumbnails.map((item) => {
          const globalIndex = items.findIndex((i) => i.id === item.id);
          const isActive = activeIndex === globalIndex;

          return (
     
            <Card
              key={item.id}
              className={`cursor-pointer transition-all duration-200 overflow-hidden ${
                isActive
                  ? "ring-4 ring-primary ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
              onClick={() => setActiveIndex(globalIndex)}
            >
              <CardContent className="p-0">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-24 object-cover"
                />
              </CardContent>
            </Card>
          );
        })}
      </div> */}

      {/* 
      {totalPages > 1 && (
        <div className="pt-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )} */}
    </Fragment>
  );
};

export default FileViewerClient;
