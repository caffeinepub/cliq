import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
}

export function FloatingActionButton({
  onClick,
  icon,
}: FloatingActionButtonProps) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current + 8) {
        setVisible(false);
      } else if (currentY < lastScrollY.current - 8) {
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid="fab.primary_button"
      aria-label="Create new post"
      style={{ backgroundColor: "#2C8A7A" }}
      className={[
        "fixed z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg text-white",
        "bottom-24 right-4 md:bottom-8 md:right-8",
        "transition-all duration-300 ease-in-out",
        "hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2C8A7A]/40",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-16 opacity-0 pointer-events-none",
      ].join(" ")}
    >
      {icon ?? <Plus className="h-7 w-7 stroke-[2.5]" />}
    </button>
  );
}
