import * as dayjs from "dayjs";

export function groupingSalesByPurchaseDate(chartdata) {
    let newData = [];
    const salesByPurchaseDate = chartdata.map((dat) => dat.children.map((child) => child.salesByPurchaseDate)).flat()
    const quantityByPurchaseDate = chartdata.map((dat) => dat.children.map((child) => child.quantityByPurchaseDate)).flat();

    salesByPurchaseDate.forEach((dates, index) =>  {
        for (const datesKey in dates) {
            if(newData.some(value => value?.type === datesKey)) {
                const indexNewData = newData.findIndex((value) => value?.type === datesKey);
                newData[indexNewData].sales += dates[datesKey]
                newData[indexNewData].quantity += quantityByPurchaseDate[index][datesKey]
            } else newData.push({type: datesKey, sales: dates[datesKey], quantity: quantityByPurchaseDate[index][datesKey]})
        }
    })
    const currentYear = dayjs().format('YYYY');
    newData = newData.filter(value => dayjs(value.type).format('YYYY') === currentYear)


    return sortDataByDate([...newData, ...monthsNameAbbreviations])
}


function sortDataByDate (data = []) {
    return data.sort((a, b) => new Date(a.type) - new Date(b.type));
}

export function getAllProducts(chartdata) {
    const groupingData = []
    const productsArray = chartdata
        .map((dat) => dat.children
            .map((datChild) => datChild.children
                .map(children => children.children))).flat(3);

    productsArray.forEach((product) => {
        if(groupingData.some(value => value.defaultCode === product.defaultCode)) {
            const indexInGroupData = groupingData.findIndex((value) => value.defaultCode === product.defaultCode)
            groupingData[indexInGroupData].ordersQuantity +=  product.ordersQuantity;
        } else groupingData.push(product)
    })
    return groupingData.sort((a, b) => b.ordersQuantity - a.ordersQuantity)
}

export function adapterDataTable(data) {
    return data.map((item) => ({name: `${item.title } - ${item.sku}`, units: item.ordersQuantity}))
}

export function getAllProductsBySales(chartdata) {
    const groupingData = []
    const productsArray = chartdata
        .map((dat) => dat.children
            .map((datChild) => datChild.children
                .map(children => children.children))).flat(3);

    productsArray.forEach((product) => {
        if(groupingData.some(value => value.defaultCode === product.defaultCode)) {
            const indexInGroupData = groupingData.findIndex((value) => value.defaultCode === product.defaultCode)
            groupingData[indexInGroupData].sumTotalSold +=  product.sumTotalSold;
        } else groupingData.push(product)
    })
    return groupingData.sort((a, b) => b.sumTotalSold - a.sumTotalSold)
}

export function adapterDataPieChart(data) {
    return data.map((item) => ({
            type: item.sku,
            value: item.sumTotalSold
        })
    ).slice(0, 10)
}


export function getMarketplacesBySales(chartdata) {
    const marketsArray = chartdata.map(dat => dat.children).flat();
    return marketsArray.map(market => ({type: market.name, value: market.sumTotalSold}))
}


export const monthsNameAbbreviations =  [
    {type: `${dayjs().get('year')}-01-01`, sales: 0, quantity: 0},
    {type: `${dayjs().get('year')}-02-01`, sales: 0, quantity: 0},
    {type: `${dayjs().get('year')}-03-01`, sales: 0, quantity: 0},
    {type: `${dayjs().get('year')}-04-01`, sales: 0, quantity: 0},
    {type: `${dayjs().get('year')}-05-01`, sales: 0, quantity: 0},
    {type: `${dayjs().get('year')}-06-01`, sales: 0, quantity: 0},
    {type: `${dayjs().get('year')}-07-01`, sales: 0, quantity: 0},
    {type: `${dayjs().get('year')}-08-01`, sales: 0, quantity: 0},
    {type: `${dayjs().get('year')}-09-01`, sales: 0, quantity: 0},
    {type: `${dayjs().get('year')}-10-01`, sales: 0, quantity: 0},
    {type: `${dayjs().get('year')}-11-01`, sales: 0, quantity: 0},
    {type: `${dayjs().get('year')}-12-01`, sales: 0, quantity: 0},

]
