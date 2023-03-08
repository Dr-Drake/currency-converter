export interface CurrencyExchangeResponse{
    "success": boolean;
    "timestamp": number;
    "base": string;
    "date": string; //"2023-03-08",
    "rates": { [key: string]: number }
}