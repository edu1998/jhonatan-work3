import { sellerMarketplaces } from './const';
import SvgAmazon from './icons/SvgAmazon';
import SvgEbay from './icons/SvgEbay';
import SvgWalmart from './icons/SvgWalmart';
import SvgShopify from './icons/SvgShopify';
import { listingStates } from './const';
const axios = require("axios");

export function keyPressSpaceBar(e) {
    const { value } = e.target;
    if (value === null || value === '') {
        var e = window.event || e;
        if (e.code == 'Space' || e.key == '') {
            e.preventDefault();
            return;
        }
    }
}

export function keyPressPhoneNumber(e) {
    var regex = new RegExp("[0-9]");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    e.preventDefault();
    return false;
}

export function clsAlphaNoOnly(e) {
    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    e.preventDefault();
    return false;
}

export function clsAlphaOnly(e) {
    var regex = new RegExp("^[A-Za-z ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    e.preventDefault();
    return false;
}

export function clsNif(e) {
    var regex = new RegExp("[A-Z]{2}\d{6}");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    e.preventDefault();
    return false;
}

export function isValidNif(abc) {
    var dni = abc.substring(2, abc.length - 1);
    var lett = abc.substring(0, 2);
    if (!isNaN(lett)) {
        // alert('falta el CL');
        return false;
    } else {
        var cadena = "TRWAGMYFPDXBNJZSQVHLCKET";
        var posicion = dni % 23;
        var letra = cadena.substring(posicion, posicion + 1);
        if (letra.trim() !== lett.toUpperCase().trim()) {
            // alert("los primeros 2 caracteres deben ser letras en mayúscula");
            return false;
        }
    }
    return true;
}

export function capitalizeFirstLetter(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export function capitalizeWord(value) {
    return value.toUpperCase();
}

export function scrapingCurrencyGoogle(from, to) {

    const options = {
        method: 'GET',
        url: 'https://google-finance4.p.rapidapi.com/search/',
        params: { q: `${from}-${to}` },
        headers: {
            'X-RapidAPI-Host': 'google-finance4.p.rapidapi.com',
            'X-RapidAPI-Key': '4b0564c0e9msh73d03a9f5b7dab1p1d298ajsn5b57c1a58216'
        }
    };

    axios.request(options).then(function (response) {
        // console.log(response.data[0].price.previous_close.toFixed(2));
    }).catch(function (error) {
        console.error(error);
    });
}

export function checkProperties(obj) {
    for (var key in obj) {
        if (typeof obj[key] !== 'boolean' && key !== 'vat') {
            if (obj[key] === null || obj[key] == "" || obj[key] === undefined) {
                return false
            }
        }
    }
    return true;
}

export function checkProfile(objPartner, objSession) {

    //Verificamos si los datos de mi cuenta estan cargados
    let fieldsPartner = ['ref', 'x_fantasy_name', 'email', 'name']
    let fieldsSession = ['birthday', 'phone', 'passport_id', 'name']

    for (var key in objPartner) {
        if (fieldsPartner.indexOf(key) > -1) {
            if (objPartner[key] === null || objPartner[key] == "" || objPartner[key] === undefined) {
                return {
                    res: false,
                    msj1: 'option.personalIncomplete'
                }
            }

        }
    }
    for (var key in objSession) {
        if (fieldsSession.indexOf(key) > -1) {
            if (objSession[key] === null || objSession[key] == "" || objSession[key] === undefined) {
                return {
                    res: false,
                    msj1: 'option.personalIncomplete'
                }
            }

        }
    }
    //Si puede publicar verificamos si tiene seller sincronizado
    if (objSession.x_can_publish) {
        //Enviamos mensaje de que debe sincronizar
        return {
            res: true,
            msj1: 'option.personalComplete',
            msj2: 'option.mustAddSeller'
        }
    } else {
        //Si no puede publciar, verificamos los datos de mi cuenta
        return {
            res: true,
            msj1: 'option.personalComplete',
            msj2: 'option.needSyncPermission'
        }
    }
}

export function nameToSlug(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '_').toLowerCase()
}

export function scrollClass(value) {
    let element = document.getElementsByClassName(value)[0]
    let rect = element.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: rect, behavior: 'smooth' });
}

export function padLeadingZeros(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

export function getSvgMarketPlace(marketplace, showCountryCode) {
    switch (marketplace) {
        case sellerMarketplaces.AMAZON_MX:
            return getSvgWithCountryCode(sellerMarketplaces.AMAZON, 'MX', showCountryCode);
        case sellerMarketplaces.AMAZON_BR:
            return getSvgWithCountryCode(sellerMarketplaces.AMAZON, 'BR', showCountryCode);
        case sellerMarketplaces.AMAZON_CA:
            return getSvgWithCountryCode(sellerMarketplaces.AMAZON, 'CA', showCountryCode);
        case sellerMarketplaces.AMAZON:
            return getSvgWithCountryCode(sellerMarketplaces.AMAZON, 'US', showCountryCode);
        case sellerMarketplaces.EBAY:
            return getSvgWithCountryCode(sellerMarketplaces.EBAY, 'US', showCountryCode);
        case sellerMarketplaces.EBAY_CA:
            return getSvgWithCountryCode(sellerMarketplaces.EBAY, 'CA', showCountryCode);
        case sellerMarketplaces.EBAY_ES:
            return getSvgWithCountryCode(sellerMarketplaces.EBAY, 'ES', showCountryCode);
        case sellerMarketplaces.EBAY_DE:
            return getSvgWithCountryCode(sellerMarketplaces.EBAY, 'DE', showCountryCode);
        case sellerMarketplaces.WALMART:
            return <SvgWalmart />;
        case sellerMarketplaces.SHOPIFY:
            return <SvgShopify />;
        default:
            return <></>;
    }
}

function getSvgWithCountryCode(marketplace, countryCode, showCountryCode) {
    switch (marketplace) {
        case sellerMarketplaces.AMAZON:
            return <><SvgAmazon />{showCountryCode && <span className="textMarketPlaceCountry">{countryCode}</span>}</>;
        case sellerMarketplaces.EBAY:
            return <><SvgEbay />{showCountryCode && <span className="textMarketPlaceCountry">{countryCode}</span>}</>
        default: return null;
    }
}

export function convertToInches(unity, value) {
    switch (unity) {
        case 'millimeters':
            return parseFloat(value * 0.039370).toFixed(2);
        case 'CENTIMETER':
        case 'centimeters':
            return parseFloat(value * 0.39370).toFixed(2);
        case 'METER':
        case 'meters':
            return parseFloat(value * 39.370).toFixed(2);
        case 'FEET':
        case 'feet':
        case 'ft':
            return parseFloat(value * 12).toFixed(2);
        case 'yards':
            return parseFloat(value * 36).toFixed(2);
        case 'INCH':
        case 'inches':
        case 'in':
            return value;
        default:
            return 0;
    }
}

export function convertToFeets(unity, value) {
    switch (unity) {
        case 'millimeters':
            return parseFloat(value * 0.0032808).toFixed(2);
        case 'CENTIMETER':
        case 'centimeters':
            return parseFloat(value * 0.032808).toFixed(2);
        case 'METER':
        case 'meters':
            return parseFloat(value * 3.2808).toFixed(2);
        case 'INCH':
        case 'inches':
        case 'in':
            return parseFloat(value * 0.0833333).toFixed(2);
        case 'yards':
            return parseFloat(value * 3).toFixed(2);
        case 'FEET':
        case 'feet':
        case 'ft':
            return value;
        default:
            return 0;
    }
}

export function convertToPounds(unity, value) {
    switch (unity) {
        case 'GRAM':
        case 'grams':
        case 'g':
            return parseFloat(value * 0.0022046).toFixed(2);
        case 'KILOGRAM':
        case 'kilograms':
        case 'kg':
            return parseFloat(value * 2.2046).toFixed(2);
        case 'OUNCE':
        case 'ounces':
        case 'oz':
            return parseFloat(value * 0.0625).toFixed(2);
        case 'milligrams':
            return parseFloat(value * 2.20462e-6).toFixed(2);
        case 'ton':
            return parseFloat(value * 2204.6).toFixed(2);
        case 'POUND':
        case 'pounds':
        case 'lb':
            return value;
        default:
            return 0;
    }
}

export function canEdit(session, tab, state) {
    if (tab === 'Client') {
        return state === listingStates.PENDING_CLIENT || state === listingStates.PENDING;
    } else if (tab === 'LAP') {
        return session && session.userInfo.role === 'Admin' && state === listingStates.PENDING_LAP;
    }
    return false;
}