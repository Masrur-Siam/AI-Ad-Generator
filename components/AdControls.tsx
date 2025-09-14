import React, { useRef } from 'react';
import Card from './ui/Card';
import { Category, Language, Template, Ratio } from '../types';
import Button from './ui/Button';
import CopyIcon from './icons/CopyIcon';
import DownloadIcon from './icons/DownloadIcon';
import ResetIcon from './icons/ResetIcon';
import ClearIcon from './icons/ClearIcon';

interface AdControlsProps {
    categories: Category[];
    selectedCategory: Category;
    onCategoryChange: (category: Category) => void;
    selectedLang: Language;
    onLangChange: (lang: Language) => void;
    templates: Template[];
    selectedTemplateId: number;
    onTemplateSelect: (id: number) => void;
    ratios: Ratio[];
    selectedRatioId: string;
    onRatioSelect: (id: string) => void;
    productName: string;
    onProductNameChange: (value: string) => void;
    brandName: string;
    onBrandNameChange: (value: string) => void;
    price: string;
    onPriceChange: (value: string) => void;
    discount: string;
    onDiscountChange: (value: string) => void;
    basePromptText: string;
    editablePrompt: string;
    onEditablePromptChange: (value: string) => void;
    showToast: (message: string, isError?: boolean) => void;
    logoFile: File | null;
    logoFilePreview: string | null;
    onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClearLogo: () => void;
}

const AdControls: React.FC<AdControlsProps> = ({
    categories, selectedCategory, onCategoryChange,
    selectedLang, onLangChange,
    templates, selectedTemplateId, onTemplateSelect,
    ratios, selectedRatioId, onRatioSelect,
    productName, onProductNameChange,
    brandName, onBrandNameChange,
    price, onPriceChange,
    discount, onDiscountChange,
    basePromptText, editablePrompt, onEditablePromptChange, showToast,
    logoFile, logoFilePreview, onLogoUpload, onClearLogo
}) => {
    const logoInputRef = useRef<HTMLInputElement>(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(editablePrompt).then(() => {
            showToast('Prompt copied to clipboard!');
        }).catch(err => {
            showToast('Failed to copy prompt.', true);
            console.error('Could not copy text: ', err);
        });
    };
    
    const handleDownload = () => {
        const blob = new Blob([editablePrompt], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'prompt.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    const handleResetPrompt = () => {
        onEditablePromptChange(basePromptText);
        showToast('Prompt has been reset to the template.');
    };

    return (
        <Card>
            <div className="flex flex-col space-y-4">
                <div className="flex gap-3">
                    <div className="flex-1">
                        <label htmlFor="categorySelect" className="block text-sm font-medium text-slate-400 mb-1.5">Category</label>
                        <select id="categorySelect" value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400">
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="w-40">
                        <label htmlFor="langSelect" className="block text-sm font-medium text-slate-400 mb-1.5">Language</label>
                        <select id="langSelect" value={selectedLang} onChange={(e) => onLangChange(e.target.value as Language)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400">
                            <option value="en">English</option>
                            <option value="bn">Bangla</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Prompt Template</label>
                        <div className="max-h-56 overflow-auto pr-1.5 space-y-2">
                            {templates.map((t) => (
                                <div key={t.id} onClick={() => onTemplateSelect(t.id)} className={`p-2.5 rounded-lg cursor-pointer transition-all duration-200 ${selectedTemplateId === t.id ? 'border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/5' : 'bg-white/5 hover:bg-white/10 border border-transparent'}`}>
                                    <strong className="font-medium text-slate-200">Template {t.id}</strong>
                                    <p className="text-xs text-slate-400 mt-1">{t[selectedLang]}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-36">
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Ratio (visual guide)</label>
                        <div className="flex flex-wrap gap-2">
                            {ratios.map(r => (
                                <button key={r.id} onClick={() => onRatioSelect(r.id)} className={`px-2.5 py-2 rounded-lg text-sm transition-all duration-200 border ${selectedRatioId === r.id ? 'bg-gradient-to-r from-green-800 to-blue-900 border-cyan-500/20' : 'bg-white/5 hover:bg-white/10 border-transparent'}`}>
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="productName" className="block text-sm font-medium text-slate-400 mb-1.5">Product Name</label>
                        <input id="productName" type="text" value={productName} onChange={e => onProductNameChange(e.target.value)} placeholder="e.g. Classic Leather Wallet" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400" />
                    </div>
                    <div className="w-36">
                        <label htmlFor="price" className="block text-sm font-medium text-slate-400 mb-1.5">Price (optional)</label>
                        <input id="price" type="text" value={price} onChange={e => onPriceChange(e.target.value)} placeholder="৳1200 or $29" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400" />
                    </div>
                </div>

                <div className="flex gap-3 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="brandName" className="block text-sm font-medium text-slate-400 mb-1.5">Brand Name (optional)</label>
                        <input id="brandName" type="text" value={brandName} onChange={e => onBrandNameChange(e.target.value)} placeholder="e.g. Artisan Co." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400" />
                    </div>
                    <div className="w-36">
                        <label htmlFor="discount" className="block text-sm font-medium text-slate-400 mb-1.5">Discount</label>
                        <input id="discount" type="text" value={discount} onChange={e => onDiscountChange(e.target.value)} placeholder="e.g. 20% OFF" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400" />
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Brand Logo (optional)</label>
                    <div className="flex items-center gap-3">
                        <input
                            id="logoUpload"
                            type="file"
                            accept="image/png, image/jpeg, image/webp, image/svg+xml"
                            className="hidden"
                            onChange={onLogoUpload}
                            ref={logoInputRef}
                        />
                         <button
                            onClick={() => logoInputRef.current?.click()}
                            className="flex-1 text-left bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm hover:bg-white/10 transition-colors duration-200 truncate text-slate-300"
                            aria-label="Upload brand logo"
                        >
                            {logoFile ? logoFile.name : 'Choose a logo file...'}
                        </button>
                        {logoFilePreview && (
                            <>
                                <div className="w-10 h-10 rounded-md bg-slate-900 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                    <img src={logoFilePreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                                </div>
                                <button onClick={onClearLogo} className="p-2 bg-slate-700 hover:bg-rose-500/50 rounded-full text-slate-400 hover:text-rose-300 transition-colors duration-200" aria-label="Clear logo">
                                    <ClearIcon />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="promptPreview" className="block text-sm font-medium text-slate-400 mb-1.5">Editable Prompt</label>
                    <textarea id="promptPreview" value={editablePrompt} onChange={(e) => onEditablePromptChange(e.target.value)} className="w-full min-h-[120px] resize-y bg-slate-900 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"></textarea>
                </div>
                
                <div className="flex gap-2">
                     <Button variant="secondary" size="small" onClick={handleCopy}>
                        <CopyIcon />
                        <span>Copy</span>
                    </Button>
                    <Button variant="secondary" size="small" onClick={handleDownload}>
                        <DownloadIcon />
                        <span>Download</span>
                    </Button>
                     <Button variant="secondary" size="small" onClick={handleResetPrompt} className="ml-auto">
                        <ResetIcon />
                        <span>Reset to Template</span>
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default AdControls;
