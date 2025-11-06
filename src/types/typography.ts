export type FontSize = "xxs" | "xs" | "sm" | "base" | "md" | "lg" | "xl" | "2xl" | "3xl" | "5xl";
export type Variant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | "code";
export type Weight = "bold" | "semi-bold" | "regular" | "light" | "extra-bold" | "black" | "medium";

export type TypographyProps = {
  font?: FontSize;
  variant: Variant;
  weight: Weight;
};
