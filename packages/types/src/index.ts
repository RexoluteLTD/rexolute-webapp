import type {
  ComponentType,
  Dispatch,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  SetStateAction,
} from "react";

export * from "./app";
export * from "./user";

export type QueryReturnValue<T = unknown, E = unknown, M = unknown> =
  | {
      error: E;
      data?: undefined;
      meta?: M;
    }
  | {
      error?: undefined;
      data: T;
      meta?: M;
    };

export type GenericObject = { [key: string]: any };

export type errorRTK = { data: { detail: string }; status: number };
export interface LayoutProp extends ComponentProps {}

export type LayoutContextProp = {
  isSearchModal: boolean;
  setIsSearchModal: Dispatch<SetStateAction<boolean>>;
  referrer?: string;
  setReferrer: Dispatch<SetStateAction<string | undefined>>;
};

export interface ComponentProps extends PropsWithChildren {
  className?: string;
}

export interface ListResponse<T> {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: T[];
}

export type FilterOption = { id: string; label?: string; options: any[] };

export type LinkProps = { path: string; label: string };

export type DataProp = {
  content: string;
  slug: string;
};

export type PlatformOS = "Android" | "iOS" | "Linux" | "MacOS" | "Windows";

export type SiteMode = "isLive" | "isComingSoon" | "isMaintenance";

export type TabItem = { active: boolean; id: string; label: string };

export type MenuLink = LinkProps & {
  icon?: ReactElement;
  children?: MenuLink[];
};

export type Error = { detail: string; message?: string };

export interface LayoutProps {
  children: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  className?: string;
}

export type MenuProps = {
  name: string;
  path: string;
  icon: any;
};

export type Role = "admin" | "anonymous" | "client" | "therapist" | "unknown";

export type DetailsMode = "approve" | "default" | "reassign" | "rescheduled ";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
export type AuthToken = {
  accessToken: string;
  refreshToken: string;
};

export interface PageProps {
  query: any;
  slug: string;
  title: string;
}

export type FileType = "pdf" | "image" | "doc" | "unsupported";

export type ResponseList = {
  currentPage: number;
  items: any[];
  totalCount: number;
  totalPages: number;
};
