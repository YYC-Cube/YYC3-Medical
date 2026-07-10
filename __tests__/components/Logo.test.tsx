import { render, screen } from '@testing-library/react';
import { Logo } from '@/components/brand/logo';

describe('Logo Component', () => {
  it('renders logo with default props (no text)', () => {
    render(<Logo />);

    const logoImage = screen.getByAltText('YYC³-Med Logo');
    expect(logoImage).toBeInTheDocument();

    // 默认 showText=false，不应渲染文字
    const chineseText = screen.queryByText('YanYuCloud');
    expect(chineseText).not.toBeInTheDocument();
  });

  it('renders text when showText is true', () => {
    render(<Logo showText={true} />);

    const logoImage = screen.getByAltText('YYC³-Med Logo');
    expect(logoImage).toBeInTheDocument();

    const chineseText = screen.getByText('YanYuCloud');
    expect(chineseText).toBeInTheDocument();

    const englishText = screen.getByText('YYC³-Med');
    expect(englishText).toBeInTheDocument();
  });

  it('applies correct size (lg = 64x64)', () => {
    render(<Logo size="lg" />);

    const logoImage = screen.getByAltText('YYC³-Med Logo');
    expect(logoImage).toHaveAttribute('width', '64');
    expect(logoImage).toHaveAttribute('height', '64');
  });

  it('applies compact variant gap', () => {
    const { container } = render(<Logo variant="compact" />);

    // compact 变体应使用 gap-1
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('gap-1');
  });

  it('applies animation classes when animated is true', () => {
    const { container } = render(<Logo animated={true} />);

    // animated 在图片上添加 hover:scale-110，并在外层 div 添加 animate-pulse
    const logoImage = screen.getByAltText('YYC³-Med Logo');
    expect(logoImage.className).toContain('hover:scale-110');

    const pulseWrapper = container.querySelector('.animate-pulse');
    expect(pulseWrapper).toBeInTheDocument();
  });
});
