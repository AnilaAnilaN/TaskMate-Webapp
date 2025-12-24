// components/blog/ShareButtons.tsx
'use client';

import { Share2, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const shareOnSocial = (platform: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`,
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Share this article:
        </span>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => shareOnSocial('twitter')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-lg transition-all hover:scale-105"
            aria-label="Share on Twitter"
          >
            <Twitter className="w-4 h-4" />
            <span className="text-sm font-medium">Twitter</span>
          </button>
          <button 
            onClick={() => shareOnSocial('facebook')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg transition-all hover:scale-105"
            aria-label="Share on Facebook"
          >
            <Facebook className="w-4 h-4" />
            <span className="text-sm font-medium">Facebook</span>
          </button>
          <button 
            onClick={() => shareOnSocial('linkedin')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A66C2] hover:bg-[#095196] text-white rounded-lg transition-all hover:scale-105"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
            <span className="text-sm font-medium">LinkedIn</span>
          </button>
          <button 
            onClick={() => shareOnSocial('email')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all hover:scale-105"
            aria-label="Share via Email"
          >
            <Mail className="w-4 h-4" />
            <span className="text-sm font-medium">Email</span>
          </button>
        </div>
      </div>
    </div>
  );
}