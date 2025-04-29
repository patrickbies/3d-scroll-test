import { ChevronDown } from "lucide-react";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

type NavbarContextType = {
  activeDropdown: string | null;
  position: DOMRect | null;
  setActiveDropdown: (id: string | null) => void;
  setPosition: (rect: DOMRect | null) => void;
  registerContent: (
    id: string,
    content: React.ReactNode,
    width: number,
    height: number
  ) => void;
  unregisterContent: (id: string) => void;
  startCloseTimer: () => void;
  cancelCloseTimer: () => void;
};

const NavbarContext = createContext<NavbarContextType | null>(null);

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context)
    throw new Error(
      "Navbar compound components must be wrapped in <Navbar.Container>"
    );
  return context;
};

type ContainerContent = {
  content: React.ReactNode;
  width: number;
  height: number;
};

const Container = ({ children }: { children: React.ReactNode }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [position, setPosition] = useState<DOMRect | null>(null);
  const [dropdownContent, setDropdownContent] = useState<
    Record<string, ContainerContent>
  >({});
  const closeTimeoutRef = useRef<number | null>(null);
  const delay = 100; // delay to close dropdown after mouse exit

  const containerRef = useRef<HTMLDivElement>(null);

  const registerContent = useCallback(
    (id: string, content: React.ReactNode, width: number, height: number) => {
      setDropdownContent((prev) => ({
        ...prev,
        [id]: { content, width, height },
      }));
    },
    []
  );

  const unregisterContent = useCallback((id: string) => {
    setDropdownContent((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  }, []);

  const startCloseTimer = useCallback(() => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = window.setTimeout(() => {
      setActiveDropdown(null);
    }, delay);
  }, [delay]);

  const cancelCloseTimer = useCallback(() => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  return (
    <NavbarContext.Provider
      value={{
        activeDropdown,
        position,
        setActiveDropdown,
        setPosition,
        registerContent,
        unregisterContent,
        startCloseTimer,
        cancelCloseTimer,
      }}
    >
      <nav className="flex items-center space-x-4 p-1 px-3 m-1 backdrop-blur-xl bg-background/30 border rounded-xl border-border justify-center overflow-x-hidden">
        {children}
      </nav>

      <div
        ref={containerRef}
        className={`absolute overflow-x-hidden bg-background border border-border rounded-lg shadow-lg p-4 transform transition-all duration-300 ${
          activeDropdown ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          left: Math.max(Math.min(
            position
              ? position.left +
                  position.width / 2 -
                  (activeDropdown
                    ? dropdownContent[activeDropdown].width / 2
                    : 0)
              : window.innerWidth / 2,
            window.innerWidth -
              (activeDropdown ? dropdownContent[activeDropdown].width : 0) -
              5
          ), 0),
          top: (position?.bottom || window.innerHeight * 0.1) + 6,
          width: `${
            activeDropdown ? dropdownContent[activeDropdown].width : 0
          }px`,
          height: `${
            activeDropdown ? dropdownContent[activeDropdown].height : 0
          }px`,
        }}
        onMouseEnter={cancelCloseTimer}
        onMouseLeave={startCloseTimer}
      >
        {activeDropdown && dropdownContent[activeDropdown].content}
      </div>
    </NavbarContext.Provider>
  );
};

const Item = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative">{children}</div>;
};

const Link = ({ children }: { children: React.ReactNode }) => {
  return (
    <a
      href="#"
      className="text-foreground/80 hover:bg-foreground/10 transition-all rounded-lg px-4 py-2"
    >
      {children}
    </a>
  );
};

const DropdownTrigger = ({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) => {
  const {
    activeDropdown,
    setActiveDropdown,
    setPosition,
    startCloseTimer,
    cancelCloseTimer,
  } = useNavbar();
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    cancelCloseTimer();
    if (ref.current) {
      setActiveDropdown(id);
      const rect = ref.current.getBoundingClientRect();
      setPosition(rect);
    }
  };

  return (
    <div
      ref={ref}
      className="cursor-pointer text-foreground/80 hover:bg-foreground/10 transition-all rounded-lg px-4 py-2 flex flex-row items-center gap-[5px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={startCloseTimer}
    >
      {children}
      <ChevronDown
        size={14}
        className={`text-white mt-1 transition-all duration-300 ${
          activeDropdown === id && "scale-y-[-1]"
        }`}
      />
    </div>
  );
};

const DropdownContent = ({
  id,
  children,
  width,
  height,
}: {
  id: string;
  children: React.ReactNode;
  width: number;
  height: number;
}) => {
  const { registerContent, unregisterContent } = useNavbar();

  useEffect(() => {
    registerContent(id, children, width, height);
    return () => unregisterContent(id);
  }, [id, children, width, height, registerContent, unregisterContent]);

  return null;
};

const Navbar = {
  Container,
  Item,
  Link,
  DropdownTrigger,
  DropdownContent,
};

export default Navbar;
