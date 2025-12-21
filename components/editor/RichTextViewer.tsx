// components/editor/RichTextViewer.tsx
// ==========================================
// Use this component to display saved HTML content
'use client';

interface RichTextViewerProps {
  content: string;
}

export default function RichTextViewer({ content }: RichTextViewerProps) {
  if (!content || content === '<p></p>') {
    return (
      <p className="text-gray-500 italic">No description provided</p>
    );
  }

  return (
    <div 
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}