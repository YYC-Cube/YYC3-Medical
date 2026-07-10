'use client';

import { CardFooter } from '@/components/ui/card';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar } from 'lucide-react';

interface ExpirationReminderProps {
  expiryDate?: string;
}

export function ExpirationReminder({ expiryDate = '2028-06-30' }: ExpirationReminderProps) {
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    const calculateDaysRemaining = () => {
      const now = new Date();
      const expiry = new Date(expiryDate);
      const diff = expiry.getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 3600 * 24));
      setDaysRemaining(days);
    };

    calculateDaysRemaining();
  }, [expiryDate]);

  const getReminderColor = () => {
    if (daysRemaining <= 30) return 'bg-destructive text-destructive';
    if (daysRemaining <= 90) return 'bg-warning text-warning';
    return 'bg-success/10 text-success';
  };

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg">资质有效期提醒</CardTitle>
        <CardDescription>您的执业医师资格证即将到期</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">有效期至</p>
            <p className="font-medium">{expiryDate}</p>
          </div>
          <Badge className={getReminderColor()}>
            {daysRemaining} 天
            <Calendar className="h-3 w-3 ml-1" />
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline">
          <AlertTriangle className="h-4 w-4 mr-1" />
          立即更新
        </Button>
      </CardFooter>
    </Card>
  );
}
