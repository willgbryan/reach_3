import { saveAs } from 'file-saver';

export async function generatePowerPoint(userPrompt: string) {
  try {
    console.log('Generating PowerPoint presentation...');

    const response = await fetch('/api/generate-presentation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: userPrompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('PowerPoint generated successfully:', result);

    // Download the file
    const fileResponse = await fetch(result.file_path);
    if (!fileResponse.ok) {
      throw new Error(`Failed to download file: ${fileResponse.status}`);
    }
    const blob = await fileResponse.blob();
    saveAs(blob, 'generated_presentation.pptx');

  } catch (error) {
    console.error('Error generating PowerPoint:', error);
    throw error;
  }
}