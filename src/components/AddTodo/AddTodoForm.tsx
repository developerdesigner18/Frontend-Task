"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, FileText, AlertCircle, XCircle, Edit3, Plus, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface AddTodoFormProps {
    defaultValues?: {
        id?: string;
        title?: string;
        description?: string;
        fileUrl?: string;
    };
    onSubmit?: (formData: FormData) => Promise<void>;
}

export default function AddTodoForm({ defaultValues, onSubmit }: AddTodoFormProps) {
    const router = useRouter();

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [title, setTitle] = useState(defaultValues?.title || '');
    const [description, setDescription] = useState(defaultValues?.description || '');
    const [fileUrl, setFileUrl] = useState(defaultValues?.fileUrl || '');

    const isEditMode = !!defaultValues?.id;

    useEffect(() => {
        if (defaultValues?.title) setTitle(defaultValues.title);
        if (defaultValues?.description) setDescription(defaultValues.description);
        if (defaultValues?.fileUrl) setFileUrl(defaultValues.fileUrl);
    }, [defaultValues]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!title.trim()) return setError('Title is required');
        if (!description.trim()) return setError('Description is required');

        const formData = new FormData();
        formData.set('title', title.trim());
        formData.set('description', description.trim());

        if (selectedFile) {
            formData.set('file', selectedFile);
        }

        setLoading(true);
        try {
            await onSubmit?.(formData);
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Failed to submit todo');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                setError('Only PDF files are allowed.');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setError('Max file size is 10MB.');
                return;
            }
            setSelectedFile(file);
            setError(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-10 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500 to-blue-700 rounded-full opacity-10 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300 to-purple-500 rounded-full opacity-5 animate-pulse delay-500"></div>
            </div>

            <div className="relative container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center mb-8">
                        <Link
                            href="/"
                            className="flex items-center text-blue-600 hover:text-blue-700 mr-6 group transition-all duration-200"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                            <span className="font-medium">Back to Todos</span>
                        </Link>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                            <div className="flex items-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mr-4">
                                    {isEditMode ? (
                                        <Edit3 className="w-6 h-6 text-white" />
                                    ) : (
                                        <Plus className="w-6 h-6 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">
                                        {isEditMode ? 'Edit Todo' : 'Create New Todo'}
                                    </h1>
                                    <p className="text-blue-100 mt-1">
                                        {isEditMode ? 'Update your task details' : 'Add a new task to stay organized'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="p-8">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 animate-fadeIn">
                                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-red-800 font-medium">Error</h3>
                                        <p className="text-red-600 text-sm mt-1">{error}</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div className="group">
                                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 transition-all duration-200 group-focus-within:shadow-lg"
                                        placeholder="Enter a descriptive title for your todo"
                                    />
                                </div>

                                {/* Description */}
                                <div className="group">
                                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 resize-none transition-all duration-200 group-focus-within:shadow-lg"
                                        placeholder="Provide detailed information about your task..."
                                    />
                                </div>

                                {/* File Upload */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        PDF Attachment <span className="text-gray-500 font-normal">(Optional)</span>
                                    </label>

                                    {!selectedFile && fileUrl ? (
                                        // Existing file display
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-xl border border-blue-200 shadow-sm">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center justify-center w-10 h-10 bg-blue-200 rounded-lg">
                                                    <FileText className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Existing PDF file</p>
                                                    <p className="text-sm text-blue-600">Currently attached to this todo</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-3">
                                                <Button
                                                    variant="primary"
                                                    type="button"
                                                    onClick={() => window.open(fileUrl, '_blank')}
                                                    className="!px-3 !py-1.5 text-sm"
                                                >
                                                    View PDF
                                                </Button>
                                                <Button
                                                variant='danger'
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedFile(null);
                                                        setFileUrl("");
                                                    }}
                                                    className="!px-3 !py-1.5 text-sm"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ) : !selectedFile ? (
                                        // Upload UI
                                        <>
                                            <input
                                                type="file"
                                                id="file"
                                                name="file"
                                                accept="application/pdf"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                            <label
                                                htmlFor="file"
                                                className="flex items-center justify-center px-6 py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 group transition-all duration-200"
                                            >
                                                <div className="text-center">
                                                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 group-hover:bg-blue-100 rounded-xl mx-auto mb-3 transition-colors duration-200">
                                                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                                                    </div>
                                                    <p className="text-base font-medium text-gray-600 group-hover:text-blue-600 transition-colors duration-200">
                                                        Click to upload PDF file
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">Maximum file size: 10MB</p>
                                                </div>
                                            </label>
                                        </>
                                    ) : (
                                        // Selected file display
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-xl border border-green-200 shadow-sm">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center justify-center w-10 h-10 bg-green-200 rounded-lg">
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{selectedFile.name}</p>
                                                    <p className="text-sm text-green-600">
                                                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedFile(null)}
                                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-all duration-200"
                                                title="Remove file"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4 pt-6 border-t border-gray-200">
                                    <Button
                                        type="submit"
                                        loading={loading}
                                        loadingText={isEditMode ? 'Updating...' : 'Creating...'}
                                        variant="primary"
                                        size="lg"
                                        className="flex-1"
                                    >
                                        {isEditMode ? 'Update Todo' : 'Create Todo'}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => router.push('/')}
                                        variant="secondary"
                                        size="lg"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Additional info */}
                    <div className="text-center mt-6">
                        <p className="text-xs text-gray-500">
                            {isEditMode ? 'Update your todo to keep your tasks organized' : 'Create todos to stay productive and organized'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}