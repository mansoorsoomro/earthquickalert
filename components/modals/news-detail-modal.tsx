'use client'

import React from 'react'
import { X, Calendar, Tag, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface NewsItem {
    tag: string
    title: string
    description: string
    time: string
    fullContent?: string
}

interface NewsDetailModalProps {
    isOpen: boolean
    onClose: () => void
    newsItem: NewsItem | null
}

export function NewsDetailModal({ isOpen, onClose, newsItem }: NewsDetailModalProps) {
    if (!isOpen || !newsItem) return null

    const tagColors = {
        Traffic: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
        Community: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
        Safety: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
        Emergency: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
    }

    const colors = tagColors[newsItem.tag as keyof typeof tagColors] || tagColors.Community

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-xs font-semibold border ${colors.border}`}>
                                    <Tag className="w-3 h-3 inline mr-1" />
                                    {newsItem.tag}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {newsItem.time}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{newsItem.title}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-4"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    <p className="text-gray-700 text-lg leading-relaxed">
                        {newsItem.description}
                    </p>

                    {newsItem.fullContent ? (
                        <div className="prose prose-sm max-w-none">
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {newsItem.fullContent}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 text-gray-600">
                            <p>
                                This is a detailed view of the news article. In a full implementation, this would contain
                                the complete article content, images, and related information.
                            </p>
                            <p>
                                For now, this modal demonstrates how news articles can be displayed in detail when users
                                click on them from the dashboard.
                            </p>
                        </div>
                    )}

                    {/* Additional Info Section */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Additional Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Category</p>
                                <p className="text-sm font-semibold text-gray-900">{newsItem.tag}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Published</p>
                                <p className="text-sm font-semibold text-gray-900">{newsItem.time}</p>
                            </div>
                        </div>
                    </div>

                    {/* Related Articles (Placeholder) */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Related Articles</h3>
                        <div className="space-y-2">
                            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                                <p className="text-sm font-semibold text-gray-900">Similar updates in your area</p>
                                <p className="text-xs text-gray-500 mt-1">Click to view more related news</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                    <Button
                        onClick={() => {
                            // Share functionality placeholder
                            if (navigator.share) {
                                navigator.share({
                                    title: newsItem.title,
                                    text: newsItem.description,
                                })
                            } else {
                                alert('Share functionality would be implemented here')
                            }
                        }}
                        className="px-4 py-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 rounded-xl flex items-center gap-2"
                    >
                        <Share2 className="w-4 h-4" />
                        Share
                    </Button>
                    <Button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl"
                    >
                        Close
                    </Button>
                </div>
            </Card>
        </div>
    )
}
