import { cn } from '@/lib/utils';

interface ColorSwatchProps {
  color: string;
  name: string;
  hex: string;
  className?: string;
}

function ColorSwatch({ color, name, hex, className }: ColorSwatchProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <div
        className={cn('h-16 w-full rounded-lg mb-2', color)}
        style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}
      />
      <div className="text-sm font-medium">{name}</div>
      <div className="text-xs text-medical-600">{hex}</div>
    </div>
  );
}

interface ColorSystemProps {
  className?: string;
}

export function ColorSystem({ className }: ColorSystemProps) {
  return (
    <div className={cn('space-y-8', className)}>
      <div>
        <h3 className="text-lg font-medium mb-3">主色系统</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ColorSwatch color="bg-[var(--primary)]" name="医枢蓝 (Primary)" hex="var(--primary)" />
          <ColorSwatch color="bg-[var(--primary)]" name="智能蓝 (Secondary)" hex="var(--primary)" />
          <ColorSwatch color="bg-[var(--primary)]" name="深度蓝 (Dark)" hex="var(--primary)" />
          <ColorSwatch color="bg-[var(--primary)/10]" name="浅蓝 (Light)" hex="var(--primary)/10" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">辅助色系统</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <ColorSwatch color="bg-[var(--success)]" name="健康绿" hex="var(--success)" />
          <ColorSwatch color="bg-[var(--destructive)]" name="警示红" hex="var(--destructive)" />
          <ColorSwatch color="bg-[var(--warning)]" name="提醒橙" hex="var(--warning)" />
          <ColorSwatch color="bg-[var(--primary)]" name="创新紫" hex="var(--primary)" />
          <ColorSwatch color="bg-[var(--muted-foreground)]" name="专业灰" hex="var(--muted-foreground)" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">功能色系统</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ColorSwatch color="bg-[var(--success)]" name="成功绿" hex="var(--success)" />
          <ColorSwatch color="bg-[var(--destructive)]" name="错误红" hex="var(--destructive)" />
          <ColorSwatch color="bg-[var(--warning)]" name="警告黄" hex="var(--warning)" />
          <ColorSwatch color="bg-[var(--primary)]" name="信息蓝" hex="var(--primary)" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">渐变色系统</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ColorSwatch
            color="bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]"
            name="医枢主渐变"
            hex="Linear: var(--primary) → var(--primary)"
          />
          <ColorSwatch
            color="bg-gradient-to-r from-[var(--success)] to-[var(--primary)]"
            name="健康渐变"
            hex="Linear: var(--success) → var(--primary)"
          />
          <ColorSwatch
            color="bg-gradient-to-r from-[var(--primary)] to-[var(--destructive)]"
            name="创新渐变"
            hex="Linear: var(--primary) → var(--destructive)"
          />
        </div>
      </div>
    </div>
  );
}
