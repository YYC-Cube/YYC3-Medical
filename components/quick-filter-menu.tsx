'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Beaker,
  FlaskConical,
  Calendar,
} from 'lucide-react';
import type { ExperimentFilters } from './experiment-filter-drawer';

interface QuickFilterMenuProps {
  onApplyFilter?: (partialFilters: Partial<ExperimentFilters>) => void;
  onFilterSelect?: (partialFilters: Partial<ExperimentFilters>) => void;
}

export function QuickFilterMenu({ onApplyFilter, onFilterSelect }: QuickFilterMenuProps) {
  const handleApply = onApplyFilter || onFilterSelect || (() => {});
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          快速筛选
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>常用筛选</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleApply({ statuses: ['进行中'] })}>
            <Clock className="h-4 w-4 mr-2 text-primary" />
            <span>进行中的研究</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleApply({ statuses: ['已批准'] })}>
            <CheckCircle className="h-4 w-4 mr-2 text-success" />
            <span>已批准的研究</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleApply({ statuses: ['计划中'] })}>
            <AlertTriangle className="h-4 w-4 mr-2 text-warning" />
            <span>计划中的研究</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>研究类型</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleApply({ types: ['临床研究'] })}>
            <Users className="h-4 w-4 mr-2 text-primary" />
            <span>临床研究</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleApply({ types: ['动物实验'] })}>
            <Beaker className="h-4 w-4 mr-2 text-warning" />
            <span>动物实验</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleApply({ types: ['方法学研究'] })}>
            <FlaskConical className="h-4 w-4 mr-2 text-primary" />
            <span>方法学研究</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>时间范围</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              const today = new Date();
              const threeMonthsAgo = new Date();
              threeMonthsAgo.setMonth(today.getMonth() - 3);

              handleApply({
                dateRange: {
                  from: threeMonthsAgo,
                  to: today,
                },
              });
            }}
          >
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>最近三个月</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              const today = new Date();
              const sixMonthsAgo = new Date();
              sixMonthsAgo.setMonth(today.getMonth() - 6);

              handleApply({
                dateRange: {
                  from: sixMonthsAgo,
                  to: today,
                },
              });
            }}
          >
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>最近六个月</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              const today = new Date();
              const oneYearAgo = new Date();
              oneYearAgo.setFullYear(today.getFullYear() - 1);

              handleApply({
                dateRange: {
                  from: oneYearAgo,
                  to: today,
                },
              });
            }}
          >
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>最近一年</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
