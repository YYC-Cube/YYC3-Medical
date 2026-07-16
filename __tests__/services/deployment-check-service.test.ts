import { CheckStatus, deploymentCheckService } from '@/services/deployment-check-service';

describe('services/deployment-check-service', () => {
  describe('determineOverallStatus', () => {
    it('returns ERROR when any check has ERROR', () => {
      const result = deploymentCheckService.determineOverallStatus({
        system: { status: CheckStatus.SUCCESS, items: [], timestamp: '' },
        performance: { status: CheckStatus.WARNING, items: [], timestamp: '' },
        security: { status: CheckStatus.ERROR, items: [], timestamp: '' },
      });
      expect(result).toBe(CheckStatus.ERROR);
    });

    it('returns WARNING when no ERROR but has WARNING', () => {
      const result = deploymentCheckService.determineOverallStatus({
        system: { status: CheckStatus.SUCCESS, items: [], timestamp: '' },
        compatibility: { status: CheckStatus.WARNING, items: [], timestamp: '' },
      });
      expect(result).toBe(CheckStatus.WARNING);
    });

    it('returns SUCCESS when all checks pass', () => {
      const result = deploymentCheckService.determineOverallStatus({
        system: { status: CheckStatus.SUCCESS, items: [], timestamp: '' },
        performance: { status: CheckStatus.SUCCESS, items: [], timestamp: '' },
      });
      expect(result).toBe(CheckStatus.SUCCESS);
    });

    it('returns ERROR for empty results', () => {
      const result = deploymentCheckService.determineOverallStatus({});
      expect(result).toBe(CheckStatus.ERROR);
    });

    it('prioritizes ERROR over WARNING', () => {
      const result = deploymentCheckService.determineOverallStatus({
        system: { status: CheckStatus.WARNING, items: [], timestamp: '' },
        security: { status: CheckStatus.ERROR, items: [], timestamp: '' },
        api: { status: CheckStatus.WARNING, items: [], timestamp: '' },
      });
      expect(result).toBe(CheckStatus.ERROR);
    });
  });

  describe('generateRecommendations', () => {
    it('returns success recommendations when overall status is SUCCESS', () => {
      const recs = deploymentCheckService.generateRecommendations({
        overallStatus: CheckStatus.SUCCESS,
      });
      expect(recs).toContain('系统检查通过，可以安全部署');
      expect(recs).toHaveLength(2);
    });

    it('returns warning recommendations when overall status is WARNING', () => {
      const recs = deploymentCheckService.generateRecommendations({
        overallStatus: CheckStatus.WARNING,
        performance: { status: CheckStatus.WARNING, items: [], timestamp: '' },
      });
      expect(recs).toContain('系统检查发现警告，建议在部署前解决这些问题');
      expect(recs.some(r => r.includes('优化系统性能'))).toBe(true);
    });

    it('returns error recommendations when overall status is ERROR', () => {
      const recs = deploymentCheckService.generateRecommendations({
        overallStatus: CheckStatus.ERROR,
        security: { status: CheckStatus.ERROR, items: [], timestamp: '' },
      });
      expect(recs).toContain('系统检查发现严重错误，强烈建议在解决这些问题后再进行部署');
      expect(recs.some(r => r.includes('修复所有安全漏洞'))).toBe(true);
    });

    it('includes database error recommendations', () => {
      const recs = deploymentCheckService.generateRecommendations({
        overallStatus: CheckStatus.ERROR,
        database: { status: CheckStatus.ERROR, items: [], timestamp: '' },
      });
      expect(recs.some(r => r.includes('解决数据库问题'))).toBe(true);
    });

    it('includes API error recommendations', () => {
      const recs = deploymentCheckService.generateRecommendations({
        overallStatus: CheckStatus.ERROR,
        api: { status: CheckStatus.ERROR, items: [], timestamp: '' },
      });
      expect(recs.some(r => r.includes('修复API错误'))).toBe(true);
    });
  });

  describe('generateReport', () => {
    it('generates a JSON blob with report data', () => {
      const blob = deploymentCheckService.generateReport({
        overallStatus: CheckStatus.SUCCESS,
        system: { status: CheckStatus.SUCCESS, items: [], timestamp: '2024-01-01' },
      });

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/json');
    });
  });
});