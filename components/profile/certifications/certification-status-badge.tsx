import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface CertificationStatusBadgeProps {
  status: string;
}

export function CertificationStatusBadge({ status }: CertificationStatusBadgeProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          text: '已认证',
          className: 'bg-success/10 text-success',
        };
      case 'pending':
        return {
          icon: <Clock className="h-3 w-3" />,
          text: '待审核',
          className: 'bg-warning text-warning',
        };
      case 'expired':
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          text: '已过期',
          className: 'bg-destructive text-destructive',
        };
      default:
        return {
          icon: null,
          text: status,
          className: 'bg-muted text-foreground',
        };
    }
  };

  const badge = getStatusBadge(status);

  return (
    <Badge variant="outline" className={badge.className}>
      {badge.icon}
      {badge.text}
    </Badge>
  );
}
