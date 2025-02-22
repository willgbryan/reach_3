import { toast } from "sonner";

export async function generatePowerPoint(userPrompt: string, filePath: string, favoriteTheme: string, signedUrl: string) {
  console.log('generatePowerPoint function called with prompt:', userPrompt, 'and file path:', filePath);
  try {
    console.log('Sending request to generate PowerPoint...');
    console.log('Signed URL before sending request:', signedUrl);

    const response = await fetch('/api/generate-presentation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: userPrompt, filePath, favoriteTheme, signedUrl }),
    });
    console.log('Received response from server. Status:', response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from server:', errorData);
      toast.error("Error creating presentation", {
        description: "We're experiencing trouble on our end. Please try again in a moment.",
      });
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'generated_presentation.pptx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    console.log('PowerPoint file downloaded successfully');
  } catch (error) {
    console.error('Error generating PowerPoint:', error);
    toast.error("Error creating presentation", {
      description: "We're experiencing trouble on our end. Please try again in a moment.",
    });
    throw error;
  }
}