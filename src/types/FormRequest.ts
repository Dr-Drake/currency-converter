export interface FormRequest{
    fromCurrency: string;
    inputAmount?: string;
    toCurrency: string;
    outputAmount?: string;
    selector: 'from' | 'to';
}