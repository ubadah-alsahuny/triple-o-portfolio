import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const exportToPDF = async (stageRef) => {
  if (!stageRef.current) return;

  const container = stageRef.current.content; // this is the DOM element inside <Stage>
  const canvasEl = container.parentElement; // get the full canvas container

  const screenshot = await html2canvas(canvasEl, {
    backgroundColor: "#ffffff",
    useCORS: true,
  });

  const imgData = screenshot.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [screenshot.width, screenshot.height],
  });

  pdf.addImage(imgData, "PNG", 0, 0, screenshot.width, screenshot.height);
  pdf.save("design.pdf");
};

export default exportToPDF;
