export default function toCurrency(i) {
    let v = i.replace('R$', '').trim().replace(/\D/g,'')
    v = (v/100).toFixed(2) + ''
    v = v.replace(".", ",")
            .replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,")
            .replace(/(\d)(\d{3}),/g, "$1.$2,")
    return v;
}