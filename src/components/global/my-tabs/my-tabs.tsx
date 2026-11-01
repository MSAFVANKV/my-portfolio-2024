
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import {  useEffect, useState } from "react";
import CommonCarouselWrapper from "../curosal-wrapper/CommonCarouselWrapper";

type Tab = {
  value: string; //* The value for the TabsTrigger*
  title: React.ReactNode; //* The title of the tab*
  url: string; //* The URL to navigate to on click*
  children?: React.ReactNode;
  onClick?: () => void;
};

type MyTabProps = {
  setTypeUrl?: (value: string) => void;
  tabs: Tab[];
  sideChildren?: React.ReactNode;
  children?: React.ReactNode;
  sideBtn?: React.ReactNode;
  bottomLabel?: React.ReactNode;
  bottomLabelClassName?: string;
  className?: string;
  classNameWrapper?: string;
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  tabContentClassName?: string;

  contentClassName?: string;
  sideClassName?: string;
  layoutClassName?: string;

  asCarousel?: boolean;
};

function MyPageTab({
  tabs,
  setTypeUrl,
  sideBtn,
  bottomLabel,
  bottomLabelClassName,
  // className,
  tabsListClassName,
  tabsTriggerClassName,
  classNameWrapper,
  asCarousel,
  sideChildren,
  contentClassName,
  layoutClassName,
  sideClassName,
  children,
  tabContentClassName,
}: MyTabProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const type = searchParams.get("type");

  // const handleTabClick = useCallback(
  //   (url: string, value: string) => {
  //     navigate(url);
  //     setActiveTab(value); //* Ensure active tab updates on click*
  //   },
  //   [navigate],
  // );

  useEffect(() => {
    const matchingTab = tabs.find((tab) => tab.value === type);
    if (matchingTab) {
      setActiveTab(matchingTab.value);
      setTypeUrl?.(matchingTab.value);
    } else if (tabs.length > 0) {
      setActiveTab(tabs[0].value);
      setTypeUrl?.(tabs[0].value);
    }
  }, [type, tabs, setTypeUrl]);

  //* Ensure activeTab is set before rendering tabs*
  if (!activeTab) return null;

  return (
    <Tabs
      onValueChange={(value) => {
        const tab = tabs.find((t) => t.value === value);

        if (!tab) return;

        //* run custom click logic if exists*
        //* If custom click exists, use it*
        if (tab.onClick) {
          tab.onClick();
        } else if (tab.url) {
          navigate(tab.url);
        }

        //* update state*
        setActiveTab(value);
      }}
      value={activeTab}
      className={cn("w-full", classNameWrapper)}
    >
      <div className="flex justify-between items-center">
        {asCarousel ? (
          <TabsList
            className={cn(
              `border bg-muted text-muted-foreground md:h-auto h-fit
       overflow-hidden items-center justify-normal
       rounded-full w-full py-1`,
              tabsListClassName,
            )}
          >
            <CommonCarouselWrapper contentClassName="">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    `data-[state=active]:bg-card data-[state=active]:border-muted
                 text-xs sm:min-w-36 min-w-[90px] font-bold
                 sm:py-3 py-2 whitespace-nowrap
                 data-[state=active]:text-card-foreground
                 data-[state=active]:rounded-full`,
                    tabsTriggerClassName,
                  )}
                >
                  {tab.title}
                </TabsTrigger>
              ))}
            </CommonCarouselWrapper>
          </TabsList>
        ) : (
          <TabsList
            className={cn(
              `border bg-muted text-muted-foreground md:h-auto h-fit
             overflow-auto items-center  justify-normal
              overflow-x-auto overflow-y-hidden rounded-full w-fit py-1`,
              tabsListClassName,
            )}
            //*          className='*
            //*    border bg-muted text-muted-foreground*
            //*    flex-nowrap flex*
            //*    overflow-x-auto overflow-y-hidden*
            //*    whitespace-nowrap*
            //*    rounded-full*
            //*    w-full*
            //*    py-1*
            //*    scrollbar-thin*
            //*  '*
          >
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                //* data-state={activeTab === tab.value ? "active" : "inactive"}*
                //* className="data-[state=active]:bg-bg text-xs min-w-36 font-bold w-auto py-3 data-[state=active]:text-white data-[state=active]:rounded-full"*
                className={cn(
                  `data-[state=active]:bg-card data-[state=active]:border-muted
                text-xs sm:min-w-36 min-w-[90px] font-bold w-auto sm:py-3 py-2 max-sm:px-
                 data-[state=active]:text-card-foreground data-[state=active]:rounded-full`,
                  tabsTriggerClassName,
                )}
                //* onClick={() => {*
                //*   if (tab?.onClick) {*
                //*     tab?.onClick();*
                //*   }*
                //*   handleTabClick(tab.url, tab.value);*
                //* }}*
              >
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
        )}
        {sideBtn}
      </div>

      {bottomLabel && (
        <div className={cn("", bottomLabelClassName)}>{bottomLabel}</div>
      )}
      {/** Show only the active tab's content */}
      <div className={cn("flex items-start w-full gap-4", layoutClassName)}>
        <div className={cn("flex-1", contentClassName)}>
          {tabs.map(
            (tab) =>
              tab.value === activeTab && (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className={cn("w-full", tabContentClassName)}
                >
                  {tab.children}
                  {children}
                </TabsContent>
              ),
          )}
        </div>

        {sideChildren && (
          <div className={cn("", sideClassName)}>{sideChildren}</div>
        )}
      </div>
    </Tabs>
  );
}

export default MyPageTab;
