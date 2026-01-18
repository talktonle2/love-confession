import { useState, useEffect } from 'react';

export default function ResponsiveGrid({ 
  children, 
  cols = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
  gap = 4,
  className = "" 
}) {
  const [currentCols, setCurrentCols] = useState(cols.md);

  useEffect(() => {
    const updateCols = () => {
      const width = window.innerWidth;
      if (width < 640) setCurrentCols(cols.xs);
      else if (width < 768) setCurrentCols(cols.sm);
      else if (width < 1024) setCurrentCols(cols.md);
      else if (width < 1280) setCurrentCols(cols.lg);
      else setCurrentCols(cols.xl);
    };

    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, [cols]);

  const gapClass = `gap-${gap}`;
  const gridClass = `grid grid-cols-${currentCols} ${gapClass} ${className}`;

  return (
    <div className={gridClass}>
      {children}
    </div>
  );
}
