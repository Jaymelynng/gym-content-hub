import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Assignment {
  id: number;
  custom_title?: string;
  custom_description?: string;
  due_date: string;
  status: string;
  assignment_templates: {
    title: string;
    description: string;
    formats_required: string[];
  };
}

interface AssignmentInfoProps {
  assignment: Assignment;
}

const AssignmentInfo: React.FC<AssignmentInfoProps> = ({ assignment }) => {
  const title = assignment.custom_title || assignment.assignment_templates.title;
  const description = assignment.custom_description || assignment.assignment_templates.description;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Badge variant="outline">
            Due: {new Date(assignment.due_date).toLocaleDateString()}
          </Badge>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default AssignmentInfo;