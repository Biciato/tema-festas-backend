import { Products } from "./products"
import { Types } from "./types";

const filterProdsCat0 = (prods, item) =>
    _.pickBy(
        filterSize(
            Object.keys(prods[item].dados).reduce(
                (sizeObj, size) => ({
                    ...sizeObj,
                    [size]: filterType(
                        Object.keys(prods[item].dados[size]).reduce(
                            (typeObj, type) => ({
                                ...typeObj,
                                [type]:
                                    type !== "valor_unitario"
                                        ? filterSubtype(
                                            prods[item].dados[size][type]
                                        )
                                        : prods[item].dados[size][type]
                            }), {}
                        )
                    )
                }), {}
            )
        ),
        size => Object.keys(size).length > 1
    )
const filterProdsCat1 = (prods, item) =>
    _.pickBy(
        filterType(
            Object.keys(prods[item].dados).reduce(
                (typeObj, type) => ({
                    ...typeObj,
                    [type]: filterSubtype(prods[item].dados[type])
                }), {}
            )
        ),
        type => Object.keys(type).length > 0
    )
const filterProdsCat2 = (prods, item) =>
    _.pickBy(
        filterType(
            Object.keys(prods[item].dados).reduce(
                (typeObj, type) => ({
                    ...typeObj,
                    [type]:
                        (!["", 0, "0", null].includes(
                            prods[item].dados[type].quantidade
                        ) &&
                            prods[item].dados[type]) ||
                        {}
                }), {}
            )
        ),
        type => Object.keys(type).length > 0
    )

const filterProdsCat3 = (prods, item) =>
    _.pickBy(
        prods[item].dados,
        subtype => !["", 0, "0", null].includes(subtype)
    )

const filterSubtype = typeObj =>
    _.pickBy(typeObj, subtype => !["", 0, "0", null].includes(subtype))

const filterType = dataObj => _.pickBy(dataObj, type => !_.isEmpty(type))

const filterSize = dataObj => _.pickBy(dataObj, size => !_.isEmpty(size))

const filtersMap = [
    filterProdsCat0,
    filterProdsCat1,
    filterProdsCat2,
    filterProdsCat3
]

export const getProdCategory = prodName =>
    [0, 1, 2, 3].find(item => Products.categories[item][prodName])

export const removeZeroQtyItems = prods =>
    Object.keys(prods)
        .filter(prod =>
            !_.isEmpty(filtersMap[getProdCategory(prod)](prods, prod)))
        .reduce((prodsObj, prod) => ({
            ...prodsObj,
            [prod]: {
                ...prods[prod],
                dados: filtersMap[getProdCategory(prod)](prods, prod),
            }
        }), {})

export const getTypes = (prodName, type) =>
    [
        Types[type],
        ((prodName.includes('ela') &&
            [...Array(10).keys()].map(x => ++x)) ||
            Types[type]),
        (Products.categories[2][prodName] || []).map(item => item.name),
        Products.categories[3].Etiquetas.names
    ][getProdCategory(prodName)]

export const getSubtypeQty = (...props) =>
    _.get(
        props[0][props[1]],
        [
            ["dados", props[2], props[3], props[4]],
            ["dados", props[3], props[4]],
            ["dados", props[4], "quantidade"],
            ["dados", props[4]]
        ][getProdCategory(props[1])]
    ) || 0

