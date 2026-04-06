import { Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service";

export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService = new AnalyticsService()) {}

  getDetailedAnalytics = async (req: Request, res: Response) => {
    const analytics = await this.analyticsService.getDetailedAnalytics(req.query as any);
    res.status(200).json({ success: true, data: analytics });
  };
}
