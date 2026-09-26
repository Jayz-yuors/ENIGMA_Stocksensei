export declare function checkBackendHealth(): Promise<{ status: string; [key: string]: any }>;

export declare function assessRisk(
  domain: 'banks' | 'lenders' | 'insurers' | 'creditfraud' | 'insurance',
  userInput: Record<string, any>,
  includeAiReasoning?: boolean
): Promise<any>;
