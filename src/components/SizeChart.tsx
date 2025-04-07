
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';

interface SizeChartProps {
  category: string;
}

const SizeChart: React.FC<SizeChartProps> = ({ category }) => {
  const isMobile = useIsMobile();
  
  const sizeChartData = {
    men: {
      title: "Men's Size Chart",
      headers: ["Size", "Chest (in)", "Waist (in)", "Shoulder (in)", "Sleeve (in)"],
      sizes: [
        { size: "S", chest: "36-38", waist: "30-32", shoulder: "17.5", sleeve: "33" },
        { size: "M", chest: "39-41", waist: "33-35", shoulder: "18", sleeve: "34" },
        { size: "L", chest: "42-44", waist: "36-38", shoulder: "18.5", sleeve: "35" },
        { size: "XL", chest: "45-47", waist: "39-41", shoulder: "19", sleeve: "36" },
      ]
    },
    women: {
      title: "Women's Size Chart",
      headers: ["Size", "Bust (in)", "Waist (in)", "Hip (in)", "Shoulder (in)"],
      sizes: [
        { size: "XS", bust: "32-33", waist: "25-26", hip: "35-36", shoulder: "15" },
        { size: "S", bust: "34-35", waist: "27-28", hip: "37-38", shoulder: "15.5" },
        { size: "M", bust: "36-37", waist: "29-30", hip: "39-40", shoulder: "16" },
        { size: "L", bust: "38-40", waist: "31-33", hip: "41-43", shoulder: "16.5" },
      ]
    }
  };
  
  const chartData = category === 'women' ? sizeChartData.women : sizeChartData.men;
  
  const chartContent = (
    <div className="p-4">
      <Table className="border border-gray-200">
        <TableHeader>
          <TableRow className="bg-gray-50">
            {chartData.headers.map((header, index) => (
              <TableHead key={index} className={index === 0 ? "w-[80px]" : "text-center"}>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {chartData.sizes.map((row, rowIndex) => (
            <TableRow key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <TableCell className="font-bold text-cugini-dark">{row.size}</TableCell>
              <TableCell className="text-center">{category === 'women' ? row.bust : row.chest}</TableCell>
              <TableCell className="text-center">{row.waist}</TableCell>
              <TableCell className="text-center">{category === 'women' ? row.hip : row.shoulder}</TableCell>
              <TableCell className="text-center">{category === 'women' ? row.shoulder : row.sleeve}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-6 text-sm text-gray-600">
        <h4 className="font-medium text-cugini-dark mb-2">How to Measure:</h4>
        {category === 'women' ? (
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="font-medium">Bust:</span> Measure at the fullest part of your bust, with arms relaxed at sides.</li>
            <li><span className="font-medium">Waist:</span> Measure at the narrowest part of your natural waist.</li>
            <li><span className="font-medium">Hip:</span> Measure at the fullest part of your hips, approximately 8" below natural waist.</li>
            <li><span className="font-medium">Shoulder:</span> Measure from shoulder seam to shoulder seam across the back.</li>
          </ul>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="font-medium">Chest:</span> Measure at the fullest part of your chest, keeping tape horizontal.</li>
            <li><span className="font-medium">Waist:</span> Measure around your natural waistline, at the narrowest part.</li>
            <li><span className="font-medium">Shoulder:</span> Measure from shoulder seam to shoulder seam across the back.</li>
            <li><span className="font-medium">Sleeve:</span> Measure from shoulder seam to wrist with arm slightly bent.</li>
          </ul>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger className="text-sm underline hover:text-cugini-golden">Size Guide</SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl font-serif">{chartData.title}</SheetTitle>
          </SheetHeader>
          {chartContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog>
      <DialogTrigger className="text-sm underline hover:text-cugini-golden">Size Guide</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-serif">{chartData.title}</DialogTitle>
        </DialogHeader>
        {chartContent}
      </DialogContent>
    </Dialog>
  );
};

export default SizeChart;
