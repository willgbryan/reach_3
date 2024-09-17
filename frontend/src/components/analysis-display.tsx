import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AnalysisPoint {
  key_point: string;
  important_language: string[];
}

interface AmbiguousClause {
  clause: string;
  ambiguous_language: string[];
}

interface DocumentAnalysis {
  key_points: AnalysisPoint[];
  ambiguous_clauses: AmbiguousClause[];
}

interface AnalysisDisplayProps {
  analysis: DocumentAnalysis;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold mb-4">Key Points</h2>
        {analysis.key_points.map((point, index) => (
          <Card key={index} className="mb-4">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">{point.key_point}</h3>
              <ul className="list-disc pl-5">
                {point.important_language.map((lang, i) => (
                  <li key={i} className="text-sm text-gray-600">{lang}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>
      
      <section>
        <h2 className="text-xl font-bold mb-4">Ambiguous Clauses</h2>
        {analysis.ambiguous_clauses.map((clause, index) => (
          <Card key={index} className="mb-4">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">{clause.clause}</h3>
              <ul className="list-disc pl-5">
                {clause.ambiguous_language.map((lang, i) => (
                  <li key={i} className="text-sm text-gray-600">{lang}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default AnalysisDisplay;