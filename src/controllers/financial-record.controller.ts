import { Request, Response } from "express";
import { FinancialRecordService } from "../services/financial-record.service";

export class FinancialRecordController {
  constructor(private readonly financialRecordService: FinancialRecordService = new FinancialRecordService()) {}

  createRecord = async (req: Request, res: Response) => {
    const record = await this.financialRecordService.createRecord({
      ...req.body,
      createdBy: req.user!.id,
    });
    res.status(201).json({ success: true, data: record });
  };

  listRecords = async (req: Request, res: Response) => {
    const records = await this.financialRecordService.listRecords(req.query as any);
    res.status(200).json({ success: true, data: records.data, meta: records.meta });
  };

  getRecordById = async (req: Request, res: Response) => {
    const record = await this.financialRecordService.getRecordById(req.params.id as string);
    res.status(200).json({ success: true, data: record });
  };

  updateRecord = async (req: Request, res: Response) => {
    const record = await this.financialRecordService.updateRecord(req.params.id as string, req.body);
    res.status(200).json({ success: true, data: record });
  };

  deleteRecord = async (req: Request, res: Response) => {
    const result = await this.financialRecordService.deleteRecord(req.params.id as string);
    res.status(200).json({ success: true, data: result });
  };
}
