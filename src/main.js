/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
    const { discount, sale_price, quantity } = purchase;
    return sale_price * quantity * (1 - discount / 100);
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге

    const { profit } = seller;
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
    // @TODO: Проверка входных данных
    // if (!data
    //     || !Array.isArray(data.sellers)
    //     || data.sellers.length === 0
    //     || !Array.isArray(data.products)
    //     || data.products.length === 0
    //     || !Array.isArray(data.purchase_records)
    //     || data.purchase_records.length === 0
    // ) {
    //     throw new Error('Некорректные входные данные');
    // }

    // @TODO: Проверка наличия опций

    // if (!typeof options === "object"
    //     || !typeof options.calculateRevenue === "function"
    //     || !typeof options.calculateBonus === "function"
    // ) {
    //     throw new Error('Некорректно переданные функции расчета выручки и бонусов');
    // }

    const { calculateRevenue, calculateBonus } = options;

    // @TODO: Подготовка промежуточных данных для сбора статистики

    const sellerStats = data.sellers.map((sellers) => {
        return {
            id : sellers.id,
            name: `${sellers.first_name} ${sellers.last_name}`,
            start_date: sellers.start_date,
            position: sellers.position,
            revenue: 0,
            profit: 0,
            sales_count: 0,
            products_sold: {}
        };
    });

    // @TODO: Индексация продавцов и товаров для быстрого доступа

    const sellerIndex = sellerStats.reduce((acc, sellers) => {
        return {
            ...acc,
            [sellers.id]: sellers
        }
    }, {});

    const productIndex = data.products.reduce((acc, productInf) => {
        return {
            ...acc,
            [productInf.sku] : productInf
        }
    }, {});

    console.log(productIndex);

    // @TODO: Расчет выручки и прибыли для каждого продавца

    data.purchase_records.forEach(receipt => {
            const seller = sellerIndex[receipt.seller_id];
            if (seller) {
                seller.sales_count += 1;
                seller.revenue += receipt.total_amount;
            } else throw new Error('Поле "Продавец" пустое');

            receipt.items.forEach(item => {
                const product = productIndex[item.sku];
                if (seller) {
                    const costProduct = product.purchase_price * item.quantity;
                    const revenue = calculateRevenue(item, product);
                    const profit = revenue - costProduct;
                    seller.profit += profit;

                    if (!seller.products_sold[item.sku]) {
                        seller.products_sold[item.sku] = 0;
                    }
                    seller.products_sold[item.sku] += item.quantity;
                } else throw new Error('Поле "SKU" пустое');
            });
    });

    console.log(sellerIndex);
    // @TODO: Сортировка продавцов по прибыли



    // @TODO: Назначение премий на основе ранжирования



    // @TODO: Подготовка итоговой коллекции с нужными полями
}

analyzeSalesData(data, {calculateRevenue: calculateSimpleRevenue});