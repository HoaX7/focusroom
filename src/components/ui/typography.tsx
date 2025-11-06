import { Outlet } from "@tanstack/react-router";
import type React from "react";
import { cn } from "@/lib/utils";
import type { TypographyProps } from "@/types/typography";

interface Props extends TypographyProps {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLHeadingElement | HTMLDivElement | HTMLParagraphElement | HTMLSpanElement>;
}

export default function Typography({ variant, className, onClick }: Props) {
  const Container = variant;
  return (
    <Container className={cn(className, "text-lg md:text-xl")} onClick={onClick}>
      <Outlet />
    </Container>
  );
}
