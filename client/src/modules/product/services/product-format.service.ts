import { Currency, CURRENCY_SYMBOL } from '@modules/product/enums/Currency';

class ProductFormatService {
    formatPrice(amount: number, currency: Currency): string {
        return `${CURRENCY_SYMBOL[currency]}${amount}`;
    }
}

export default new ProductFormatService;
