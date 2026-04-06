import { Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service";

export class DashboardController {
  constructor(private readonly analyticsService: AnalyticsService = new AnalyticsService()) {}

  getSummary = async (req: Request, res: Response) => {
    const summary = await this.analyticsService.getDashboardSummary(req.query as any);
    res.status(200).json({ success: true, data: summary });
  };
}
