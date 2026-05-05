// src/components/Icons.tsx – Plain black outline SVG icon set

type SvgProps = React.SVGProps<SVGSVGElement> & { className?: string };

const base = "w-8 h-8";

export function IconKitchenEquipment({ className = base, ...p }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} {...p}>
      <rect x="2" y="8" width="20" height="13" rx="2" />
      <path d="M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2" />
      <circle cx="8.5" cy="14.5" r="2" />
      <circle cx="15.5" cy="14.5" r="2" />
      <path d="M12 4v4" />
    </svg>
  );
}

export function IconDisposables({ className = base, ...p }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} {...p}>
      <path d="M5 3h14l-1.5 13.5A2 2 0 0 1 15.5 18h-7a2 2 0 0 1-2-1.5L5 3z" />
      <path d="M3 3h18" />
      <path d="M9 18v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2" />
    </svg>
  );
}

export function IconSmallwares({ className = base, ...p }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} {...p}>
      <path d="M6 3 L6 15 Q6 18 9 18 Q12 18 12 15 L12 9" />
      <path d="M6 9 L12 9" />
      <path d="M15 3 L15 21" />
      <path d="M18 3 Q21 5 21 8 Q21 11 18 12 L15 12" />
    </svg>
  );
}

export function IconRefrigeration({ className = base, ...p }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} {...p}>
      <path d="M12 2v20M2 12h20" />
      <path d="M12 2 L9 5 M12 2 L15 5" />
      <path d="M12 22 L9 19 M12 22 L15 19" />
      <path d="M2 12 L5 9 M2 12 L5 15" />
      <path d="M22 12 L19 9 M22 12 L19 15" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function IconCleaningSupplies({ className = base, ...p }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} {...p}>
      <path d="M9 3 L9 10 Q9 12 11 13 L11 20 Q11 21 12 21 Q13 21 13 20 L13 13 Q15 12 15 10 L15 8" />
      <path d="M9 8 L15 8" />
      <path d="M14 3 L17 3 L17 7 Q17 9 15 9" />
      <path d="M6 21 L18 21" />
    </svg>
  );
}

export function IconFoodStorage({ className = base, ...p }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} {...p}>
      <path d="M3 9 L3 20 Q3 21 4 21 L20 21 Q21 21 21 20 L21 9" />
      <path d="M2 5 Q2 3 4 3 L20 3 Q22 3 22 5 L22 9 Q22 10 21 10 L3 10 Q2 10 2 9 Z" />
      <path d="M9 3 L9 10" />
      <path d="M15 3 L15 10" />
      <path d="M9 15 L15 15" />
    </svg>
  );
}

export function IconBeverages({ className = base, ...p }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} {...p}>
      <path d="M6 2 L7 17 Q7 19 9 19 L15 19 Q17 19 17 17 L18 2 Z" />
      <path d="M6 2 L18 2" />
      <path d="M18 7 L20 7 Q22 7 22 9 Q22 11 20 11 L18 11" />
      <path d="M9 21 L15 21" />
      <path d="M11 19 L11 21 M13 19 L13 21" />
    </svg>
  );
}

export function IconBakery({ className = base, ...p }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} {...p}>
      <path d="M4 12 Q4 6 12 6 Q20 6 20 12 L19 19 Q19 20 18 20 L6 20 Q5 20 5 19 Z" />
      <path d="M8 6 Q7 2 12 2 Q17 2 16 6" />
      <path d="M8 13 Q10 11 12 13 Q14 15 16 13" />
    </svg>
  );
}

export function IconBox({ className = base, ...p }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} {...p}>
      <path d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0l-8 4-8-4" />
    </svg>
  );
}

export function IconPriceTag({ className = base, ...p }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} {...p}>
      <path d="M12 2 L20 2 L22 4 L22 12 L13 21 Q12 22 11 21 L3 13 Q2 12 3 11 Z" />
      <circle cx="17" cy="7" r="1.5" />
    </svg>
  );
}

export function IconTruck({ className = base, ...p }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} {...p}>
      <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

export function IconNetwork({ className = base, ...p }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} {...p}>
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="M12 7 L12 12 M12 12 L5 17 M12 12 L19 17" />
    </svg>
  );
}

// Map from category slug to icon component
export function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  const props = { className: className ?? "w-8 h-8" };
  switch (slug) {
    case "kitchen-equipment": return <IconKitchenEquipment {...props} />;
    case "disposables":       return <IconDisposables {...props} />;
    case "smallwares":        return <IconSmallwares {...props} />;
    case "refrigeration":     return <IconRefrigeration {...props} />;
    case "cleaning-supplies": return <IconCleaningSupplies {...props} />;
    case "food-storage":      return <IconFoodStorage {...props} />;
    case "beverages":         return <IconBeverages {...props} />;
    case "bakery":            return <IconBakery {...props} />;
    default:                  return <IconBox {...props} />;
  }
}
