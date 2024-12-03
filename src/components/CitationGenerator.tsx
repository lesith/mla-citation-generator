"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Plus, Trash2 } from 'lucide-react';

type CitationType = 'book' | 'journal' | 'website';

interface Citation {
  type: CitationType;
  authors: string;
  title: string;
  publisher: string;
  year: string;
  url: string;
  containerTitle: string;
  volume: string;
  issue: string;
  pages: string;
  id: number;
}

const CitationGenerator = () => {
  const [citations, setCitations] = useState<Citation[]>([{
    type: 'book',
    authors: '',
    title: '',
    publisher: '',
    year: '',
    url: '',
    containerTitle: '',
    volume: '',
    issue: '',
    pages: '',
    id: Date.now()
  }]);

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const formatAuthors = (authors: string): string => {
    if (!authors) return '';
    const authorList = authors.split(',').map(author => author.trim());
    if (authorList.length === 1) {
      return `${authorList[0]}.`;
    } else if (authorList.length === 2) {
      return `${authorList[0]}, and ${authorList[1]}.`;
    } else if (authorList.length > 2) {
      return `${authorList[0]}, et al.`;
    }
    return '';
  };

  const generateCitation = (citation: Citation): string => {
    switch (citation.type) {
      case 'book':
        return `${formatAuthors(citation.authors)} "${citation.title}." ${citation.publisher}, ${citation.year}.`;
      
      case 'journal':
        return `${formatAuthors(citation.authors)} "${citation.title}." ${citation.containerTitle}, vol. ${citation.volume}, no. ${citation.issue}, ${citation.year}, pp. ${citation.pages}.`;
      
      case 'website':
        return `${formatAuthors(citation.authors)} "${citation.title}." ${citation.containerTitle}, ${citation.year}, ${citation.url}.`;
      
      default:
        return '';
    }
  };

  const handleChange = (index: number, field: keyof Citation, value: string) => {
    const newCitations = [...citations];
    newCitations[index] = {
      ...newCitations[index],
      [field]: value
    };
    setCitations(newCitations);
  };

  const addCitation = () => {
    setCitations([...citations, {
      type: 'book',
      authors: '',
      title: '',
      publisher: '',
      year: '',
      url: '',
      containerTitle: '',
      volume: '',
      issue: '',
      pages: '',
      id: Date.now()
    }]);
  };

  const removeCitation = (index: number) => {
    const newCitations = citations.filter((_, i) => i !== index);
    setCitations(newCitations);
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>MLA 9th Edition Citation Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {citations.map((citation, index) => (
              <div key={citation.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <Select
                    value={citation.type}
                    onValueChange={(value: CitationType) => handleChange(index, 'type', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="book">Book</SelectItem>
                      <SelectItem value="journal">Journal</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCitation(index)}
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-4">
                  <Input
                    placeholder="Authors (separate with commas)"
                    value={citation.authors}
                    onChange={(e) => handleChange(index, 'authors', e.target.value)}
                  />
                  <Input
                    placeholder="Title"
                    value={citation.title}
                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                  />

                  {citation.type === 'book' && (
                    <>
                      <Input
                        placeholder="Publisher"
                        value={citation.publisher}
                        onChange={(e) => handleChange(index, 'publisher', e.target.value)}
                      />
                    </>
                  )}

                  {citation.type === 'journal' && (
                    <>
                      <Input
                        placeholder="Journal Title"
                        value={citation.containerTitle}
                        onChange={(e) => handleChange(index, 'containerTitle', e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Volume"
                          value={citation.volume}
                          onChange={(e) => handleChange(index, 'volume', e.target.value)}
                        />
                        <Input
                          placeholder="Issue"
                          value={citation.issue}
                          onChange={(e) => handleChange(index, 'issue', e.target.value)}
                        />
                      </div>
                      <Input
                        placeholder="Pages"
                        value={citation.pages}
                        onChange={(e) => handleChange(index, 'pages', e.target.value)}
                      />
                    </>
                  )}

                  {citation.type === 'website' && (
                    <>
                      <Input
                        placeholder="Website Name"
                        value={citation.containerTitle}
                        onChange={(e) => handleChange(index, 'containerTitle', e.target.value)}
                      />
                      <Input
                        placeholder="URL"
                        value={citation.url}
                        onChange={(e) => handleChange(index, 'url', e.target.value)}
                      />
                    </>
                  )}

                  <Input
                    placeholder="Year"
                    value={citation.year}
                    onChange={(e) => handleChange(index, 'year', e.target.value)}
                  />

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Generated Citation:</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(generateCitation(citation), index)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-2 text-sm">{generateCitation(citation)}</p>
                    {copiedIndex === index && (
                      <p className="text-sm text-green-600 mt-1">Copied!</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <Button onClick={addCitation} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Another Citation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CitationGenerator;
