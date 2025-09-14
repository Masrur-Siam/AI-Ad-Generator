import { GoogleGenAI, Modality } from "@google/genai";

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
    };
    reader.onerror = error => reject(error);
});

export const generateAdImage = async (
    prompt: string,
    imageFile: File,
    logoFile: File | null
): Promise<string> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API key is not configured. Please set the API_KEY environment variable.");
    }
    const ai = new GoogleGenAI({ apiKey });

    try {
        const base64ImageData = await toBase64(imageFile);
        let finalPrompt = prompt;
        
        const parts: any[] = [
            { inlineData: { data: base64ImageData, mimeType: imageFile.type } }
        ];

        if (logoFile) {
            const base64LogoData = await toBase64(logoFile);
            parts.push({
                inlineData: { data: base64LogoData, mimeType: logoFile.type }
            });
            finalPrompt += "\n\nInstructions for AI: The first image is the main product. The second image is the brand's logo. Please seamlessly integrate the logo into the generated advertisement scene.";
        }

        parts.unshift({ text: finalPrompt });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

        if (imagePart?.inlineData?.data) {
            return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        }
        
        const blockReason = response.promptFeedback?.blockReason;
        if (blockReason) {
             throw new Error(`Image generation blocked: ${blockReason}. Please adjust your prompt.`);
        }

        const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
        if(textPart?.text){
            throw new Error(`Model returned text instead of an image: "${textPart.text}"`);
        }
        
        throw new Error('No image data found in the API response.');

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during image generation.");
    }
};
