import pptxgen from 'pptxgenjs';
import { z } from 'zod';

const SlideContent = z.object({
  title: z.string(),
  content: z.array(z.string()),
});

const PresentationStructure = z.object({
  title: z.string(),
  slides: z.array(SlideContent),
});

type PresentationData = z.infer<typeof PresentationStructure>;

export async function generatePowerPoint(userPrompt: string) {
  try {
    const response = await fetch('/api/generate-presentation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: userPrompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate presentation data');
    }

    const presentationData: PresentationData = await response.json();

    // Create PowerPoint using pptxgenjs
    const pptx = new pptxgen();

    // Title slide
    let slide = pptx.addSlide();
    slide.addText(presentationData.title, { x: 1, y: 1, w: '80%', h: 1, fontSize: 44, color: '363636', bold: true });

    // Content slides
    presentationData.slides.forEach((slideData, index) => {
      slide = pptx.addSlide();
      
      // Add title
      slide.addText(slideData.title, { x: 0.5, y: 0.5, w: '90%', fontSize: 24, color: '363636', bold: true });
      
      // Add content
      slideData.content.forEach((contentItem, contentIndex) => {
        slide.addText(contentItem, { x: 0.5, y: 1.5 + contentIndex * 0.8, w: '90%', h: 0.7, fontSize: 14, color: '363636', breakLine: true });
      });
      
      // Add slide number
      slide.addText(`Slide ${index + 1}`, { x: 11, y: 7, w: 1, h: 0.3, fontSize: 10, color: '363636', align: 'right' });
    });

    // Save the presentation
    await pptx.writeFile({ fileName: "generated_presentation.pptx" });
  } catch (error) {
    console.error('Error generating PowerPoint:', error);
    throw error;
  }
}