import React, { useRef } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import SparklesIcon from './icons/SparklesIcon';
import DownloadIcon from './icons/DownloadIcon';
import ClearIcon from './icons/ClearIcon';

interface AdPreviewProps {
    uploadedFile: File | null;
    uploadedFilePreview: string | null;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClearImage: () => void;
    generatedImage: string | null;
    isLoading: boolean;
    error: string | null;
    onGenerateClick: () => void;
}

const AdPreview: React.FC<AdPreviewProps> = ({
    uploadedFile, uploadedFilePreview, onImageUpload, onClearImage,
    generatedImage, isLoading, error, onGenerateClick
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDownloadImage = () => {
        if (!generatedImage) return;
        const a = document.createElement('a');
a.href = generatedImage;
        const fileName = uploadedFile?.name.split('.')[0] || 'ad';
        a.download = `ai_${fileName}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="space-y-4 sticky top-6">
            <Card>
                 <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="imageUpload" className="block text-sm font-medium text-slate-400">Upload Product Photo</label>
                    {uploadedFile && (
                        <button onClick={onClearImage} className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors duration-200">
                           <ClearIcon /> Clear
                        </button>
                    )}
                </div>
                <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onImageUpload}
                    ref={fileInputRef}
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-center bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm hover:bg-white/10 hover:border-slate-400 transition-colors duration-200 truncate"
                >
                    {uploadedFile ? uploadedFile.name : 'Choose a file...'}
                </button>
                <div className="mt-2.5 w-full min-h-[150px] rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden relative border border-dashed border-white/10">
                    {uploadedFilePreview ? (
                        <img src={uploadedFilePreview} alt="Product preview" className="w-full h-full object-contain" />
                    ) : (
                        <div className="text-sm text-slate-500">No image uploaded</div>
                    )}
                </div>
            </Card>

            <Card>
                <div className="flex items-center mb-2">
                    <label className="block text-sm font-medium text-slate-400">Generated Output</label>
                </div>
                <div className="w-full min-h-[250px] rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden relative border border-dashed border-white/10">
                   {error ? (
                        <div className="text-sm text-rose-500 text-center p-4">{error}</div>
                    ) : generatedImage || uploadedFilePreview ? (
                        <img src={generatedImage || uploadedFilePreview || ''} alt="Generated ad" className={`w-full h-full object-contain transition-all duration-300 ${isLoading ? 'blur-sm brightness-75' : ''}`} />
                    ) : (
                        <div className="text-sm text-slate-500">Output will appear here</div>
                    )}
                     {isLoading && (
                         <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50">
                             <div className="w-10 h-10 border-4 border-slate-700 border-t-cyan-400 rounded-full animate-spin"></div>
                             <span className="text-sm text-slate-300 font-medium">Generating...</span>
                         </div>
                    )}
                </div>
                <div className="mt-2.5 flex flex-col gap-2">
                    <Button onClick={onGenerateClick} disabled={isLoading || !uploadedFile}>
                        <SparklesIcon />
                        <span>{isLoading ? 'Generating...' : 'Generate Ad Image'}</span>
                    </Button>
                    {generatedImage && !isLoading && (
                        <Button variant="secondary" onClick={handleDownloadImage}>
                            <DownloadIcon />
                            <span>Download Image</span>
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AdPreview;
