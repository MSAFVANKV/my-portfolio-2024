"use client";

import React, { useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Crumb = {
  label: string;
  href?: string;
  segment?: string;
};

type Props = {
  labelMap?: Record<string, string>;
  customCrumbs?: Crumb[];
  asHistory?: boolean;
  historySegment?: string;
};

export default function DynamicBreadcrumb({
  labelMap = {},
  customCrumbs,
  asHistory = false,
  historySegment,
}: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const crumbs = useMemo(() => {
    if (customCrumbs) return customCrumbs;

    const segments = pathname.split("/").filter(Boolean);
    let href = "";

    return segments.map((segment, index) => {
      href += `/${segment}`;

      return {
        segment,
        label:
          labelMap[segment] ??
          segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        href: index === segments.length - 1 ? undefined : href,
      };
    });
  }, [customCrumbs, labelMap, pathname]);

  const crumbsWithHome = useMemo(() => {
    if (pathname === "/") {
      return crumbs;
    }

    const firstCrumbLabel = crumbs[0]?.label?.trim().toLowerCase();
    if (firstCrumbLabel === "home") {
      return crumbs;
    }

    return [{ label: "Home", href: "/" }, ...crumbs];
  }, [crumbs, pathname]);

  const handleHistoryBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbsWithHome.map((crumb, index) => {
          const isLast = index === crumbsWithHome.length - 1;

          const useHistory =
            !isLast &&
            (asHistory || (historySegment && crumb.segment === historySegment));

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-medium flex items-center sm:text-xs text-xs text-blue-600">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : useHistory ? (
                  <button
                    type="button"
                    onClick={handleHistoryBack}
                    className="sm:text-xs text-xs text-primary font-medium  hover:underline"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <BreadcrumbLink
                    className="sm:text-xs text-xs text-primary font-medium  hover:underline"
                    asChild
                  >
                    <Link to={crumb.href!}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
