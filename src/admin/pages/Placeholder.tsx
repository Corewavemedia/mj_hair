import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';

interface PlaceholderProps {
    title: string;
}

export const Placeholder: React.FC<PlaceholderProps> = ({ title }) => {
    return (
        <MainLayout>
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-text-primary font-sans mb-4">{title}</h1>
                    <p className="text-gray-500 dark:text-gray-400">This page is currently under construction.</p>
                </div>
            </div>
        </MainLayout>
    );
};
