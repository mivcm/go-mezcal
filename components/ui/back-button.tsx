import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  href?: string;
  text?: string;
  className?: string;
}

export function BackButton({ 
  href = "/dashboard", 
  text = "Volver al Dashboard",
  className = ""
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  return (
    <div className={`mb-6 ${className}`}>
      <Button
        variant="ghost"
        onClick={handleClick}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {text}
      </Button>
    </div>
  );
} 