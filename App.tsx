import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { PROMPTS, RATIOS, CATEGORIES } from './constants';
import { Language, Category } from './types';
import AdControls from './components/AdControls';
import AdPreview from './components/AdPreview';
import { generateAdImage as callGeminiApi } from './services/geminiService';
import Toast from './components/ui/Toast';

const App: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES[0]);
    const [selectedLang, setSelectedLang] = useState<Language>('en');
    const [selectedTemplateId, setSelectedTemplateId] = useState<number>(1);
    const [selectedRatioId, setSelectedRatioId] = useState<string>(RATIOS[0].id);

    const [productName, setProductName] = useState('');
    const [brandName, setBrandName] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoFilePreview, setLogoFilePreview] = useState<string | null>(null);

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);
    
    const [editablePrompt, setEditablePrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; isError: boolean } | null>(null);

    const currentTemplates = useMemo(() => PROMPTS[selectedCategory] || [], [selectedCategory]);
    
    useEffect(() => {
        const currentCategoryPrompts = PROMPTS[selectedCategory] || [];
        if (currentCategoryPrompts.length > 0 && !currentCategoryPrompts.some(p => p.id === selectedTemplateId)) {
            setSelectedTemplateId(currentCategoryPrompts[0].id);
        }
    }, [selectedCategory, selectedTemplateId]);

    const selectedTemplate = useMemo(() => {
        return currentTemplates.find(t => t.id === selectedTemplateId) || (currentTemplates.length > 0 ? currentTemplates[0] : null);
    }, [currentTemplates, selectedTemplateId]);

    const basePromptText = useMemo(() => {
        if (!selectedTemplate) return '';
        let txt = selectedTemplate[selectedLang] || '';
        txt = txt.replace(/{product_name}/g, productName || '{product_name}');
        txt = txt.replace(/{discount}/g, discount || '{discount}');
        txt = txt.replace(/{brand_name}/g, brandName || '');
        txt = txt.replace(/{price}/g, price || '');
        return txt;
    }, [selectedTemplate, selectedLang, productName, brandName, price, discount]);
    
    useEffect(() => {
        setEditablePrompt(basePromptText);
    }, [basePromptText]);

    const showToast = useCallback((message: string, isError: boolean = false) => {
        setToast({ message, isError });
        setTimeout(() => setToast(null), 4000);
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setUploadedFile(file);
            setGeneratedImage(null);
            setError(null);
            const url = URL.createObjectURL(file);
            setUploadedFilePreview(url);
        }
    };
    
    const handleClearProductImage = () => {
        setUploadedFile(null);
        setUploadedFilePreview(null);
        setGeneratedImage(null);
        setError(null);
        const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
        if(fileInput) fileInput.value = "";
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setLogoFile(file);
            const url = URL.createObjectURL(file);
            setLogoFilePreview(url);
        }
    };
    
    const handleClearLogo = () => {
        setLogoFile(null);
        setLogoFilePreview(null);
        const logoInput = document.getElementById('logoUpload') as HTMLInputElement;
        if(logoInput) logoInput.value = "";
    };

    const handleGenerateClick = async () => {
        if (!uploadedFile) {
            showToast('Please upload a product photo first.', true);
            return;
        }
        
        const placeholders = [...new Set(editablePrompt.match(/{[a-zA-Z_]+}/g) || [])];
        if (placeholders.length > 0) {
            const fieldNames = placeholders.map(p =>
                p.replace(/[{}]/g, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            );
            showToast(`Please fill in the required fields: ${fieldNames.join(', ')}`, true);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const imageUrl = await callGeminiApi(editablePrompt, uploadedFile, logoFile);
            setGeneratedImage(imageUrl);
            showToast('Ad image generated successfully!');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            showToast(errorMessage, true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-screen-xl mx-auto p-4 md:p-6">
            <header className="flex gap-3 items-center mb-4">
                <h1 className="text-xl font-semibold">Prompt Book — AI Ad Generator</h1>
                <div className="ml-auto text-sm text-slate-400">AI-Powered Ad Creation</div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4">
                <AdControls
                    categories={CATEGORIES}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    selectedLang={selectedLang}
                    onLangChange={setSelectedLang}
                    templates={currentTemplates}
                    selectedTemplateId={selectedTemplateId}
                    onTemplateSelect={setSelectedTemplateId}
                    ratios={RATIOS}
                    selectedRatioId={selectedRatioId}
                    onRatioSelect={setSelectedRatioId}
                    productName={productName}
                    onProductNameChange={setProductName}
                    brandName={brandName}
                    onBrandNameChange={setBrandName}
                    price={price}
                    onPriceChange={setPrice}
                    discount={discount}
                    onDiscountChange={setDiscount}
                    basePromptText={basePromptText}
                    editablePrompt={editablePrompt}
                    onEditablePromptChange={setEditablePrompt}
                    showToast={showToast}
                    logoFile={logoFile}
                    logoFilePreview={logoFilePreview}
                    onLogoUpload={handleLogoUpload}
                    onClearLogo={handleClearLogo}
                />
                <AdPreview
                    uploadedFile={uploadedFile}
                    uploadedFilePreview={uploadedFilePreview}
                    onImageUpload={handleImageUpload}
                    onClearImage={handleClearProductImage}
                    generatedImage={generatedImage}
                    isLoading={isLoading}
                    error={error}
                    onGenerateClick={handleGenerateClick}
                />
            </main>

            <footer className="mt-6 text-center text-sm text-slate-500">
                Tip: Fill in the details, upload a product photo, and click "Generate Ad Image".
            </footer>
            {toast && <Toast message={toast.message} isError={toast.isError} />}
        </div>
    );
};

export default App;
