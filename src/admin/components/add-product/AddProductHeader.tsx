import React from 'react';
import { Save } from 'lucide-react';

interface AddProductHeaderProps {
    onPublish: () => void;
    onSaveDraft: () => void;
    isLoading?: boolean;
}

export const AddProductHeader: React.FC<AddProductHeaderProps> = ({ onPublish, onSaveDraft, isLoading }) => {
    return (
        <div className="flex justify-end mb-4 font-sans items-center gap-3">
            <button
                onClick={onPublish}
                disabled={isLoading}
                className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Publishing...' : 'Publish Product'}
            </button>
            <button
                onClick={onSaveDraft}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-primary-background text-text-primary rounded-xl text-sm font-bold hover:bg-text-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Save size={16} />
                {isLoading ? 'Saving...' : 'Save to draft'}
            </button>
        </div>
    );
};
