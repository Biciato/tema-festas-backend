import { Products } from "./products";

const filterProdsCat0 = (prods, item) =>
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
                        }),
                        {}
                    )
                )
            }),
            {}
        )
    );
const filterProdsCat1 = (prods, item) =>
    filterType(
        Object.keys(prods[item].dados).reduce(
            (typeObj, type) => ({
                ...typeObj,
                [type]: filterSubtype(prods[item].dados[type])
            }),
            {}
        )
    );
const filterProdsCat2 = (prods, item) =>
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
            }),
            {}
        )
    );

const filterProdsCat3 = (prods, item) =>
    _.pickBy(
        prods[item].dados,
        subtype => !["", 0, "0", null].includes(subtype)
    );

const filterSubtype = typeObj =>
    _.pickBy(typeObj, subtype => !["", 0, "0", null].includes(subtype));

const filterType = dataObj => _.pickBy(dataObj, type => !_.isEmpty(type));

const filterSize = dataObj => _.pickBy(dataObj, size => !_.isEmpty(size));

export const getProdCategory = prodName =>
    [0, 1, 2, 3].find(item => Products.categories[item][prodName]);

export const removeZeroQtyItems = prods => {
    Object.keys(prods).forEach(prod => {
        const data = [
            () => filterProdsCat0(prods, prod),
            () => filterProdsCat1(prods, prod),
            () => filterProdsCat2(prods, prod),
            () => filterProdsCat3(prods, prod)
        ][prods[prod].tipo_categoria]();
        _.isEmpty(data) ? delete prods[prod] : (prods[prod].dados = data);
    });
    return prods;
};
